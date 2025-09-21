# API Project Planning Document

## Project Overview

A comprehensive Golang REST API project featuring file upload/download capabilities with MinIO object storage, MariaDB for metadata persistence, **external JWT verification** from multiple identity providers, API versioning, comprehensive documentation with Scalar, rate limiting, and production-ready logging.

## Tech Stack

### Core Framework
- **Framework**: Gin Web Framework
- **Language**: Go 1.21+
- **HTTP Router**: Gin with middleware support

### Storage & Database
- **Object Storage**: MinIO (S3-compatible)
- **Database**: MariaDB 10.6+
- **ORM**: GORM v2 with MySQL driver

### Authentication & Security
- **Authentication**: External JWT Verification (Auth0, Firebase, Azure AD, etc.)
- **Rate Limiting**: golang.org/x/time/rate + Redis (optional)
- **CORS**: Built-in Gin CORS middleware

### Documentation & Monitoring
- **API Documentation**: Scalar with OpenAPI 3.0
- **Logging**: Structured logging (logrus/zap) - File + Console
- **Health Checks**: Built-in endpoints

## Project Structure

```
project-root/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── config/                  # Configuration management
│   │   ├── config.go
│   │   └── database.go
│   ├── handlers/                # HTTP handlers (controllers)
│   │   ├── auth.go
│   │   ├── file.go
│   │   └── health.go
│   ├── middleware/              # Custom middleware
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── logger.go
│   │   └── ratelimit.go
│   ├── models/                  # Database models
│   │   ├── user.go
│   │   └── file.go
│   ├── services/                # Business logic layer
│   │   ├── jwt_external.go      # External JWT verification
│   │   ├── jwks_client.go       # JWKS client for public keys
│   │   ├── file.go
│   │   └── minio.go
│   └── utils/                   # Utility functions
│       ├── claims.go
│       ├── response.go
│       └── validator.go
├── pkg/                         # Public packages
│   ├── logger/
│   │   └── logger.go
│   └── database/
│       └── connection.go
├── api/                         # API documentation
│   ├── swagger.yaml             # OpenAPI specification
│   └── docs/                    # Generated docs
├── configs/                     # Configuration files
│   ├── app.yaml
│   ├── identity-providers.yaml  # External JWT configs
│   └── docker-compose.yml
├── scripts/                     # Database migrations & scripts
│   ├── migrations/
│   └── seed.sql
├── logs/                        # Log files directory
├── uploads/                     # Temp upload directory
├── docker-compose.yml           # Container orchestration
├── Dockerfile                   # Docker configuration
├── go.mod                       # Go module dependencies
├── go.sum                       # Go module checksums
├── .env                         # Environment variables
└── README.md                    # Project documentation
```

## Dependencies & Packages

### Core Dependencies
```go
// Framework
github.com/gin-gonic/gin v1.9.1

// Database
gorm.io/gorm v1.25.5
gorm.io/driver/mysql v1.5.2

// MinIO Storage
github.com/minio/minio-go/v7 v7.0.63

// External JWT Authentication
github.com/golang-jwt/jwt/v5 v5.1.0
github.com/MicahParks/jwkset v0.5.4
github.com/lestrrat-go/jwx/v2 v2.0.17

// Rate Limiting
golang.org/x/time v0.4.0
github.com/go-chi/httprate v0.7.4

// Logging
github.com/sirupsen/logrus v1.9.3
// OR github.com/uber-go/zap v1.26.0

// Configuration
github.com/spf13/viper v1.17.0

// Validation
github.com/go-playground/validator/v10 v10.15.5

// Scalar API Documentation
github.com/MarceloPetrucio/go-scalar-api-reference v1.0.0

// CORS
github.com/gin-contrib/cors v1.4.0

// HTTP Client with retry
github.com/hashicorp/go-retryablehttp v0.7.4

// UUID Generation
github.com/google/uuid v1.4.0
```

