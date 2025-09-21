package middleware

import (
	"crypto/rsa"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/hashicorp/go-retryablehttp"
	"github.com/lestrrat-go/jwx/v2/jwk"

	"storage-service/internal/config"
	"storage-service/internal/utils"
	"storage-service/pkg/logger"
)

type JWTMiddleware struct {
	config      *config.ExternalJWTConfig
	logger      *logger.Logger
	keyCache    map[string]*rsa.PublicKey
	cacheMutex  sync.RWMutex
	cacheExpiry map[string]time.Time
	httpClient  *retryablehttp.Client
}

type JWTClaims struct {
	jwt.RegisteredClaims
	UserID   string                 `json:"user_id,omitempty"`
	Email    string                 `json:"email,omitempty"`
	Username string                 `json:"username,omitempty"`
	Roles    []string               `json:"roles,omitempty"`
	Custom   map[string]interface{} `json:"custom,omitempty"`
}

type JWKSResponse struct {
	Keys []struct {
		Kty string   `json:"kty"`
		Kid string   `json:"kid"`
		Use string   `json:"use"`
		N   string   `json:"n"`
		E   string   `json:"e"`
		X5c []string `json:"x5c"`
		Alg string   `json:"alg"`
	} `json:"keys"`
}

func NewJWTMiddleware(cfg *config.ExternalJWTConfig, log *logger.Logger) *JWTMiddleware {
	httpClient := retryablehttp.NewClient()
	httpClient.RetryMax = 3
	httpClient.RetryWaitMin = 1 * time.Second
	httpClient.RetryWaitMax = 3 * time.Second
	httpClient.Logger = nil // Disable retryablehttp logging

	return &JWTMiddleware{
		config:      cfg,
		logger:      log,
		keyCache:    make(map[string]*rsa.PublicKey),
		cacheExpiry: make(map[string]time.Time),
		httpClient:  httpClient,
	}
}

func (j *JWTMiddleware) ValidateJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			j.logger.Warn("Missing Authorization header")
			utils.UnauthorizedError(c, "Missing Authorization header")
			c.Abort()
			return
		}

		// Check Bearer prefix
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			j.logger.Warn("Invalid Authorization header format")
			utils.UnauthorizedError(c, "Invalid Authorization header format")
			c.Abort()
			return
		}

		// Parse and validate token
		token, claims, err := j.parseAndValidateToken(tokenString)
		if err != nil {
			j.logger.WithField("error", err.Error()).Warn("JWT validation failed")
			utils.UnauthorizedError(c, "Invalid token")
			c.Abort()
			return
		}

		if !token.Valid {
			j.logger.Warn("Invalid JWT token")
			utils.UnauthorizedError(c, "Invalid token")
			c.Abort()
			return
		}

		// Extract user information from claims
		userID := j.extractUserID(claims)
		if userID == "" {
			j.logger.Warn("Unable to extract user ID from token")
			utils.UnauthorizedError(c, "Invalid token claims")
			c.Abort()
			return
		}

		// Set user context
		c.Set("user_id", userID)
		c.Set("user_email", claims.Email)
		c.Set("user_username", claims.Username)
		c.Set("user_roles", claims.Roles)
		c.Set("issuer", claims.Issuer)
		c.Set("jwt_claims", claims)

		j.logger.WithFields(map[string]interface{}{
			"user_id": userID,
			"issuer":  claims.Issuer,
		}).Debug("JWT validated successfully")

		c.Next()
	}
}

