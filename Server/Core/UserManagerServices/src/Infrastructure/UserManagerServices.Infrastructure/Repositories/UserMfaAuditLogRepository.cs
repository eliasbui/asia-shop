using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserMfaAuditLog entity
/// </summary>
public class UserMfaAuditLogRepository : GenericRepository<UserMfaAuditLog>, IUserMfaAuditLogRepository
{
    /// <summary>
    /// Initializes a new instance of the UserMfaAuditLogRepository
    /// </summary>
    /// <param name="context">Database context</param>
    public UserMfaAuditLogRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    /// <summary>
    /// Gets paginated MFA audit logs for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated audit logs and total count</returns>
    public async Task<(List<UserMfaAuditLog> logs, int totalCount)> GetPagedByUserIdAsync(Guid userId,
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(al => al.UserId == userId);

        var totalCount = await query.CountAsync(cancellationToken);

        var logs = await query
            .OrderByDescending(al => al.Timestamp)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (logs, totalCount);
    }

    /// <summary>
    /// Gets MFA audit logs by action type
    /// </summary>
    /// <param name="action">MFA action</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated audit logs and total count</returns>
    public async Task<(List<UserMfaAuditLog> logs, int totalCount)> GetPagedByActionAsync(MfaActionEnum action,
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(al => al.Action == action);

        var totalCount = await query.CountAsync(cancellationToken);

        var logs = await query
            .Include(al => al.User)
            .OrderByDescending(al => al.Timestamp)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (logs, totalCount);
    }

    /// <summary>
    /// Gets failed MFA attempts for a user within a time period
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of failed MFA attempts</returns>
    public async Task<List<UserMfaAuditLog>> GetFailedAttemptsAsync(Guid userId, DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(al => al.UserId == userId &&
                         !al.IsSuccess &&
                         al.Timestamp >= fromDate &&
                         al.Timestamp <= toDate)
            .OrderByDescending(al => al.Timestamp)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets suspicious MFA activities
    /// </summary>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated suspicious activities and total count</returns>
    public async Task<(List<UserMfaAuditLog> logs, int totalCount)> GetSuspiciousActivitiesAsync(
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(al => al.Action == MfaActionEnum.SuspiciousActivity ||
                                       al.RiskScore > 0.7m);

        var totalCount = await query.CountAsync(cancellationToken);

        var logs = await query
            .Include(al => al.User)
            .OrderByDescending(al => al.Timestamp)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (logs, totalCount);
    }

    /// <summary>
    /// Gets MFA audit logs that triggered alerts
    /// </summary>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated alert logs and total count</returns>
    public async Task<(List<UserMfaAuditLog> logs, int totalCount)> GetTriggeredAlertsAsync(
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(al => al.TriggeredAlert);

        var totalCount = await query.CountAsync(cancellationToken);

        var logs = await query
            .Include(al => al.User)
            .OrderByDescending(al => al.Timestamp)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (logs, totalCount);
    }

    /// <summary>
    /// Gets MFA statistics for a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>MFA statistics</returns>
    public async Task<Dictionary<string, int>> GetMfaStatisticsAsync(DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default)
    {
        var logs = await _dbSet
            .Where(al => al.Timestamp >= fromDate && al.Timestamp <= toDate)
            .ToListAsync(cancellationToken);

        var stats = new Dictionary<string, int>
        {
            ["TotalAttempts"] = logs.Count,
            ["SuccessfulAttempts"] = logs.Count(l => l.IsSuccess),
            ["FailedAttempts"] = logs.Count(l => !l.IsSuccess),
            ["TotpAttempts"] = logs.Count(l => l.Method == "TOTP"),
            ["BackupCodeAttempts"] = logs.Count(l => l.Method == "BackupCode"),
            ["EmailOtpAttempts"] = logs.Count(l => l.Method == "EmailOTP"),
            ["SuspiciousActivities"] = logs.Count(l => l.Action == MfaActionEnum.SuspiciousActivity),
            ["TriggeredAlerts"] = logs.Count(l => l.TriggeredAlert),
            ["UniqueUsers"] = logs.Select(l => l.UserId).Distinct().Count()
        };

        return stats;
    }
}