## API Design & Versioning

### API Versioning Strategy
- **URL Path Versioning**: `/api/v1/`, `/api/v2/`
- **Header Versioning**: `Accept: application/vnd.api+json;version=1`
- **Default Version**: v1

### API Endpoints Structure

#### File Management Endpoints (All require external JWT)
```
POST   /api/v1/files/upload        # Upload single file
POST   /api/v1/files/multi-upload  # Upload multiple files
GET    /api/v1/files               # List user files with pagination
GET    /api/v1/files/:id           # Get file metadata
GET    /api/v1/files/:id/download  # Download file
DELETE /api/v1/files/:id           # Delete file
PUT    /api/v1/files/:id           # Update file metadata
```

#### User Profile Endpoints
```
GET    /api/v1/profile             # Get current user profile
PUT    /api/v1/profile             # Update user profile
```

#### System Endpoints
```
GET    /api/v1/health              # Health check
GET    /api/v1/metrics             # Basic metrics
GET    /docs                       # Scalar API documentation
```

**Note**: No authentication endpoints (login/register) since JWT is provided by external identity providers.

## Database Schema Design

### Users Table (Synchronized from JWT Claims)
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,                    -- From JWT 'sub' claim
    username VARCHAR(50) UNIQUE,                   -- From JWT preferred_username/email
    email VARCHAR(100) UNIQUE,                     -- From JWT 'email' claim
    display_name VARCHAR(100),                     -- From JWT 'name' claim
    issuer VARCHAR(255) NOT NULL,                  -- From JWT 'iss' claim
    external_id VARCHAR(255) NOT NULL,             -- Original external user ID
    roles JSON,                                    -- From JWT 'roles' claim
    permissions JSON,                              -- From JWT custom claims
    is_active BOOLEAN DEFAULT true,
    first_login_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_external_id_issuer (external_id, issuer),
    INDEX idx_email (email),
    INDEX idx_issuer (issuer)
);
```

### Files Table
```sql
CREATE TABLE files (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    checksum VARCHAR(64),
    bucket_name VARCHAR(100) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_stored_name (stored_name),
    INDEX idx_created_at (created_at)
);
```

## JWT Authentication (External Verification)

### External JWT Configuration
```go
type ExternalJWTConfig struct {
    // Multiple identity providers support
    Issuers         []IdentityProvider `mapstructure:"issuers"`
    JWKSCacheTTL    time.Duration     `mapstructure:"jwks_cache_ttl"`    // 1 hour
    JWKSTimeout     time.Duration     `mapstructure:"jwks_timeout"`      // 10 seconds
    AllowedAlgorithms []string        `mapstructure:"allowed_algorithms"` // ["RS256", "ES256"]
    ClockSkew       time.Duration     `mapstructure:"clock_skew"`        // 5 minutes
}

type IdentityProvider struct {
    Name            string   `mapstructure:"name"`            // "auth0", "firebase", "custom"
    Issuer          string   `mapstructure:"issuer"`          // "https://your-tenant.auth0.com/"
    Audience        []string `mapstructure:"audience"`        // ["api-identifier"]
    JWKSURL         string   `mapstructure:"jwks_url"`        // "https://your-tenant.auth0.com/.well-known/jwks.json"
    UsernameClaim   string   `mapstructure:"username_claim"`  // "sub", "email", "preferred_username"
    RolesClaim      string   `mapstructure:"roles_claim"`     // "roles", "permissions", "scope"
}
```

### JWT Verification Flow
1. **Extract JWT** - Từ Authorization header (Bearer token)
2. **Parse Header** - Lấy `kid` (Key ID) và `alg` (Algorithm)
3. **Fetch Public Key** - Từ JWKS endpoint based on issuer
4. **Verify Signature** - Sử dụng public key tương ứng
5. **Validate Claims** - Issuer, audience, expiration, custom claims
6. **Extract User Info** - Username, roles từ verified claims

### External JWT Service Implementation
```go
type ExternalJWTService interface {
    VerifyToken(ctx context.Context, tokenString string) (*UserClaims, error)
    RefreshJWKS(ctx context.Context, issuer string) error
    GetPublicKey(ctx context.Context, issuer string, keyID string) (interface{}, error)
}

