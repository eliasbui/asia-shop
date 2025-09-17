using Dapper;
using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserLoginAttempt entity
/// </summary>
public class UserLoginAttemptRepository : GenericRepository<UserLoginAttempt>, IUserLoginAttemptRepository
{
    public UserLoginAttemptRepository(ApplicationDbContext context) : base(context)
    {
    }

    /// <summary>
    /// Gets login attempts for a user within a time window
    /// </summary>
    public async Task<List<UserLoginAttempt>> GetUserAttemptsAsync(Guid userId, DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserLoginAttempts
            .Where(la => la.UserId == userId &&
                         la.AttemptedAt >= fromDate &&
                         la.AttemptedAt <= toDate)
            .OrderByDescending(la => la.AttemptedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets failed login attempts for a user within a time window
    /// </summary>
    public async Task<List<UserLoginAttempt>> GetFailedAttemptsAsync(Guid userId, DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserLoginAttempts
            .Where(la => la.UserId == userId &&
                         !la.IsSuccessful &&
                         la.AttemptedAt >= fromDate &&
                         la.AttemptedAt <= toDate)
            .OrderByDescending(la => la.AttemptedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets login attempts from a specific IP address within a time window
    /// </summary>
    public async Task<List<UserLoginAttempt>> GetIpAttemptsAsync(string ipAddress, DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserLoginAttempts
            .Where(la => la.IpAddress == ipAddress &&
                         la.AttemptedAt >= fromDate &&
                         la.AttemptedAt <= toDate)
            .OrderByDescending(la => la.AttemptedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets suspicious login attempts
    /// </summary>
    public async Task<(List<UserLoginAttempt> attempts, int totalCount)> GetSuspiciousAttemptsAsync(
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _context.UserLoginAttempts
            .Where(la => la.IsSuspicious)
            .OrderByDescending(la => la.AttemptedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var attempts = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (attempts, totalCount);
    }

    /// <summary>
    /// Gets recent login attempts for a user
    /// </summary>
    public async Task<List<UserLoginAttempt>> GetRecentAttemptsAsync(Guid userId, int count = 10,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserLoginAttempts
            .Where(la => la.UserId == userId)
            .OrderByDescending(la => la.AttemptedAt)
            .Take(count)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets login attempts by email or username
    /// </summary>
    public async Task<List<UserLoginAttempt>> GetAttemptsByEmailOrUsernameAsync(string emailOrUsername,
        DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default)
    {
        return await _context.UserLoginAttempts
            .Where(la => la.EmailOrUsername.ToLower() == emailOrUsername.ToLower() &&
                         la.AttemptedAt >= fromDate &&
                         la.AttemptedAt <= toDate)
            .OrderByDescending(la => la.AttemptedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets login statistics for a date range
    /// </summary>
    public async Task<Dictionary<string, int>> GetLoginStatisticsAsync(DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default)
    {
        var sql = @"
            SELECT
                COUNT(*) as TotalAttempts,
                COUNT(CASE WHEN ""IsSuccessful"" = true THEN 1 END) as SuccessfulAttempts,
                COUNT(CASE WHEN ""IsSuccessful"" = false THEN 1 END) as FailedAttempts,
                COUNT(CASE WHEN ""IsSuspicious"" = true THEN 1 END) as SuspiciousAttempts,
                COUNT(CASE WHEN ""TriggeredLockout"" = true THEN 1 END) as LockoutTriggers,
                COUNT(DISTINCT ""UserId"") as UniqueUsers,
                COUNT(DISTINCT ""IpAddress"") as UniqueIpAddresses
            FROM ""UserLoginAttempts""
            WHERE ""AttemptedAt"" >= @FromDate AND ""AttemptedAt"" <= @ToDate
                AND ""IsDeleted"" = false";

        using var connection = _context.Database.GetDbConnection();
        var result = await connection.QueryFirstAsync<dynamic>(sql, new { FromDate = fromDate, ToDate = toDate });

        return new Dictionary<string, int>
        {
            ["TotalAttempts"] = (int)result.totalattempts,
            ["SuccessfulAttempts"] = (int)result.successfulattempts,
            ["FailedAttempts"] = (int)result.failedattempts,
            ["SuspiciousAttempts"] = (int)result.suspiciousattempts,
            ["LockoutTriggers"] = (int)result.lockouttriggers,
            ["UniqueUsers"] = (int)result.uniqueusers,
            ["UniqueIpAddresses"] = (int)result.uniqueipaddresses
        };
    }

    /// <summary>
    /// Cleans up old login attempts
    /// </summary>
    public async Task<int> CleanupOldAttemptsAsync(int olderThanDays = 90,
        CancellationToken cancellationToken = default)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-olderThanDays);

        var sql = @"
            DELETE FROM ""UserLoginAttempts""
            WHERE ""AttemptedAt"" < @CutoffDate";

        using var connection = _context.Database.GetDbConnection();
        return await connection.ExecuteAsync(sql, new { CutoffDate = cutoffDate });
    }
}