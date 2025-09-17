using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Repository interface for UserSession entity with specialized operations
/// Handles session management and token tracking
/// </summary>
public interface IUserSessionRepository : IGenericRepository<UserSession>
{
    #region Session-Specific Queries

    /// <summary>
    /// Gets a session by session token
    /// </summary>
    /// <param name="sessionToken">Session token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session if found, null otherwise</returns>
    Task<UserSession?> GetBySessionTokenAsync(string sessionToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a session by refresh token
    /// </summary>
    /// <param name="refreshToken">Refresh token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session if found, null otherwise</returns>
    Task<UserSession?> GetByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all active sessions for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Active sessions for the user</returns>
    Task<IEnumerable<UserSession>> GetActiveSessionsByUserIdAsync(Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all sessions for a user (active and inactive)
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>All sessions for the user</returns>
    Task<IEnumerable<UserSession>> GetAllSessionsByUserIdAsync(Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets sessions by IP address
    /// </summary>
    /// <param name="ipAddress">IP address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Sessions from the IP address</returns>
    Task<IEnumerable<UserSession>> GetSessionsByIpAddressAsync(string ipAddress,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets expired sessions
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Expired sessions</returns>
    Task<IEnumerable<UserSession>> GetExpiredSessionsAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Session Management

    /// <summary>
    /// Deactivates all sessions for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of sessions deactivated</returns>
    Task<int> DeactivateAllUserSessionsAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deactivates a specific session
    /// </summary>
    /// <param name="sessionId">Session identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if session was deactivated, false if not found</returns>
    Task<bool> DeactivateSessionAsync(Guid sessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deactivates sessions by token
    /// </summary>
    /// <param name="sessionToken">Session token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if session was deactivated, false if not found</returns>
    Task<bool> DeactivateSessionByTokenAsync(string sessionToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates session last accessed time
    /// </summary>
    /// <param name="sessionToken">Session token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if session was updated, false if not found</returns>
    Task<bool> UpdateLastAccessedAsync(string sessionToken, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cleans up expired sessions
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of sessions cleaned up</returns>
    Task<int> CleanupExpiredSessionsAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Session Statistics

    /// <summary>
    /// Gets count of active sessions for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of active sessions</returns>
    Task<int> GetActiveSessionCountByUserAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets total count of active sessions
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total count of active sessions</returns>
    Task<int> GetTotalActiveSessionCountAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets session statistics by date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session statistics</returns>
    Task<Dictionary<DateTime, int>> GetSessionStatisticsAsync(DateTime startDate, DateTime endDate,
        CancellationToken cancellationToken = default);

    #endregion

    #region Security Operations

    /// <summary>
    /// Gets sessions from suspicious IP addresses (multiple failed attempts)
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Sessions from suspicious IPs</returns>
    Task<IEnumerable<UserSession>> GetSuspiciousSessionsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets concurrent sessions for a user from different IP addresses
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Concurrent sessions from different IPs</returns>
    Task<IEnumerable<UserSession>> GetConcurrentSessionsAsync(Guid userId,
        CancellationToken cancellationToken = default);

    #endregion
}