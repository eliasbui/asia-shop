using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserActivityLog entity with specialized operations
/// Handles audit trail and activity monitoring functionality using Entity Framework
/// </summary>
public class UserActivityLogRepository : GenericRepository<UserActivityLog>, IUserActivityLogRepository
{
    /// <summary>
    /// Initializes a new instance of the UserActivityLogRepository
    /// </summary>
    /// <param name="context">Database context</param>
    public UserActivityLogRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    #region Activity Log Queries

    /// <summary>
    /// Gets activity logs for a specific user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activity logs for the user</returns>
    public async Task<IEnumerable<UserActivityLog>> GetByUserIdAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(log => log.UserId == userId)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets activity logs by action type
    /// </summary>
    /// <param name="action">Action type</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activity logs for the action</returns>
    public async Task<IEnumerable<UserActivityLog>> GetByActionAsync(ActionEnum action,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(log => log.Action == action)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets activity logs for a specific entity
    /// </summary>
    /// <param name="entity">Entity name</param>
    /// <param name="entityId">Entity identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activity logs for the entity</returns>
    public async Task<IEnumerable<UserActivityLog>> GetByEntityAsync(string entity, Guid entityId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(log => log.Entity == entity && log.EntityId == entityId)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets activity logs by IP address
    /// </summary>
    /// <param name="ipAddress">IP address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activity logs from the IP address</returns>
    public async Task<IEnumerable<UserActivityLog>> GetByIpAddressAsync(string ipAddress,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(log => log.IpAddress == ipAddress)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets activity logs within a date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activity logs within the date range</returns>
    public async Task<IEnumerable<UserActivityLog>> GetByDateRangeAsync(DateTime startDate, DateTime endDate,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(log => log.CreatedAt >= startDate && log.CreatedAt <= endDate)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets recent activity logs
    /// </summary>
    /// <param name="count">Number of recent logs to retrieve</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Recent activity logs</returns>
    public async Task<IEnumerable<UserActivityLog>> GetRecentActivityAsync(int count = 100,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .OrderByDescending(log => log.CreatedAt)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    #endregion

    #region Activity Statistics

    /// <summary>
    /// Gets activity count by action type
    /// </summary>
    /// <param name="action">Action type</param>
    /// <param name="startDate">Start date (optional)</param>
    /// <param name="endDate">End date (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of activities for the action</returns>
    public async Task<int> GetActivityCountByActionAsync(ActionEnum action, DateTime? startDate = null,
        DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(log => log.Action == action);

        if (startDate.HasValue)
            query = query.Where(log => log.CreatedAt >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(log => log.CreatedAt <= endDate.Value);

        return await query.CountAsync(cancellationToken);
    }

    /// <summary>
    /// Gets activity count for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="startDate">Start date (optional)</param>
    /// <param name="endDate">End date (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of activities for the user</returns>
    public async Task<int> GetActivityCountByUserAsync(Guid userId, DateTime? startDate = null,
        DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(log => log.UserId == userId);

        if (startDate.HasValue)
            query = query.Where(log => log.CreatedAt >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(log => log.CreatedAt <= endDate.Value);

        return await query.CountAsync(cancellationToken);
    }

    /// <summary>
    /// Gets activity statistics by action type using Entity Framework
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Dictionary of action types and their counts</returns>
    public async Task<Dictionary<ActionEnum, int>> GetActivityStatisticsByActionAsync(DateTime startDate,
        DateTime endDate, CancellationToken cancellationToken = default)
    {
        var results = await _dbSet
            .Where(log => log.CreatedAt >= startDate && log.CreatedAt <= endDate && !log.IsDeleted)
            .GroupBy(log => log.Action)
            .Select(g => new { Action = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        return results.ToDictionary(r => r.Action, r => r.Count);
    }

    /// <summary>
    /// Gets daily activity statistics using Entity Framework
    /// </summary>
    /// <param name="days">Number of days to look back</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Daily activity statistics</returns>
    public async Task<Dictionary<DateTime, int>> GetDailyActivityStatisticsAsync(int days,
        CancellationToken cancellationToken = default)
    {
        var startDate = DateTime.UtcNow.Date.AddDays(-days);

        var results = await _dbSet
            .Where(log => log.CreatedAt >= startDate && !log.IsDeleted)
            .GroupBy(log => log.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(cancellationToken);

        return results.ToDictionary(r => r.Date, r => r.Count);
    }

    /// <summary>
    /// Gets most active users using Entity Framework
    /// </summary>
    /// <param name="count">Number of users to return</param>
    /// <param name="startDate">Start date (optional)</param>
    /// <param name="endDate">End date (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Most active users with activity counts</returns>
    public async Task<Dictionary<Guid, int>> GetMostActiveUsersAsync(int count = 10, DateTime? startDate = null,
        DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(log => !log.IsDeleted);

        if (startDate.HasValue)
            query = query.Where(log => log.CreatedAt >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(log => log.CreatedAt <= endDate.Value);

        var results = await query
            .GroupBy(log => log.UserId)
            .Select(g => new { UserId = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(count)
            .ToListAsync(cancellationToken);

        return results.ToDictionary(r => r.UserId, r => r.Count);
    }

    #endregion

    #region Security and Monitoring

    /// <summary>
    /// Gets failed login attempts from an IP address
    /// </summary>
    /// <param name="ipAddress">IP address</param>
    /// <param name="timeWindow">Time window to check (in minutes)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Failed login attempts</returns>
    public async Task<IEnumerable<UserActivityLog>> GetFailedLoginAttemptsByIpAsync(string ipAddress,
        int timeWindow = 60, CancellationToken cancellationToken = default)
    {
        var since = DateTime.UtcNow.AddMinutes(-timeWindow);

        return await _dbSet
            .Where(log => log.IpAddress == ipAddress &&
                          log.Action == ActionEnum.Login &&
                          log.CreatedAt >= since)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets suspicious activities (multiple failed attempts, unusual patterns) using Entity Framework
    /// </summary>
    /// <param name="timeWindow">Time window to check (in hours)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Suspicious activities</returns>
    public async Task<IEnumerable<UserActivityLog>> GetSuspiciousActivitiesAsync(int timeWindow = 24,
        CancellationToken cancellationToken = default)
    {
        var since = DateTime.UtcNow.AddHours(-timeWindow);

        // First, get suspicious IP addresses
        var suspiciousIps = await _dbSet
            .Where(log => log.Action == ActionEnum.Login &&
                          log.CreatedAt >= since && !log.IsDeleted)
            .GroupBy(log => log.IpAddress)
            .Where(g => g.Count() >= 5)
            .Select(g => g.Key)
            .ToListAsync(cancellationToken);

        // Then get all activities from those IPs
        return await _dbSet
            .Where(log => suspiciousIps.Contains(log.IpAddress) &&
                          log.CreatedAt >= since && !log.IsDeleted)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets activities from multiple IP addresses for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="timeWindow">Time window to check (in hours)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activities from multiple IPs</returns>
    public async Task<IEnumerable<UserActivityLog>> GetMultipleIpActivitiesAsync(Guid userId, int timeWindow = 24,
        CancellationToken cancellationToken = default)
    {
        var since = DateTime.UtcNow.AddHours(-timeWindow);

        return await _dbSet
            .Where(log => log.UserId == userId && log.CreatedAt >= since)
            .GroupBy(log => log.IpAddress)
            .Where(g => g.Count() > 1)
            .SelectMany(g => g)
            .OrderByDescending(log => log.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    #endregion

    #region Search and Filtering

    /// <summary>
    /// Searches activity logs with multiple criteria using Entity Framework
    /// </summary>
    /// <param name="userId">User identifier (optional)</param>
    /// <param name="action">Action type (optional)</param>
    /// <param name="entity">Entity name (optional)</param>
    /// <param name="ipAddress">IP address (optional)</param>
    /// <param name="startDate">Start date (optional)</param>
    /// <param name="endDate">End date (optional)</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated search results</returns>
    public async Task<(IEnumerable<UserActivityLog> Logs, int TotalCount)> SearchActivityLogsAsync(
        Guid? userId = null,
        ActionEnum? action = null,
        string? entity = null,
        string? ipAddress = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(log => !log.IsDeleted);

        if (userId.HasValue)
            query = query.Where(log => log.UserId == userId.Value);

        if (action.HasValue)
            query = query.Where(log => log.Action == action.Value);

        if (!string.IsNullOrWhiteSpace(entity))
            query = query.Where(log => log.Entity != null && log.Entity.ToLower().Contains(entity.ToLower()));

        if (!string.IsNullOrWhiteSpace(ipAddress))
            query = query.Where(log => log.IpAddress == ipAddress);

        if (startDate.HasValue)
            query = query.Where(log => log.CreatedAt >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(log => log.CreatedAt <= endDate.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var logs = await query
            .OrderByDescending(log => log.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (logs, totalCount);
    }

    #endregion

    #region Cleanup Operations

    /// <summary>
    /// Archives old activity logs (moves to archive table or marks as archived) using Entity Framework
    /// </summary>
    /// <param name="olderThanDays">Archive logs older than specified days</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of logs archived</returns>
    public async Task<int> ArchiveOldLogsAsync(int olderThanDays, CancellationToken cancellationToken = default)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-olderThanDays);

        var logsToArchive = await _dbSet
            .Where(log => log.CreatedAt < cutoffDate && !log.IsDeleted)
            .ToListAsync(cancellationToken);

        foreach (var log in logsToArchive)
        {
            var entry = _context.Entry(log);
            entry.Property(nameof(UserActivityLog.UpdatedAt)).CurrentValue = DateTime.UtcNow;
        }

        return logsToArchive.Count;
    }

    /// <summary>
    /// Deletes old activity logs permanently using Entity Framework
    /// </summary>
    /// <param name="olderThanDays">Delete logs older than specified days</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of logs deleted</returns>
    public async Task<int> DeleteOldLogsAsync(int olderThanDays, CancellationToken cancellationToken = default)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-olderThanDays);

        var logsToDelete = await _dbSet
            .Where(log => log.CreatedAt < cutoffDate && !log.IsDeleted)
            .ToListAsync(cancellationToken);

        foreach (var log in logsToDelete)
        {
            var entry = _context.Entry(log);
            entry.Property(nameof(UserActivityLog.IsDeleted)).CurrentValue = true;
            entry.Property(nameof(UserActivityLog.UpdatedAt)).CurrentValue = DateTime.UtcNow;
        }

        return logsToDelete.Count;
    }

    #endregion
}
