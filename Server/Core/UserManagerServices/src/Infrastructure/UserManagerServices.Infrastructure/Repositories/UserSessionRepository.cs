using Dapper;
using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserSession entity with specialized operations
/// Handles session management and token tracking
/// </summary>
public class UserSessionRepository : GenericRepository<UserSession>, IUserSessionRepository
{
    private readonly IDapperConnectionFactory _dapperConnectionFactory;

    /// <summary>
    /// Initializes a new instance of the UserSessionRepository
    /// </summary>
    /// <param name="context">Database context</param>
    /// <param name="dapperConnectionFactory">Dapper connection factory</param>
    public UserSessionRepository(ApplicationDbContext context, IDapperConnectionFactory dapperConnectionFactory) 
        : base(context)
    {
        _dapperConnectionFactory = dapperConnectionFactory ?? throw new ArgumentNullException(nameof(dapperConnectionFactory));
    }

    #region Session-Specific Queries

    /// <summary>
    /// Gets a session by session token
    /// </summary>
    /// <param name="sessionToken">Session token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session if found, null otherwise</returns>
    public async Task<UserSession?> GetBySessionTokenAsync(string sessionToken, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.SessionToken == sessionToken, cancellationToken);
    }

    /// <summary>
    /// Gets a session by refresh token
    /// </summary>
    /// <param name="refreshToken">Refresh token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session if found, null otherwise</returns>
    public async Task<UserSession?> GetByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.RefreshToken == refreshToken, cancellationToken);
    }

    /// <summary>
    /// Gets all active sessions for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Active sessions for the user</returns>
    public async Task<IEnumerable<UserSession>> GetActiveSessionsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(s => s.UserId == userId && s.IsActive && s.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(s => s.LastAccessedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets all sessions for a user (active and inactive)
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>All sessions for the user</returns>
    public async Task<IEnumerable<UserSession>> GetAllSessionsByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets sessions by IP address
    /// </summary>
    /// <param name="ipAddress">IP address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Sessions from the IP address</returns>
    public async Task<IEnumerable<UserSession>> GetSessionsByIpAddressAsync(string ipAddress, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(s => s.IpAddress == ipAddress)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets expired sessions
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Expired sessions</returns>
    public async Task<IEnumerable<UserSession>> GetExpiredSessionsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(s => s.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync(cancellationToken);
    }

    #endregion

    #region Session Management

    /// <summary>
    /// Deactivates all sessions for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of sessions deactivated</returns>
    public async Task<int> DeactivateAllUserSessionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        const string sql = @"
            UPDATE ""UserSessions"" 
            SET ""IsActive"" = false, ""UpdatedAt"" = @UpdatedAt
            WHERE ""UserId"" = @UserId AND ""IsActive"" = true AND ""IsDeleted"" = false";

        using var connection = _dapperConnectionFactory.CreateConnection();
        return await connection.ExecuteAsync(sql, new { UserId = userId, UpdatedAt = DateTime.UtcNow });
    }

    /// <summary>
    /// Deactivates a specific session
    /// </summary>
    /// <param name="sessionId">Session identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if session was deactivated, false if not found</returns>
    public async Task<bool> DeactivateSessionAsync(Guid sessionId, CancellationToken cancellationToken = default)
    {
        var session = await _dbSet.FirstOrDefaultAsync(s => s.Id == sessionId, cancellationToken);
        if (session == null) return false;

        session.IsActive = false;
        _dbSet.Update(session);
        return true;
    }

    /// <summary>
    /// Deactivates sessions by token
    /// </summary>
    /// <param name="sessionToken">Session token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if session was deactivated, false if not found</returns>
    public async Task<bool> DeactivateSessionByTokenAsync(string sessionToken, CancellationToken cancellationToken = default)
    {
        var session = await _dbSet.FirstOrDefaultAsync(s => s.SessionToken == sessionToken, cancellationToken);
        if (session == null) return false;

        session.IsActive = false;
        _dbSet.Update(session);
        return true;
    }

    /// <summary>
    /// Updates session last accessed time
    /// </summary>
    /// <param name="sessionToken">Session token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if session was updated, false if not found</returns>
    public async Task<bool> UpdateLastAccessedAsync(string sessionToken, CancellationToken cancellationToken = default)
    {
        const string sql = @"
            UPDATE ""UserSessions"" 
            SET ""LastAccessedAt"" = @LastAccessedAt, ""UpdatedAt"" = @UpdatedAt
            WHERE ""SessionToken"" = @SessionToken AND ""IsDeleted"" = false";

        using var connection = _dapperConnectionFactory.CreateConnection();
        var rowsAffected = await connection.ExecuteAsync(sql, new 
        { 
            SessionToken = sessionToken, 
            LastAccessedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        return rowsAffected > 0;
    }

    /// <summary>
    /// Cleans up expired sessions
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of sessions cleaned up</returns>
    public async Task<int> CleanupExpiredSessionsAsync(CancellationToken cancellationToken = default)
    {
        const string sql = @"
            UPDATE ""UserSessions"" 
            SET ""IsDeleted"" = true, ""UpdatedAt"" = @UpdatedAt
            WHERE ""ExpiresAt"" <= @Now AND ""IsDeleted"" = false";

        using var connection = _dapperConnectionFactory.CreateConnection();
        return await connection.ExecuteAsync(sql, new { Now = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
    }

    #endregion

    #region Session Statistics

    /// <summary>
    /// Gets count of active sessions for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of active sessions</returns>
    public async Task<int> GetActiveSessionCountByUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(s => s.UserId == userId && s.IsActive && s.ExpiresAt > DateTime.UtcNow, cancellationToken);
    }

    /// <summary>
    /// Gets total count of active sessions
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Total count of active sessions</returns>
    public async Task<int> GetTotalActiveSessionCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(s => s.IsActive && s.ExpiresAt > DateTime.UtcNow, cancellationToken);
    }

    /// <summary>
    /// Gets session statistics by date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session statistics</returns>
    public async Task<Dictionary<DateTime, int>> GetSessionStatisticsAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        const string sql = @"
            SELECT DATE(""CreatedAt"") as Date, COUNT(*) as Count
            FROM ""UserSessions""
            WHERE ""CreatedAt"" >= @StartDate AND ""CreatedAt"" <= @EndDate AND ""IsDeleted"" = false
            GROUP BY DATE(""CreatedAt"")
            ORDER BY Date";

        using var connection = _dapperConnectionFactory.CreateConnection();
        var results = await connection.QueryAsync<(DateTime Date, int Count)>(sql, new { StartDate = startDate, EndDate = endDate });
        
        return results.ToDictionary(r => r.Date, r => r.Count);
    }

    #endregion

    #region Security Operations

    /// <summary>
    /// Gets sessions from suspicious IP addresses (multiple failed attempts)
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Sessions from suspicious IPs</returns>
    public async Task<IEnumerable<UserSession>> GetSuspiciousSessionsAsync(CancellationToken cancellationToken = default)
    {
        const string sql = @"
            SELECT DISTINCT s.*
            FROM ""UserSessions"" s
            WHERE s.""IpAddress"" IN (
                SELECT ""IpAddress""
                FROM ""UserActivityLogs""
                WHERE ""Action"" = 'Login' AND ""IsSuccess"" = false
                AND ""CreatedAt"" >= @Since
                GROUP BY ""IpAddress""
                HAVING COUNT(*) >= 5
            )
            AND s.""IsDeleted"" = false";

        using var connection = _dapperConnectionFactory.CreateConnection();
        return await connection.QueryAsync<UserSession>(sql, new { Since = DateTime.UtcNow.AddHours(-24) });
    }

    /// <summary>
    /// Gets concurrent sessions for a user from different IP addresses
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Concurrent sessions from different IPs</returns>
    public async Task<IEnumerable<UserSession>> GetConcurrentSessionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(s => s.UserId == userId && s.IsActive && s.ExpiresAt > DateTime.UtcNow)
            .GroupBy(s => s.IpAddress)
            .Where(g => g.Count() > 1)
            .SelectMany(g => g)
            .ToListAsync(cancellationToken);
    }

    #endregion
}
