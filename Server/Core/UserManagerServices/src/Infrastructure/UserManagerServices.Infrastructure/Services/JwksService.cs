#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/21
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using UserManagerServices.Application.Common.Interfaces;

namespace UserManagerServices.Infrastructure.Services;

/// <summary>
/// Service for generating JSON Web Key Set (JWKS) from JWT configuration
/// Provides JWKS endpoint functionality for JWT token validation by external services
/// </summary>
public class JwksService : IJwksService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<JwksService> _logger;
    private readonly ICacheService _cacheService;
    private const string JwksCacheKey = "jwks_cache";
    private const int CacheExpirationMinutes = 60; // Cache JWKS for 1 hour

    /// <summary>
    /// Initializes a new instance of the JwksService
    /// </summary>
    /// <param name="configuration">Application configuration</param>
    /// <param name="logger">Logger instance</param>
    /// <param name="cacheService">Cache service for JWKS caching</param>
    public JwksService(
        IConfiguration configuration,
        ILogger<JwksService> logger,
        ICacheService cacheService)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
    }

    /// <summary>
    /// Gets the JSON Web Key Set (JWKS) for JWT token validation
    /// </summary>
    /// <returns>JWKS as JSON string</returns>
    public async Task<string> GetJwksAsync()
    {
        try
        {
            // Try to get from cache first
            var cachedJwks = await _cacheService.GetAsync<string>(JwksCacheKey);
            if (!string.IsNullOrEmpty(cachedJwks))
            {
                _logger.LogDebug("Retrieved JWKS from cache");
                return cachedJwks;
            }

            // Generate JWKS
            var jwksObject = await GenerateJwksAsync();
            var jwksJson = JsonSerializer.Serialize(jwksObject, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            });

            // Cache the result
            await _cacheService.SetAsync(JwksCacheKey, jwksJson, TimeSpan.FromMinutes(CacheExpirationMinutes));
            
            _logger.LogInformation("Generated and cached JWKS");
            return jwksJson;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating JWKS");
            throw;
        }
    }

    /// <summary>
    /// Gets the JSON Web Key Set (JWKS) as an object
    /// </summary>
    /// <returns>JWKS object</returns>
    public async Task<object> GetJwksObjectAsync()
    {
        try
        {
            return await GenerateJwksAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating JWKS object");
            throw;
        }
    }

    /// <summary>
    /// Generates the JWKS from the current JWT configuration
    /// </summary>
    /// <returns>JWKS object</returns>
    private async Task<object> GenerateJwksAsync()
    {
        var secretKey = _configuration["Jwt:SecretKey"];
        if (string.IsNullOrEmpty(secretKey))
        {
            throw new InvalidOperationException("JWT SecretKey is not configured");
        }

        var keyBytes = Encoding.UTF8.GetBytes(secretKey);
        var key = new SymmetricSecurityKey(keyBytes);

        // Generate key ID (kid) from the key
        var keyId = await GenerateKeyIdAsync(keyBytes);

        // Create JWK (JSON Web Key) for symmetric key
        var jwk = new
        {
            kty = "oct", // Key type: octet sequence (symmetric key)
            use = "sig", // Key use: signature
            alg = "HS256", // Algorithm
            kid = keyId, // Key ID
            k = Base64UrlEncoder.Encode(keyBytes) // Key value (base64url encoded)
        };

        // Create JWKS (JSON Web Key Set) with issuer information
        var issuerUrl = _configuration["Jwt:IssuerUrl"] ?? _configuration["Jwt:Issuer"];
        
        var jwks = new
        {
            keys = new[] { jwk },
            issuer = issuerUrl // Add issuer information to JWKS
        };

        return jwks;
    }

    /// <summary>
    /// Generates a key ID from the key bytes
    /// </summary>
    /// <param name="keyBytes">Key bytes</param>
    /// <returns>Key ID</returns>
    private static async Task<string> GenerateKeyIdAsync(byte[] keyBytes)
    {
        using var sha256 = SHA256.Create();
        var hash = await Task.Run(() => sha256.ComputeHash(keyBytes));
        return Base64UrlEncoder.Encode(hash)[..8]; // Use first 8 characters of the hash
    }
}