type UserClaims struct {
    UserID      string   `json:"sub"`
    Username    string   `json:"preferred_username,omitempty"`
    Email       string   `json:"email,omitempty"`
    Roles       []string `json:"roles,omitempty"`
    Permissions []string `json:"permissions,omitempty"`
    Issuer      string   `json:"iss"`
    Audience    []string `json:"aud"`
    ExpiresAt   int64    `json:"exp"`
    IssuedAt    int64    `json:"iat"`
    NotBefore   int64    `json:"nbf,omitempty"`
}
```

### JWKS (JSON Web Key Set) Integration
```go
type JWKSClient struct {
    cache       map[string]*jwkset.JWKSet
    cacheMutex  sync.RWMutex
    httpClient  *http.Client
    cacheTTL    time.Duration
}

// Auto-refresh JWKS from multiple identity providers
func (j *JWKSClient) FetchJWKS(ctx context.Context, jwksURL string) (*jwkset.JWKSet, error) {
    // HTTP client với timeout và retry logic
    // Cache public keys với TTL
    // Background refresh để tránh blocking
}
```

### Multi-Issuer JWT Middleware
```go
func ExternalJWTMiddleware(jwtService ExternalJWTService) gin.HandlerFunc {
    return func(c *gin.Context) {
        // Extract token from Authorization header
        authHeader := c.GetHeader("Authorization")
        if !strings.HasPrefix(authHeader, "Bearer ") {
            c.JSON(401, gin.H{"error": "Missing or invalid Authorization header"})
            c.Abort()
            return
        }

        token := strings.TrimPrefix(authHeader, "Bearer ")

        // Verify token với external JWT service
        userClaims, err := jwtService.VerifyToken(c.Request.Context(), token)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid JWT token", "details": err.Error()})
            c.Abort()
            return
        }

        // Set user info in context
        c.Set("user_id", userClaims.UserID)
        c.Set("username", userClaims.Username)
        c.Set("user_roles", userClaims.Roles)
        c.Set("user_permissions", userClaims.Permissions)
        c.Set("issuer", userClaims.Issuer)

        c.Next()
    }
}
```

### Supported Identity Providers
- **Auth0**: Support Auth0 Management API integration
- **Firebase**: Google Firebase Authentication
- **Azure AD**: Microsoft Azure Active Directory
- **Keycloak**: Open-source Identity Provider
- **Custom JWT**: Self-hosted identity services
- **AWS Cognito**: Amazon Cognito User Pools

### JWT Validation Rules
```go
type ValidationConfig struct {
    RequiredClaims    []string    `json:"required_claims"`     // ["sub", "aud", "exp"]
    AllowedIssuers    []string    `json:"allowed_issuers"`     // Whitelist of trusted issuers
    AllowedAudiences  []string    `json:"allowed_audiences"`   // Expected audience values
    MaxTokenAge       time.Duration `json:"max_token_age"`     // Maximum token age (24h)
    RequireRole       bool        `json:"require_role"`        // Require role claim
    RequirePermission bool        `json:"require_permission"`  // Require permission claim
}
```

### Token Claims Mapping
```go
// Map external identity provider claims to internal user model
func mapExternalClaims(claims *UserClaims, issuer string) *models.User {
    user := &models.User{
        ID:       claims.UserID,
        Username: claims.Username,
        Email:    claims.Email,
        IsActive: true,
        Roles:    claims.Roles,
    }

    // Provider-specific mapping
    switch {
    case strings.Contains(issuer, "auth0.com"):
        // Auth0 specific claim mapping
        user.Username = claims.Email // Auth0 uses email as username
    case strings.Contains(issuer, "firebase.google.com"):
        // Firebase specific claim mapping  
    case strings.Contains(issuer, "login.microsoftonline.com"):
        // Azure AD specific claim mapping
    }

    return user
}
```

## MinIO Integration

### MinIO Configuration
```go
type MinIOConfig struct {
    Endpoint        string
    AccessKey       string
    SecretKey       string
    UseSSL          bool
    BucketName      string
    Region          string
}
```

### File Upload Flow
1. **Validate JWT** - Verify external JWT token
2. **Validate Request** - Check file type, size limits
3. **Generate UUID** - Create unique file identifier
4. **Upload to MinIO** - Store file with metadata
5. **Save Metadata** - Store file info in MariaDB with user from JWT
6. **Return Response** - File ID and access URL

### MinIO Service Implementation
```go
type MinIOService interface {
    UploadFile(ctx context.Context, file io.Reader, fileName string, contentType string) error
    DownloadFile(ctx context.Context, fileName string) (*minio.Object, error)
    DeleteFile(ctx context.Context, fileName string) error
    GetFileURL(fileName string, expiry time.Duration) (string, error)
}
```

## Rate Limiting Strategy

### Rate Limiting Configuration
```go
type RateLimitConfig struct {
    RequestsPerMinute int           // 100 requests per minute
    BurstSize         int           // 10 burst requests
    IPWhitelist       []string      // Whitelisted IPs
    EnableRedis       bool          // Distributed rate limiting
    UserBasedLimit    bool          // Rate limit by JWT user_id
}
```

### Implementation Levels
1. **Global Rate Limit**: 1000 req/min across all users
2. **Per-User Rate Limit**: 100 req/min per JWT user_id
3. **Per-IP Rate Limit**: 60 req/min per IP address
4. **Endpoint-Specific**: File upload 10 req/min
5. **Issuer-Based**: Different limits per identity provider

### Rate Limiting Middleware
```go
func RateLimitMiddleware(config RateLimitConfig) gin.HandlerFunc {
    // Implementation với golang.org/x/time/rate
    // Support for JWT user-based limiting
    // Support for both in-memory and Redis-backed limiters
}
```

## Logging Strategy

### Logging Configuration
```go
type LogConfig struct {
    Level          string    // debug, info, warn, error
    Format         string    // json, text
    OutputFile     string    // logs/app.log
    OutputConsole  bool      // true/false
    MaxSize        int       // 100MB
    MaxAge         int       // 30 days
    MaxBackups     int       // 5 files
    Compress       bool      // true
}
```

### Log Structure (JSON Format)
```json
{
  "timestamp": "2025-09-20T14:30:45.123Z",
  "level": "info",
  "message": "File uploaded successfully",
  "request_id": "req-123456",
  "user_id": "user-789",
  "issuer": "https://your-tenant.auth0.com/",
  "method": "POST",
  "path": "/api/v1/files/upload",
  "status_code": 201,
  "response_time": "234ms",
  "file_size": 1024000,
  "file_type": "image/jpeg"
}
```

### Logging Categories
1. **Request/Response Logs**: HTTP request details với JWT user info
2. **Business Logic Logs**: File operations, user actions
3. **Error Logs**: Application errors và JWT verification failures
4. **Performance Logs**: Response times, database queries
5. **Security Logs**: JWT verification attempts, rate limit hits
6. **External Logs**: JWKS fetching, identity provider communication

### Log Rotation & Management
- Daily log rotation with timestamp
- Compress old log files
- Automatic cleanup after retention period
- Separate error logs from info logs

## Scalar API Documentation

### Scalar Integration
```go
import (
    "github.com/MarceloPetrucio/go-scalar-api-reference"
)

