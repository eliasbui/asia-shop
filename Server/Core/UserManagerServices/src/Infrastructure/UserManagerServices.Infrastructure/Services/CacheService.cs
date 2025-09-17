using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;

namespace UserManagerServices.Infrastructure.Services;

/// <summary>
/// Cache service implementation with Redis and in-memory fallback
/// Provides distributed caching functionality with automatic fallback support
/// </summary>
public class CacheService : ICacheService
{
    private readonly IDistributedCache _distributedCache;
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<CacheService> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    /// <summary>
    /// Initializes a new instance of the CacheService
    /// </summary>
    /// <param name="distributedCache">Distributed cache (Redis)</param>
    /// <param name="memoryCache">In-memory cache fallback</param>
    /// <param name="logger">Logger instance</param>
    public CacheService(
        IDistributedCache distributedCache,
        IMemoryCache memoryCache,
        ILogger<CacheService> logger)
    {
        _distributedCache = distributedCache ?? throw new ArgumentNullException(nameof(distributedCache));
        _memoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };
    }

    /// <summary>
    /// Gets a cached value by key
    /// </summary>
    /// <typeparam name="T">Value type</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Cached value if found, default otherwise</returns>
    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(key)) throw new ArgumentException("Cache key cannot be null or empty", nameof(key));

        try
        {
            // Try distributed cache first
            var distributedValue = await _distributedCache.GetStringAsync(key, cancellationToken);
            if (!string.IsNullOrEmpty(distributedValue))
            {
                var deserializedValue = JsonSerializer.Deserialize<T>(distributedValue, _jsonOptions);
                _logger.LogDebug("Cache hit from distributed cache for key: {Key}", key);
                return deserializedValue;
            }

            // Fallback to memory cache
            if (_memoryCache.TryGetValue(key, out var memoryValue) && memoryValue is T typedValue)
            {
                _logger.LogDebug("Cache hit from memory cache for key: {Key}", key);
                return typedValue;
            }

            _logger.LogDebug("Cache miss for key: {Key}", key);
            return default;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cached value for key: {Key}", key);

            // Try memory cache as fallback
            try
            {
                if (_memoryCache.TryGetValue(key, out var fallbackValue) && fallbackValue is T typedFallbackValue)
                {
                    _logger.LogDebug("Fallback cache hit from memory cache for key: {Key}", key);
                    return typedFallbackValue;
                }
            }
            catch (Exception fallbackEx)
            {
                _logger.LogError(fallbackEx, "Error getting fallback cached value for key: {Key}", key);
            }

            return default;
        }
    }

    /// <summary>
    /// Sets a cached value with expiration
    /// </summary>
    /// <typeparam name="T">Value type</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="value">Value to cache</param>
    /// <param name="expiration">Expiration time</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task SetAsync<T>(string key, T value, TimeSpan expiration,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(key)) throw new ArgumentException("Cache key cannot be null or empty", nameof(key));

        if (value == null) throw new ArgumentNullException(nameof(value));

        try
        {
            var serializedValue = JsonSerializer.Serialize(value, _jsonOptions);
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration
            };

            // Set in distributed cache
            await _distributedCache.SetStringAsync(key, serializedValue, options, cancellationToken);
            _logger.LogDebug("Value cached in distributed cache for key: {Key} with expiration: {Expiration}", key,
                expiration);

            // Also set in memory cache as backup
            var memoryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration,
                Priority = CacheItemPriority.Normal
            };
            _memoryCache.Set(key, value, memoryOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cached value for key: {Key}", key);

            // Fallback to memory cache only
            try
            {
                var memoryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = expiration,
                    Priority = CacheItemPriority.Normal
                };
                _memoryCache.Set(key, value, memoryOptions);
                _logger.LogDebug("Fallback: Value cached in memory cache for key: {Key}", key);
            }
            catch (Exception fallbackEx)
            {
                _logger.LogError(fallbackEx, "Error setting fallback cached value for key: {Key}", key);
                throw;
            }
        }
    }

    /// <summary>
    /// Sets a cached value with sliding expiration
    /// </summary>
    /// <typeparam name="T">Value type</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="value">Value to cache</param>
    /// <param name="slidingExpiration">Sliding expiration time</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task SetSlidingAsync<T>(string key, T value, TimeSpan slidingExpiration,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(key)) throw new ArgumentException("Cache key cannot be null or empty", nameof(key));

        if (value == null) throw new ArgumentNullException(nameof(value));

        try
        {
            var serializedValue = JsonSerializer.Serialize(value, _jsonOptions);
            var options = new DistributedCacheEntryOptions
            {
                SlidingExpiration = slidingExpiration
            };

            // Set in distributed cache
            await _distributedCache.SetStringAsync(key, serializedValue, options, cancellationToken);
            _logger.LogDebug(
                "Value cached in distributed cache for key: {Key} with sliding expiration: {SlidingExpiration}", key,
                slidingExpiration);

            // Also set in memory cache as backup
            var memoryOptions = new MemoryCacheEntryOptions
            {
                SlidingExpiration = slidingExpiration,
                Priority = CacheItemPriority.Normal
            };
            _memoryCache.Set(key, value, memoryOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cached value with sliding expiration for key: {Key}", key);

            // Fallback to memory cache only
            try
            {
                var memoryOptions = new MemoryCacheEntryOptions
                {
                    SlidingExpiration = slidingExpiration,
                    Priority = CacheItemPriority.Normal
                };
                _memoryCache.Set(key, value, memoryOptions);
                _logger.LogDebug("Fallback: Value cached in memory cache for key: {Key}", key);
            }
            catch (Exception fallbackEx)
            {
                _logger.LogError(fallbackEx,
                    "Error setting fallback cached value with sliding expiration for key: {Key}", key);
                throw;
            }
        }
    }

    /// <summary>
    /// Removes a cached value by key
    /// </summary>
    /// <param name="key">Cache key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(key)) throw new ArgumentException("Cache key cannot be null or empty", nameof(key));

        try
        {
            // Remove from distributed cache
            await _distributedCache.RemoveAsync(key, cancellationToken);
            _logger.LogDebug("Value removed from distributed cache for key: {Key}", key);

            // Remove from memory cache
            _memoryCache.Remove(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cached value for key: {Key}", key);

            // Try to remove from memory cache at least
            try
            {
                _memoryCache.Remove(key);
            }
            catch (Exception fallbackEx)
            {
                _logger.LogError(fallbackEx, "Error removing fallback cached value for key: {Key}", key);
            }

            throw;
        }
    }

    /// <summary>
    /// Checks if a key exists in the cache
    /// </summary>
    /// <param name="key">Cache key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if key exists, false otherwise</returns>
    public async Task<bool> ExistsAsync(string key, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(key)) throw new ArgumentException("Cache key cannot be null or empty", nameof(key));

        try
        {
            // Check distributed cache first
            var distributedValue = await _distributedCache.GetStringAsync(key, cancellationToken);
            if (!string.IsNullOrEmpty(distributedValue)) return true;

            // Check memory cache
            return _memoryCache.TryGetValue(key, out _);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if key exists in cache: {Key}", key);

            // Fallback to memory cache check
            try
            {
                return _memoryCache.TryGetValue(key, out _);
            }
            catch (Exception fallbackEx)
            {
                _logger.LogError(fallbackEx, "Error checking if key exists in fallback cache: {Key}", key);
                return false;
            }
        }
    }
}