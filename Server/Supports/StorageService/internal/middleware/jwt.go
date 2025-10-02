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
	keyCache    map[string]interface{} // Changed to interface{} to support both RSA and HMAC keys
	cacheMutex  sync.RWMutex
	cacheExpiry map[string]time.Time
	httpClient  *retryablehttp.Client
}

type JWTClaims struct {
	jwt.RegisteredClaims
	// Standard claims
	UserID   string   `json:"user_id,omitempty"`
	Email    string   `json:"email,omitempty"`
	Username string   `json:"username,omitempty"`
	Roles    []string `json:"roles,omitempty"`

	// C# service specific claims
	JID            string `json:"jid,omitempty"`            // JWT ID
	NameID         string `json:"nameid,omitempty"`         // Name identifier
	UniqueName     string `json:"unique_name,omitempty"`    // Unique name (email)
	FirstName      string `json:"firstName,omitempty"`      // First name
	LastName       string `json:"lastName,omitempty"`       // Last name
	EmailConfirmed string `json:"emailConfirmed,omitempty"` // Email confirmation status
	Role           string `json:"role,omitempty"`           // Single role (C# format)

	// Custom claims for extensibility
	Custom map[string]interface{} `json:"custom,omitempty"`
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
		K   string   `json:"k"` // Added for symmetric keys (HMAC)
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
		keyCache:    make(map[string]interface{}),
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
		c.Set("user_email", j.extractEmail(claims))
		c.Set("user_username", j.extractUsername(claims))
		c.Set("user_roles", j.extractRoles(claims))
		c.Set("user_first_name", claims.FirstName)
		c.Set("user_last_name", claims.LastName)
		c.Set("user_full_name", j.extractFullName(claims))
		c.Set("email_confirmed", claims.EmailConfirmed == "True")
		c.Set("issuer", claims.Issuer)
		c.Set("jwt_id", claims.JID)
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

	// Get key for verification (can be RSA public key or HMAC secret)
	key, err := j.getVerificationKey(issuerConfig.JWKSURL, kid)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get verification key: %w", err)
	}

	// Parse and validate token with key
	claims := &JWTClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return key, nil
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

// Updated method name and return type to handle both RSA and HMAC keys
func (j *JWTMiddleware) getVerificationKey(jwksURL, kid string) (interface{}, error) {
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
	jwkKey, found := keySet.LookupKeyID(kid)
	if !found {
		return nil, fmt.Errorf("key with kid %s not found", kid)
	}

	// Get the key type
	keyType := jwkKey.KeyType()

	var verificationKey interface{}

	switch keyType {
	case "RSA":
		// Handle RSA keys (asymmetric)
		var rawKey interface{}
		if err := jwkKey.Raw(&rawKey); err != nil {
			return nil, fmt.Errorf("failed to get raw RSA key: %w", err)
		}

		rsaKey, ok := rawKey.(*rsa.PublicKey)
		if !ok {
			return nil, fmt.Errorf("key is not an RSA public key")
		}
		verificationKey = rsaKey

	case "oct":
		// Handle symmetric keys (HMAC)
		var rawKey interface{}
		if err := jwkKey.Raw(&rawKey); err != nil {
			return nil, fmt.Errorf("failed to get raw symmetric key: %w", err)
		}

		symmetricKey, ok := rawKey.([]byte)
		if !ok {
			return nil, fmt.Errorf("symmetric key is not in the expected format")
		}
		verificationKey = symmetricKey

	default:
		return nil, fmt.Errorf("unsupported key type: %s", keyType)
	}

	// Cache the key
	j.cacheMutex.Lock()
	j.keyCache[cacheKey] = verificationKey
	j.cacheExpiry[cacheKey] = time.Now().Add(j.config.JWKSCacheTTL)
	j.cacheMutex.Unlock()

	return verificationKey, nil
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
	// Try NameID first (C# service primary identifier)
	if claims.NameID != "" {
		// Validate UUID format
		if _, err := uuid.Parse(claims.NameID); err == nil {
			return claims.NameID
		}
	}

	// Try Subject (standard JWT claim)
	if claims.Subject != "" {
		// Validate UUID format
		if _, err := uuid.Parse(claims.Subject); err == nil {
			return claims.Subject
		}
	}

	// Try UserID field
	if claims.UserID != "" {
		// Validate UUID format
		if _, err := uuid.Parse(claims.UserID); err == nil {
			return claims.UserID
		}
	}

	// Try custom claims
	if claims.Custom != nil {
		if userID, ok := claims.Custom["user_id"].(string); ok && userID != "" {
			if _, err := uuid.Parse(userID); err == nil {
				return userID
			}
		}
		if userID, ok := claims.Custom["nameid"].(string); ok && userID != "" {
			if _, err := uuid.Parse(userID); err == nil {
				return userID
			}
		}
	}

	return ""
}

func (j *JWTMiddleware) extractEmail(claims *JWTClaims) string {
	// Try Email field first
	if claims.Email != "" {
		return claims.Email
	}

	// Try UniqueName (C# service uses this for email)
	if claims.UniqueName != "" {
		return claims.UniqueName
	}

	return ""
}

func (j *JWTMiddleware) extractUsername(claims *JWTClaims) string {
	// Try Username field first
	if claims.Username != "" {
		return claims.Username
	}

	// Try UniqueName (C# service uses this)
	if claims.UniqueName != "" {
		return claims.UniqueName
	}

	// Try Email as fallback
	if claims.Email != "" {
		return claims.Email
	}

	return ""
}

func (j *JWTMiddleware) extractRoles(claims *JWTClaims) []string {
	var roles []string

	// Try Roles array first (standard format)
	if len(claims.Roles) > 0 {
		roles = append(roles, claims.Roles...)
	}

	// Try single Role field (C# service format)
	if claims.Role != "" {
		// Check if it's already in the roles array
		found := false
		for _, role := range roles {
			if role == claims.Role {
				found = true
				break
			}
		}
		if !found {
			roles = append(roles, claims.Role)
		}
	}

	// Try custom claims
	if claims.Custom != nil {
		if rolesClaim, ok := claims.Custom["roles"]; ok {
			switch v := rolesClaim.(type) {
			case []string:
				roles = append(roles, v...)
			case []interface{}:
				for _, role := range v {
					if roleStr, ok := role.(string); ok {
						roles = append(roles, roleStr)
					}
				}
			case string:
				roles = append(roles, v)
			}
		}
	}

	return roles
}

func (j *JWTMiddleware) extractFullName(claims *JWTClaims) string {
	if claims.FirstName != "" && claims.LastName != "" {
		return claims.FirstName + " " + claims.LastName
	}
	if claims.FirstName != "" {
		return claims.FirstName
	}
	if claims.LastName != "" {
		return claims.LastName
	}
	return j.extractUsername(claims)
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
