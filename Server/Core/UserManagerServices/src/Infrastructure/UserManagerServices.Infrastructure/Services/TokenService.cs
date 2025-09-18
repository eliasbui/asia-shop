#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Services;

/// <summary>
/// JWT token service implementation
/// Provides comprehensive token management including generation, validation, and blacklisting
/// </summary>
public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly ICacheService _cacheService;
    private readonly ILogger<TokenService> _logger;
    private readonly JwtSecurityTokenHandler _tokenHandler;
    private readonly TokenValidationParameters _tokenValidationParameters;

    /// <summary>
    /// Initializes a new instance of the TokenService
    /// </summary>
    /// <param name="configuration">Application configuration</param>
    /// <param name="cacheService">Cache service for token blacklisting</param>
    /// <param name="logger">Logger instance</param>
    public TokenService(
        IConfiguration configuration,
        ICacheService cacheService,
        ILogger<TokenService> logger)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _tokenHandler = new JwtSecurityTokenHandler();
        _tokenValidationParameters = CreateTokenValidationParameters();
    }

    /// <summary>
    /// Generates a JWT access token for the specified user
    /// </summary>
    /// <param name="user">User entity</param>
    /// <param name="roles">User roles</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>JWT token string</returns>
    public async Task<string> GenerateAccessTokenAsync(User user, IList<string> roles,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var tokenId = Guid.NewGuid().ToString();
            var issuedAt = DateTime.UtcNow;
            var expiryMinutes = _configuration.GetValue<int>("Jwt:ExpiryInMinutes", 60);
            var expiry = issuedAt.AddMinutes(expiryMinutes);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Jti, tokenId),
                new(JwtRegisteredClaimNames.Iat, new DateTimeOffset(issuedAt).ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64),
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName ?? string.Empty),
                new(ClaimTypes.Email, user.Email ?? string.Empty),
                new("firstName", user.FirstName ?? string.Empty),
                new("lastName", user.LastName ?? string.Empty),
                new("emailConfirmed", user.EmailConfirmed.ToString())
            };

            // Add role claims
            foreach (var role in roles) claims.Add(new Claim(ClaimTypes.Role, role));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiry,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = credentials
            };

            var token = _tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = _tokenHandler.WriteToken(token);

            _logger.LogInformation("JWT token generated for user {UserId} with token ID {TokenId}", user.Id, tokenId);

            return tokenString;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating JWT token for user {UserId}", user.Id);
            throw;
        }
    }

    /// <summary>
    /// Generates a refresh token
    /// </summary>
    /// <returns>Refresh token string</returns>
    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    /// <summary>
    /// Validates a JWT token and returns the principal
    /// </summary>
    /// <param name="token">JWT token to validate</param>
    /// <returns>Claims principal if valid, null otherwise</returns>
    public async Task<ClaimsPrincipal?> ValidateTokenAsync(string token)
    {
        try
        {
            var principal = _tokenHandler.ValidateToken(token, _tokenValidationParameters, out var validatedToken);

            // Check if token is blacklisted
            var tokenId = GetTokenId(token);
            if (!string.IsNullOrEmpty(tokenId) && await IsTokenBlacklistedAsync(tokenId))
            {
                _logger.LogWarning("Attempted to use blacklisted token {TokenId}", tokenId);
                return null;
            }

            return principal;
        }
        catch (SecurityTokenException ex)
        {
            _logger.LogWarning(ex, "Invalid JWT token provided");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating JWT token");
            return null;
        }
    }

    /// <summary>
    /// Gets the user ID from a JWT token
    /// </summary>
    /// <param name="token">JWT token</param>
    /// <returns>User ID if valid, null otherwise</returns>
    public async Task<Guid?> GetUserIdFromTokenAsync(string token)
    {
        var principal = await ValidateTokenAsync(token);
        var userIdClaim = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        return userIdClaim != null && Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    /// <summary>
    /// Checks if a token is blacklisted
    /// </summary>
    /// <param name="tokenId">Token ID (jti claim)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if blacklisted, false otherwise</returns>
    public async Task<bool> IsTokenBlacklistedAsync(string tokenId, CancellationToken cancellationToken = default)
    {
        try
        {
            var cacheKey = $"blacklisted_token:{tokenId}";
            return await _cacheService.ExistsAsync(cacheKey, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if token {TokenId} is blacklisted", tokenId);
            return false; // Fail open for availability
        }
    }

    /// <summary>
    /// Blacklists a token (for logout functionality)
    /// </summary>
    /// <param name="tokenId">Token ID (jti claim)</param>
    /// <param name="expiryTime">Token expiry time</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task BlacklistTokenAsync(string tokenId, DateTime expiryTime,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var cacheKey = $"blacklisted_token:{tokenId}";
            var timeToExpiry = expiryTime - DateTime.UtcNow;

            if (timeToExpiry > TimeSpan.Zero)
            {
                await _cacheService.SetAsync(cacheKey, true, timeToExpiry, cancellationToken);
                _logger.LogInformation("Token {TokenId} blacklisted until {ExpiryTime}", tokenId, expiryTime);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error blacklisting token {TokenId}", tokenId);
            throw;
        }
    }

    /// <summary>
    /// Extracts the token ID (jti claim) from a JWT token
    /// </summary>
    /// <param name="token">JWT token</param>
    /// <returns>Token ID if found, null otherwise</returns>
    public string? GetTokenId(string token)
    {
        try
        {
            var jsonToken = _tokenHandler.ReadJwtToken(token);
            return jsonToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti)?.Value;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error extracting token ID from JWT token");
            return null;
        }
    }

    /// <summary>
    /// Gets the expiry time of a JWT token
    /// </summary>
    /// <param name="token">JWT token</param>
    /// <returns>Expiry time if found, null otherwise</returns>
    public DateTime? GetTokenExpiry(string token)
    {
        try
        {
            var jsonToken = _tokenHandler.ReadJwtToken(token);
            return jsonToken.ValidTo;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error extracting expiry time from JWT token");
            return null;
        }
    }

    /// <summary>
    /// Creates token validation parameters
    /// </summary>
    /// <returns>Token validation parameters</returns>
    private TokenValidationParameters CreateTokenValidationParameters()
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));

        return new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidAudience = _configuration["Jwt:Audience"],
            IssuerSigningKey = key,
            ClockSkew = TimeSpan.FromMinutes(5) // Allow 5 minutes clock skew
        };
    }
}