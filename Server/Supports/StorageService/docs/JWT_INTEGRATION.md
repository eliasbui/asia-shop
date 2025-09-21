# JWT Integration với C# Service

Hướng dẫn chi tiết để tích hợp Storage Service với JWT được tạo từ C# service.

## 📋 Yêu cầu

1. **C# Service** phải expose JWKS endpoint (JSON Web Key Set)
2. **JWT Token** phải chứa các claims cần thiết
3. **Cấu hình** phù hợp trong Storage Service

---

## 🔧 Cấu hình C# Service

### 1. Tạo JWKS Endpoint trong C#

```csharp
[ApiController]
[Route(".well-known")]
public class JwksController : ControllerBase
{
    private readonly IConfiguration _configuration;
    
    public JwksController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("jwks.json")]
    public IActionResult GetJwks()
    {
        var rsa = GetRSAKey(); // Your RSA key
        var parameters = rsa.ExportParameters(false);
        
        var jwks = new
        {
            keys = new[]
            {
                new
                {
                    kty = "RSA",
                    use = "sig",
                    kid = "your-key-id", // Unique key identifier
                    alg = "RS256",
                    n = Convert.ToBase64String(parameters.Modulus).TrimEnd('=').Replace('+', '-').Replace('/', '_'),
                    e = Convert.ToBase64String(parameters.Exponent).TrimEnd('=').Replace('+', '-').Replace('/', '_')
                }
            }
        };
        
        return Ok(jwks);
    }
}
```

### 2. Tạo JWT Token với Claims phù hợp

```csharp
public string GenerateJwtToken(User user)
{
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = GetRSAKey(); // Your RSA private key
    
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[]
        {
            new Claim("sub", user.Id.ToString()),           // User ID (UUID)
            new Claim("user_id", user.Id.ToString()),       // Alternative user ID
            new Claim("email", user.Email),                 // Email
            new Claim("username", user.Username),           // Username
            new Claim("roles", JsonSerializer.Serialize(user.Roles)), // Roles array
            // Custom claims
            new Claim("custom", JsonSerializer.Serialize(new
            {
                department = user.Department,
                permissions = user.Permissions
            }))
        }),
        Expires = DateTime.UtcNow.AddHours(1),
        Issuer = "https://your-auth-service.com",           // Your issuer URL
        Audience = "storage-service",                       // Target audience
        SigningCredentials = new SigningCredentials(
            new RsaSecurityKey(key), 
            SecurityAlgorithms.RsaShaSha256
        )
    };
    
    tokenDescriptor.Claims = new Dictionary<string, object>
    {
        ["kid"] = "your-key-id" // Key ID in header
    };
    
    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
}
```

---

## ⚙️ Cấu hình Storage Service

### 1. Cập nhật file `.env`

```env
# JWT Authentication Configuration
JWT_JWKS_CACHE_TTL=1h
JWT_JWKS_TIMEOUT=10s
JWT_CLOCK_SKEW=5m
```

### 2. Cập nhật file `configs/app.yaml`

```yaml
jwt:
  jwks_cache_ttl: 1h
  jwks_timeout: 10s
  allowed_algorithms:
    - RS256
    - RS384
    - RS512
  clock_skew: 5m
  issuers:
    - name: "csharp-auth-service"
      issuer: "https://your-auth-service.com"
      audience:
        - "storage-service"
        - "api-gateway"
      jwks_url: "https://your-auth-service.com/.well-known/jwks.json"
      username_claim: "username"
      roles_claim: "roles"
```

### 3. Ví dụ cấu hình cho nhiều Identity Provider

```yaml
jwt:
  jwks_cache_ttl: 1h
  jwks_timeout: 10s
  allowed_algorithms:
    - RS256
    - ES256
  clock_skew: 5m
  issuers:
    # Your C# Service
    - name: "csharp-auth"
      issuer: "https://your-auth-service.com"
      audience: ["storage-service"]
      jwks_url: "https://your-auth-service.com/.well-known/jwks.json"
      username_claim: "username"
      roles_claim: "roles"
    
    # Auth0 (optional)
    - name: "auth0"
      issuer: "https://your-tenant.auth0.com/"
      audience: ["your-api-identifier"]
      jwks_url: "https://your-tenant.auth0.com/.well-known/jwks.json"
      username_claim: "email"
      roles_claim: "https://your-app.com/roles"
    
    # Firebase (optional)
    - name: "firebase"
      issuer: "https://securetoken.google.com/your-project-id"
      audience: ["your-project-id"]
      jwks_url: "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
      username_claim: "email"
      roles_claim: "custom_claims"
```