func (j *JWTMiddleware) parseAndValidateToken(tokenString string) (*jwt.Token, *JWTClaims, error) {
	// Parse token without verification first to get header
	unverifiedToken, _, err := new(jwt.Parser).ParseUnverified(tokenString, &JWTClaims{})
	if err != nil {
		return nil, nil, fmt.Errorf("failed to parse token: %w", err)
	}

	// Get key ID from header
	kid, ok := unverifiedToken.Header["kid"].(string)
	if !ok {
		return nil, nil, fmt.Errorf("missing kid in token header")
	}

	// Get algorithm from header
	alg, ok := unverifiedToken.Header["alg"].(string)
	if !ok {
		return nil, nil, fmt.Errorf("missing alg in token header")
	}

	// Check if algorithm is allowed
	if !j.isAlgorithmAllowed(alg) {
		return nil, nil, fmt.Errorf("algorithm %s is not allowed", alg)
	}

	// Find matching issuer configuration
	var issuerConfig *config.IdentityProvider
	for _, issuer := range j.config.Issuers {
		if issuer.Issuer == unverifiedToken.Claims.(*JWTClaims).Issuer {
			issuerConfig = &issuer
			break
		}
	}

	if issuerConfig == nil {
		return nil, nil, fmt.Errorf("unknown issuer: %s", unverifiedToken.Claims.(*JWTClaims).Issuer)
	}

	// Get public key for verification
	publicKey, err := j.getPublicKey(issuerConfig.JWKSURL, kid)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get public key: %w", err)
	}

	// Parse and validate token with public key
	claims := &JWTClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return publicKey, nil
	}, jwt.WithValidMethods(j.config.AllowedAlgorithms))

	if err != nil {
		return nil, nil, fmt.Errorf("failed to validate token: %w", err)
	}

	// Validate issuer
	if claims.Issuer != issuerConfig.Issuer {
		return nil, nil, fmt.Errorf("invalid issuer")
	}

	// Validate audience if specified
	if len(issuerConfig.Audience) > 0 {
		validAudience := false
		for _, aud := range issuerConfig.Audience {
			for _, claimAud := range claims.Audience {
				if claimAud == aud {
					validAudience = true
					break
				}
			}
			if validAudience {
				break
			}
		}
		if !validAudience {
			return nil, nil, fmt.Errorf("invalid audience")
		}
	}

	// Validate expiration with clock skew
	if claims.ExpiresAt != nil {
		if time.Now().Add(j.config.ClockSkew).After(claims.ExpiresAt.Time) {
			return nil, nil, fmt.Errorf("token is expired")
		}
	}

	// Validate not before with clock skew
	if claims.NotBefore != nil {
		if time.Now().Add(-j.config.ClockSkew).Before(claims.NotBefore.Time) {
			return nil, nil, fmt.Errorf("token is not valid yet")
		}
	}

	return token, claims, nil
}

func (j *JWTMiddleware) getPublicKey(jwksURL, kid string) (*rsa.PublicKey, error) {
	cacheKey := fmt.Sprintf("%s:%s", jwksURL, kid)

	// Check cache first
	j.cacheMutex.RLock()
	if key, exists := j.keyCache[cacheKey]; exists {
		if expiry, hasExpiry := j.cacheExpiry[cacheKey]; hasExpiry && time.Now().Before(expiry) {
			j.cacheMutex.RUnlock()
			return key, nil
		}
	}
	j.cacheMutex.RUnlock()

	// Fetch JWKS
	resp, err := j.httpClient.Get(jwksURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch JWKS: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("JWKS endpoint returned status %d", resp.StatusCode)
	}

	// Parse JWKS using jwx library
	keySet, err := jwk.ParseReader(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to parse JWKS: %w", err)
	}

	// Find key with matching kid
	key, found := keySet.LookupKeyID(kid)
	if !found {
		return nil, fmt.Errorf("key with kid %s not found", kid)
	}

	// Convert to RSA public key
	var rawKey interface{}
	if err := key.Raw(&rawKey); err != nil {
		return nil, fmt.Errorf("failed to get raw key: %w", err)
	}

	rsaKey, ok := rawKey.(*rsa.PublicKey)
	if !ok {
		return nil, fmt.Errorf("key is not an RSA public key")
	}

	// Cache the key
	j.cacheMutex.Lock()
	j.keyCache[cacheKey] = rsaKey
	j.cacheExpiry[cacheKey] = time.Now().Add(j.config.JWKSCacheTTL)
	j.cacheMutex.Unlock()

	return rsaKey, nil
}

func (j *JWTMiddleware) isAlgorithmAllowed(alg string) bool {
	for _, allowedAlg := range j.config.AllowedAlgorithms {
		if alg == allowedAlg {
			return true
		}
	}
	return false
}

func (j *JWTMiddleware) extractUserID(claims *JWTClaims) string {
	// Try UserID field first
	if claims.UserID != "" {
		return claims.UserID
	}

	// Try Subject
	if claims.Subject != "" {
		// Validate UUID format
		if _, err := uuid.Parse(claims.Subject); err == nil {
			return claims.Subject
		}
	}

	// Try custom claims
	if claims.Custom != nil {
		if userID, ok := claims.Custom["user_id"].(string); ok && userID != "" {
			return userID
		}
		if userID, ok := claims.Custom["sub"].(string); ok && userID != "" {
			return userID
		}
	}

	return ""
}

// Optional middleware for role-based access control
func (j *JWTMiddleware) RequireRole(requiredRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRoles, exists := c.Get("user_roles")
		if !exists {
			utils.ForbiddenError(c, "No roles found in token")
			c.Abort()
			return
		}

		roles, ok := userRoles.([]string)
		if !ok {
			utils.ForbiddenError(c, "Invalid roles format")
			c.Abort()
			return
		}

		// Check if user has any of the required roles
		hasRole := false
		for _, requiredRole := range requiredRoles {
			for _, userRole := range roles {
				if userRole == requiredRole {
					hasRole = true
					break
				}
			}
			if hasRole {
				break
			}
		}

		if !hasRole {
			utils.ForbiddenError(c, "Insufficient permissions")
			c.Abort()
			return
		}

		c.Next()
	}
}
