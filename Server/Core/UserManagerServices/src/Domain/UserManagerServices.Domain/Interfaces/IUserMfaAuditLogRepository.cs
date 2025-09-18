#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Repository interface for UserMfaAuditLog entity
/// </summary>
public interface IUserMfaAuditLogRepository : IGenericRepository<UserMfaAuditLog>
{
    /// <summary>
    /// Gets paginated MFA audit logs for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated audit logs and total count</returns>
    Task<(List<UserMfaAuditLog> logs, int totalCount)> GetPagedByUserIdAsync(Guid userId,
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets MFA audit logs by action type
    /// </summary>
    /// <param name="action">MFA action</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated audit logs and total count</returns>
    Task<(List<UserMfaAuditLog> logs, int totalCount)> GetPagedByActionAsync(MfaActionEnum action,
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets failed MFA attempts for a user within a time period
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of failed MFA attempts</returns>
    Task<List<UserMfaAuditLog>> GetFailedAttemptsAsync(Guid userId, DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets suspicious MFA activities
    /// </summary>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated suspicious activities and total count</returns>
    Task<(List<UserMfaAuditLog> logs, int totalCount)> GetSuspiciousActivitiesAsync(
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets MFA audit logs that triggered alerts
    /// </summary>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated alert logs and total count</returns>
    Task<(List<UserMfaAuditLog> logs, int totalCount)> GetTriggeredAlertsAsync(
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets MFA statistics for a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>MFA statistics</returns>
    Task<Dictionary<string, int>> GetMfaStatisticsAsync(DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default);
}