func setupScalarDocs(router *gin.Engine) {
    router.GET("/docs", func(c *gin.Context) {
        htmlContent, err := scalar.ApiReferenceHTML(&scalar.Options{
            SpecURL: "./api/swagger.yaml",
            CustomOptions: scalar.CustomOptions{
                PageTitle: "File Management API",
            },
            DarkMode: true,
        })

        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        c.Data(200, "text/html", []byte(htmlContent))
    })
}
```

### OpenAPI Specification Structure
```yaml
openapi: 3.0.3
info:
  title: File Management API
  version: 1.0.0
  description: Comprehensive file management API with external JWT verification
  contact:
    name: API Support
    email: support@example.com
servers:
  - url: http://localhost:8080/api/v1
    description: Development server
  - url: https://api.example.com/api/v1
    description: Production server
components:
  securitySchemes:
    ExternalJWT:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token from external identity provider (Auth0, Firebase, etc.)
security:
  - ExternalJWT: []
```

## Configuration Management

### Environment Variables
```bash
# Application
APP_ENV=development
APP_PORT=8080
APP_VERSION=1.0.0

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=storage-service

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET=files

# External JWT Configuration
JWT_JWKS_CACHE_TTL=1h
JWT_JWKS_TIMEOUT=10s
JWT_ALLOWED_ALGORITHMS=RS256,ES256
JWT_CLOCK_SKEW=5m

