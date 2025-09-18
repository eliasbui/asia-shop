#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserSession entity with specialized operations
/// Handles session management and token tracking using Entity Framework
/// </summary>
public class UserSessionRepository : GenericRepository<UserSession>, IUserSessionRepository
{
    /// <summary>
    /// Initializes a new instance of the UserSessionRepository
    /// </summary>
    /// <param name="context">Database context</param>
    public UserSessionRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    #region Session-Specific Queries

    /// <summary>
    /// Gets a session by session token
    /// </summary>
    /// <param name="sessionToken">Session token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session if found, null otherwise</returns>
    public async Task<UserSession?> GetBySessionTokenAsync(string sessionToken,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.SessionToken == sessionToken, cancellationToken);
    }

    /// <summary>
    /// Gets a session by refresh token
    /// </summary>
    /// <param name="refreshToken">Refresh token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session if found, null otherwise</returns>
    public async Task<UserSession?> GetByRefreshTokenAsync(string refreshToken,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.RefreshToken == refreshToken, cancellationToken);
    }

    /// <summary>
    /// Gets all active sessions for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Active sessions for the user</returns>
    public async Task<IEnumerable<UserSession>> GetActiveSessionsByUserIdAsync(Guid userId,
        CancellationToken cancellationToken = default)
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
    public async Task<IEnumerable<UserSession>> GetAllSessionsByUserIdAsync(Guid userId,
        CancellationToken cancellationToken = default)
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
    public async Task<IEnumerable<UserSession>> GetSessionsByIpAddressAsync(string ipAddress,
        CancellationToken cancellationToken = default)
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
    /// Deactivates all sessions for a user using Entity Framework
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of sessions deactivated</returns>
    public async Task<int> DeactivateAllUserSessionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var sessionsToDeactivate = await _dbSet
            .Where(s => s.UserId == userId && s.IsActive && !s.IsDeleted)
            .ToListAsync(cancellationToken);

        foreach (var session in sessionsToDeactivate)
        {
            session.IsActive = false;
            var entry = _context.Entry(session);
            entry.Property(nameof(UserSession.UpdatedAt)).CurrentValue = DateTime.UtcNow;
        }

        return sessionsToDeactivate.Count;
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
    public async Task<bool> DeactivateSessionByTokenAsync(string sessionToken,
        CancellationToken cancellationToken = default)
    {
        var session = await _dbSet.FirstOrDefaultAsync(s => s.SessionToken == sessionToken, cancellationToken);
        if (session == null) return false;

        session.IsActive = false;
        _dbSet.Update(session);
        return true;
    }

    /// <summary>
    /// Updates session last accessed time using Entity Framework
    /// </summary>
    /// <param name="sessionToken">Session token</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if session was updated, false if not found</returns>
    public async Task<bool> UpdateLastAccessedAsync(string sessionToken, CancellationToken cancellationToken = default)
    {
        var session =
            await _dbSet.FirstOrDefaultAsync(s => s.SessionToken == sessionToken && !s.IsDeleted, cancellationToken);

        if (session == null) return false;

        session.LastAccessedAt = DateTime.UtcNow;
        var entry = _context.Entry(session);
        entry.Property(nameof(UserSession.UpdatedAt)).CurrentValue = DateTime.UtcNow;

        return true;
    }

    /// <summary>
    /// Cleans up expired sessions using Entity Framework
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of sessions cleaned up</returns>
    public async Task<int> CleanupExpiredSessionsAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var expiredSessions = await _dbSet
            .Where(s => s.ExpiresAt <= now && !s.IsDeleted)
            .ToListAsync(cancellationToken);

        foreach (var session in expiredSessions)
        {
            var entry = _context.Entry(session);
            entry.Property(nameof(UserSession.IsDeleted)).CurrentValue = true;
            entry.Property(nameof(UserSession.UpdatedAt)).CurrentValue = now;
        }

        return expiredSessions.Count;
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
        return await _dbSet.CountAsync(s => s.UserId == userId && s.IsActive && s.ExpiresAt > DateTime.UtcNow,
            cancellationToken);
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
    /// Gets session statistics by date range using Entity Framework
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Session statistics</returns>
    public async Task<Dictionary<DateTime, int>> GetSessionStatisticsAsync(DateTime startDate, DateTime endDate,
        CancellationToken cancellationToken = default)
    {
        var results = await _dbSet
            .Where(s => s.CreatedAt >= startDate && s.CreatedAt <= endDate && !s.IsDeleted)
            .GroupBy(s => s.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(cancellationToken);

        return results.ToDictionary(r => r.Date, r => r.Count);
    }

    #endregion

    #region Security Operations

    /// <summary>
    /// Gets sessions from suspicious IP addresses (multiple failed attempts) using Entity Framework
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Sessions from suspicious IPs</returns>
    public async Task<IEnumerable<UserSession>> GetSuspiciousSessionsAsync(
        CancellationToken cancellationToken = default)
    {
        var since = DateTime.UtcNow.AddHours(-24);

        // First get suspicious IP addresses from activity logs
        var suspiciousIps = await _context.UserActivityLogs
            .Where(log => log.Action == Domain.Enums.ActionEnum.Login &&
                          log.CreatedAt >= since && !log.IsDeleted)
            .GroupBy(log => log.IpAddress)
            .Where(g => g.Count() >= 5)
            .Select(g => g.Key)
            .ToListAsync(cancellationToken);

        // Then get sessions from those IPs
        return await _dbSet
            .Where(s => suspiciousIps.Contains(s.IpAddress) && !s.IsDeleted)
            .Distinct()
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets concurrent sessions for a user from different IP addresses
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Concurrent sessions from different IPs</returns>
    public async Task<IEnumerable<UserSession>> GetConcurrentSessionsAsync(Guid userId,
        CancellationToken cancellationToken = default)
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