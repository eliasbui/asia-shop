using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Repository interface for UserActivityLog entity with specialized operations
/// Handles audit trail and activity monitoring functionality
/// </summary>
public interface IUserActivityLogRepository : IGenericRepository<UserActivityLog>
{
    #region Activity Log Queries

    /// <summary>
    /// Gets activity logs for a specific user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activity logs for the user</returns>
    Task<IEnumerable<UserActivityLog>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets activity logs by action type
    /// </summary>
    /// <param name="action">Action type</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activity logs for the action</returns>
    Task<IEnumerable<UserActivityLog>> GetByActionAsync(ActionEnum action,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets activity logs for a specific entity
    /// </summary>
    /// <param name="entity">Entity name</param>
    /// <param name="entityId">Entity identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activity logs for the entity</returns>
    Task<IEnumerable<UserActivityLog>> GetByEntityAsync(string entity, Guid entityId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets activity logs by IP address
    /// </summary>
    /// <param name="ipAddress">IP address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activity logs from the IP address</returns>
    Task<IEnumerable<UserActivityLog>> GetByIpAddressAsync(string ipAddress,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets activity logs within a date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activity logs within the date range</returns>
    Task<IEnumerable<UserActivityLog>> GetByDateRangeAsync(DateTime startDate, DateTime endDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets recent activity logs
    /// </summary>
    /// <param name="count">Number of recent logs to retrieve</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Recent activity logs</returns>
    Task<IEnumerable<UserActivityLog>> GetRecentActivityAsync(int count = 100,
        CancellationToken cancellationToken = default);

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
    Task<int> GetActivityCountByActionAsync(ActionEnum action, DateTime? startDate = null, DateTime? endDate = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets activity count for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="startDate">Start date (optional)</param>
    /// <param name="endDate">End date (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of activities for the user</returns>
    Task<int> GetActivityCountByUserAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets activity statistics by action type
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Dictionary of action types and their counts</returns>
    Task<Dictionary<ActionEnum, int>> GetActivityStatisticsByActionAsync(DateTime startDate, DateTime endDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets daily activity statistics
    /// </summary>
    /// <param name="days">Number of days to look back</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Daily activity statistics</returns>
    Task<Dictionary<DateTime, int>> GetDailyActivityStatisticsAsync(int days,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets most active users
    /// </summary>
    /// <param name="count">Number of users to return</param>
    /// <param name="startDate">Start date (optional)</param>
    /// <param name="endDate">End date (optional)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Most active users with activity counts</returns>
    Task<Dictionary<Guid, int>> GetMostActiveUsersAsync(int count = 10, DateTime? startDate = null,
        DateTime? endDate = null, CancellationToken cancellationToken = default);

    #endregion

    #region Security and Monitoring

    /// <summary>
    /// Gets failed login attempts from an IP address
    /// </summary>
    /// <param name="ipAddress">IP address</param>
    /// <param name="timeWindow">Time window to check (in minutes)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Failed login attempts</returns>
    Task<IEnumerable<UserActivityLog>> GetFailedLoginAttemptsByIpAsync(string ipAddress, int timeWindow = 60,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets suspicious activities (multiple failed attempts, unusual patterns)
    /// </summary>
    /// <param name="timeWindow">Time window to check (in hours)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Suspicious activities</returns>
    Task<IEnumerable<UserActivityLog>> GetSuspiciousActivitiesAsync(int timeWindow = 24,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets activities from multiple IP addresses for a user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="timeWindow">Time window to check (in hours)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Activities from multiple IPs</returns>
    Task<IEnumerable<UserActivityLog>> GetMultipleIpActivitiesAsync(Guid userId, int timeWindow = 24,
        CancellationToken cancellationToken = default);

    #endregion

    #region Search and Filtering

    /// <summary>
    /// Searches activity logs with multiple criteria
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
    Task<(IEnumerable<UserActivityLog> Logs, int TotalCount)> SearchActivityLogsAsync(
        Guid? userId = null,
        ActionEnum? action = null,
        string? entity = null,
        string? ipAddress = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        int pageNumber = 1,
        int pageSize = 50,
        CancellationToken cancellationToken = default);

    #endregion

    #region Cleanup Operations

    /// <summary>
    /// Archives old activity logs (moves to archive table or marks as archived)
    /// </summary>
    /// <param name="olderThanDays">Archive logs older than specified days</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of logs archived</returns>
    Task<int> ArchiveOldLogsAsync(int olderThanDays, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes old activity logs permanently
    /// </summary>
    /// <param name="olderThanDays">Delete logs older than specified days</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of logs deleted</returns>
    Task<int> DeleteOldLogsAsync(int olderThanDays, CancellationToken cancellationToken = default);

    #endregion
}