# Identity Providers (can support multiple)
# Auth0
AUTH0_ISSUER=https://your-tenant.auth0.com/
AUTH0_AUDIENCE=your-api-identifier
AUTH0_JWKS_URL=https://your-tenant.auth0.com/.well-known/jwks.json

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_ISSUER=https://securetoken.google.com/your-firebase-project
FIREBASE_AUDIENCE=your-firebase-project

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_BURST_SIZE=10
RATE_LIMIT_USER_BASED=true

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE_PATH=logs/app.log
```

### Configuration Struct
```go
type Config struct {
    App      AppConfig              `mapstructure:"app"`
    Database DatabaseConfig         `mapstructure:"database"`
    MinIO    MinIOConfig            `mapstructure:"minio"`
    JWT      ExternalJWTConfig      `mapstructure:"jwt"`
    RateLimit RateLimitConfig       `mapstructure:"rate_limit"`
    Log      LogConfig              `mapstructure:"log"`
}
```

## Development Workflow

### Phase 1: Foundation Setup (Week 1)
- [ ] Project structure initialization
- [ ] Go module setup với external JWT dependencies
- [ ] Docker Compose for MariaDB + MinIO
- [ ] Basic Gin server với health endpoint
- [ ] Database connection và migration setup

### Phase 2: External JWT Authentication (Week 2)
- [ ] JWKS client implementation cho multiple providers
- [ ] External JWT verification service
- [ ] JWT middleware cho token validation
- [ ] User synchronization từ JWT claims
- [ ] Multi-issuer support configuration

### Phase 3: File Management Core (Week 2-3)
- [ ] MinIO service integration
- [ ] File model và metadata schema với user từ JWT
- [ ] File upload endpoint với JWT user context
- [ ] File download endpoint với authorization
- [ ] File listing với user-based filtering

### Phase 4: Advanced Features (Week 3)
- [ ] Rate limiting middleware với JWT user-based limiting
- [ ] Comprehensive logging với JWT context
- [ ] Error handling và validation
- [ ] File deletion và update operations với ownership check
- [ ] Multi-file upload support

### Phase 5: Documentation & Testing (Week 4)
- [ ] OpenAPI specification với JWT security scheme
- [ ] Scalar documentation integration
- [ ] Unit tests cho external JWT verification
- [ ] Integration tests với mocked JWT tokens
- [ ] Performance testing

### Phase 6: Production Readiness (Week 4)
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Security hardening
- [ ] Multi-provider JWT configuration
- [ ] Deployment documentation

## Security Considerations

### JWT Security
- **Token Validation**: Comprehensive signature verification với multiple algorithms
- **Issuer Whitelisting**: Only trusted identity providers
- **Audience Validation**: Ensure tokens are intended for this API
- **Clock Skew Handling**: Allow reasonable time differences
- **Key Rotation**: Automatic JWKS refresh để handle key rotation

### Input Validation
- File type validation (whitelist approach)
- File size limits per user role từ JWT
- Filename sanitization
- Request payload validation

### Authorization
- **User-based Access**: Files accessible only by owner (from JWT sub)
- **Role-based Access**: Different permissions based on JWT roles
- **Admin Override**: Special admin roles có thể access all files
- **Audit Logging**: Log all file access attempts với user context

### General Security
- CORS configuration
- Request size limits
- SQL injection prevention
- XSS protection headers
- Rate limiting per user từ JWT

## Performance Optimizations

### JWT Optimizations
- **JWKS Caching**: Cache public keys với TTL
- **Background Refresh**: Refresh JWKS without blocking requests
- **Connection Pooling**: Reuse HTTP connections for JWKS requests
- **Circuit Breaker**: Handle identity provider downtime

### Database Optimizations
- Proper indexing strategy cho user-based queries
- Connection pooling
- Query optimization với user context
- Database migrations

### File Storage Optimizations
- MinIO bucket policies
- Multipart upload for large files
- CDN integration cho public files
- File compression options

### Application Optimizations
- HTTP/2 support
- Response compression
- Caching strategies
- Background job processing

## Monitoring & Observability

### Health Checks
```go
GET /api/v1/health
Response: {
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-09-20T14:30:45Z",
  "services": {
    "database": "healthy",
    "minio": "healthy",
    "jwks_providers": {
      "auth0": "healthy",
      "firebase": "healthy"
    }
  }
}
```

### Metrics Collection
- Request count và response times per identity provider
- JWT verification success/failure rates
- File upload/download statistics per user
- Database connection pool metrics
- JWKS fetch performance metrics

### Error Tracking
- JWT verification failures với detailed reasons
- Identity provider connectivity issues
- File operation errors với user context
- Performance bottleneck identification

## Deployment Strategy

### Docker Configuration
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/configs ./configs
EXPOSE 8080
CMD ["./main"]
```

