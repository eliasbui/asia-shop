using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Common.Interfaces;

/// <summary>
/// Interface for JWT token management services
/// Provides token generation, validation, and refresh functionality
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Generates a JWT access token for the specified user
    /// </summary>
    /// <param name="user">User entity</param>
    /// <param name="roles">User roles</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>JWT token string</returns>
    Task<string> GenerateAccessTokenAsync(User user, IList<string> roles,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Generates a refresh token
    /// </summary>
    /// <returns>Refresh token string</returns>
    string GenerateRefreshToken();

    /// <summary>
    /// Validates a JWT token and returns the principal
    /// </summary>
    /// <param name="token">JWT token to validate</param>
    /// <returns>Claims principal if valid, null otherwise</returns>
    Task<System.Security.Claims.ClaimsPrincipal?> ValidateTokenAsync(string token);

    /// <summary>
    /// Gets the user ID from a JWT token
    /// </summary>
    /// <param name="token">JWT token</param>
    /// <returns>User ID if valid, null otherwise</returns>
    Task<Guid?> GetUserIdFromTokenAsync(string token);

    /// <summary>
    /// Checks if a token is blacklisted
    /// </summary>
    /// <param name="tokenId">Token ID (jti claim)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if blacklisted, false otherwise</returns>
    Task<bool> IsTokenBlacklistedAsync(string tokenId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Blacklists a token (for logout functionality)
    /// </summary>
    /// <param name="tokenId">Token ID (jti claim)</param>
    /// <param name="expiryTime">Token expiry time</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task BlacklistTokenAsync(string tokenId, DateTime expiryTime, CancellationToken cancellationToken = default);

    /// <summary>
    /// Extracts the token ID (jti claim) from a JWT token
    /// </summary>
    /// <param name="token">JWT token</param>
    /// <returns>Token ID if found, null otherwise</returns>
    string? GetTokenId(string token);

    /// <summary>
    /// Gets the expiry time of a JWT token
    /// </summary>
    /// <param name="token">JWT token</param>
    /// <returns>Expiry time if found, null otherwise</returns>
    DateTime? GetTokenExpiry(string token);
}

/// <summary>
/// Interface for password hashing services
/// Provides secure password hashing and verification
/// </summary>
public interface IPasswordHashingService
{
    /// <summary>
    /// Hashes a password using a secure algorithm
    /// </summary>
    /// <param name="password">Plain text password</param>
    /// <returns>Hashed password</returns>
    string HashPassword(string password);

    /// <summary>
    /// Verifies a password against its hash
    /// </summary>
    /// <param name="password">Plain text password</param>
    /// <param name="hashedPassword">Hashed password</param>
    /// <returns>True if password matches, false otherwise</returns>
    bool VerifyPassword(string password, string hashedPassword);

    /// <summary>
    /// Checks if a password hash needs to be rehashed (for security upgrades)
    /// </summary>
    /// <param name="hashedPassword">Hashed password</param>
    /// <returns>True if rehashing is needed, false otherwise</returns>
    bool NeedsRehash(string hashedPassword);
}

/// <summary>
/// Interface for caching services
/// Provides distributed caching functionality with fallback support
/// </summary>
public interface ICacheService
{
    /// <summary>
    /// Gets a cached value by key
    /// </summary>
    /// <typeparam name="T">Value type</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Cached value if found, default otherwise</returns>
    Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sets a cached value with expiration
    /// </summary>
    /// <typeparam name="T">Value type</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="value">Value to cache</param>
    /// <param name="expiration">Expiration time</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task SetAsync<T>(string key, T value, TimeSpan expiration, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes a cached value by key
    /// </summary>
    /// <param name="key">Cache key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task RemoveAsync(string key, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a key exists in the cache
    /// </summary>
    /// <param name="key">Cache key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if key exists, false otherwise</returns>
    Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sets a cached value with sliding expiration
    /// </summary>
    /// <typeparam name="T">Value type</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="value">Value to cache</param>
    /// <param name="slidingExpiration">Sliding expiration time</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task SetSlidingAsync<T>(string key, T value, TimeSpan slidingExpiration,
        CancellationToken cancellationToken = default);
}