---

## 🚀 Sử dụng API

### 1. Gửi Request với JWT Token

```bash
# Upload file với JWT token
curl -X POST http://localhost:8080/api/v1/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@example.jpg" \
  -F "is_public=true"
```

### 2. Ví dụ JWT Token Format

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "your-key-id"
  },
  "payload": {
    "sub": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "username": "john_doe",
    "roles": ["user", "admin"],
    "iss": "https://your-auth-service.com",
    "aud": ["storage-service"],
    "exp": 1640995200,
    "iat": 1640991600,
    "custom": {
      "department": "IT",
      "permissions": ["read", "write"]
    }
  }
}
```

---

## 🔍 Claims Mapping

Storage Service sẽ tự động extract các thông tin sau từ JWT:

| JWT Claim | Context Key | Mô tả |
|-----------|-------------|--------|
| `sub` hoặc `user_id` | `user_id` | User ID (UUID format) |
| `email` | `user_email` | Email của user |
| `username` | `user_username` | Username |
| `roles` | `user_roles` | Danh sách roles |
| `iss` | `issuer` | JWT issuer |
| Toàn bộ claims | `jwt_claims` | Tất cả claims để sử dụng custom |

### Sử dụng trong Handler

```go
func MyHandler(c *gin.Context) {
    // Lấy user ID
    userID := utils.GetUserID(c) // Returns uuid.UUID
    
    // Lấy thông tin khác
    email, _ := c.Get("user_email")
    roles, _ := c.Get("user_roles")
    
    // Lấy custom claims
    if claims, exists := c.Get("jwt_claims"); exists {
        jwtClaims := claims.(*middleware.JWTClaims)
        department := jwtClaims.Custom["department"]
    }
}
```

---

## 🛡️ Role-based Access Control (Optional)

Bạn có thể sử dụng middleware để kiểm tra roles:

```go
// Trong routes.go
adminFiles := protected.Group("/admin/files")
adminFiles.Use(jwtMiddleware.RequireRole("admin", "super_admin"))
{
    adminFiles.DELETE("/:id/force", ForceDeleteFileHandler)
}
```

---

## 🐛 Troubleshooting

### 1. Lỗi "Invalid token"
- Kiểm tra JWT format và signature
- Đảm bảo JWKS endpoint accessible
- Kiểm tra `kid` trong JWT header

### 2. Lỗi "Unknown issuer"
- Kiểm tra `iss` claim trong JWT
- Đảm bảo issuer được cấu hình trong `app.yaml`

### 3. Lỗi "Invalid audience"
- Kiểm tra `aud` claim trong JWT
- Đảm bảo audience khớp với cấu hình

### 4. Lỗi "Unable to extract user ID"
- JWT phải có `sub` hoặc `user_id` claim
- User ID phải là UUID format

### 5. Debug JWT

```bash
# Decode JWT token để kiểm tra claims
echo "YOUR_JWT_TOKEN" | cut -d. -f2 | base64 -d | jq
```

---

## 📝 Testing

### 1. Test JWKS Endpoint

```bash
curl https://your-auth-service.com/.well-known/jwks.json
```

### 2. Test JWT Generation

Tạo test endpoint trong C# service để generate JWT:

```csharp
[HttpPost("test/generate-jwt")]
public IActionResult GenerateTestJWT([FromBody] TestUserRequest request)
{
    var user = new User 
    { 
        Id = Guid.NewGuid(),
        Email = request.Email,
        Username = request.Username,
        Roles = request.Roles
    };
    
    var token = GenerateJwtToken(user);
    return Ok(new { token });
}
```

### 3. Test Storage Service

```bash
# Test với generated token
TOKEN="your-generated-jwt-token"

curl -X GET http://localhost:8080/api/v1/files \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔐 Security Best Practices

1. **HTTPS Only**: Luôn sử dụng HTTPS cho production
2. **Token Expiry**: Đặt thời gian hết hạn hợp lý (1-24 giờ)
3. **Key Rotation**: Thường xuyên rotate RSA keys
4. **Audience Validation**: Luôn validate audience
5. **Rate Limiting**: Implement rate limiting cho API
6. **Logging**: Log tất cả JWT validation failures

Với cấu hình này, Storage Service sẽ có thể verify JWT tokens từ C# service của bạn một cách an toàn và hiệu quả! 🎉