### Docker Compose Services
- Application container với external JWT config
- MariaDB database
- MinIO object storage
- Redis for distributed rate limiting

### Environment Configuration
- Development: Local containers với mock identity provider
- Staging: Real identity providers với staging configs
- Production: Production identity providers với proper security

## Testing Strategy

### Unit Tests
- External JWT verification logic
- JWKS client functionality
- User claim mapping
- File service operations

### Integration Tests
- End-to-end JWT verification flow
- Multiple identity provider support
- Database operations với user context
- MinIO storage operations với authorization

### Security Tests
- JWT token validation edge cases
- Authorization bypass attempts
- Rate limiting effectiveness
- Input validation security

## Documentation Requirements

### Technical Documentation
- API endpoint documentation với JWT authentication examples
- Identity provider integration guides
- Database schema documentation
- Deployment guide với multiple JWT providers

### User Documentation
- JWT token integration guide cho different providers
- File upload examples với proper authorization
- Error codes reference
- Rate limiting guidelines

## Conclusion

This updated planning document provides a comprehensive roadmap for building a production-ready file management API with **external JWT verification** from multiple identity providers. The implementation focuses on security, scalability, and maintainability while providing seamless integration with existing authentication systems như Auth0, Firebase, Azure AD, và custom identity providers.

Key success metrics:
- **JWT Verification**: <50ms average verification time with JWKS caching
- **Multi-Provider Support**: Seamless switching between identity providers
- **Security**: Comprehensive token validation với proper error handling
- **Performance**: API response time <200ms cho file operations
- **Scalability**: Support thousands of concurrent users với different identity providers
- **Monitoring**: Complete observability across all identity providers

