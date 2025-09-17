using Dapper;
using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserLockoutHistory entity
/// </summary>
public class UserLockoutHistoryRepository : GenericRepository<UserLockoutHistory>, IUserLockoutHistoryRepository
{
    public UserLockoutHistoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    /// <summary>
    /// Gets active lockout for a user
    /// </summary>
    public async Task<UserLockoutHistory?> GetActiveLockoutAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.UserLockoutHistory
            .Where(lh => lh.UserId == userId && 
                        lh.IsActive && 
                        (lh.LockoutEnd == null || lh.LockoutEnd > DateTime.UtcNow))
            .OrderByDescending(lh => lh.LockoutStart)
            .FirstOrDefaultAsync(cancellationToken);
    }

    /// <summary>
    /// Gets lockout history for a user
    /// </summary>
    public async Task<(List<UserLockoutHistory> history, int totalCount)> GetUserLockoutHistoryAsync(Guid userId, 
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _context.UserLockoutHistory
            .Where(lh => lh.UserId == userId)
            .OrderByDescending(lh => lh.LockoutStart);

        var totalCount = await query.CountAsync(cancellationToken);
        var history = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (history, totalCount);
    }

    /// <summary>
    /// Gets lockout count for a user within a time period
    /// </summary>
    public async Task<int> GetLockoutCountAsync(Guid userId, DateTime fromDate, DateTime toDate, 
        CancellationToken cancellationToken = default)
    {
        return await _context.UserLockoutHistory
            .Where(lh => lh.UserId == userId && 
                        lh.LockoutStart >= fromDate && 
                        lh.LockoutStart <= toDate)
            .CountAsync(cancellationToken);
    }

    /// <summary>
    /// Gets the highest lockout level for a user within a time period
    /// </summary>
    public async Task<int> GetHighestLockoutLevelAsync(Guid userId, DateTime fromDate, DateTime toDate, 
        CancellationToken cancellationToken = default)
    {
        var maxLevel = await _context.UserLockoutHistory
            .Where(lh => lh.UserId == userId && 
                        lh.LockoutStart >= fromDate && 
                        lh.LockoutStart <= toDate)
            .MaxAsync(lh => (int?)lh.LockoutLevel, cancellationToken);

        return maxLevel ?? 0;
    }

    /// <summary>
    /// Gets recent lockouts across all users
    /// </summary>
    public async Task<(List<UserLockoutHistory> lockouts, int totalCount)> GetRecentLockoutsAsync(
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _context.UserLockoutHistory
            .Include(lh => lh.User)
            .OrderByDescending(lh => lh.LockoutStart);

        var totalCount = await query.CountAsync(cancellationToken);
        var lockouts = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (lockouts, totalCount);
    }

    /// <summary>
    /// Gets lockouts by type
    /// </summary>
    public async Task<(List<UserLockoutHistory> lockouts, int totalCount)> GetLockoutsByTypeAsync(LockoutTypeEnum lockoutType, 
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _context.UserLockoutHistory
            .Include(lh => lh.User)
            .Where(lh => lh.LockoutType == lockoutType)
            .OrderByDescending(lh => lh.LockoutStart);

        var totalCount = await query.CountAsync(cancellationToken);
        var lockouts = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (lockouts, totalCount);
    }

    /// <summary>
    /// Gets lockout statistics for a date range
    /// </summary>
    public async Task<Dictionary<string, int>> GetLockoutStatisticsAsync(DateTime fromDate, DateTime toDate, 
        CancellationToken cancellationToken = default)
    {
        var sql = @"
            SELECT 
                COUNT(*) as TotalLockouts,
                COUNT(CASE WHEN ""IsActive"" = true THEN 1 END) as ActiveLockouts,
                COUNT(CASE WHEN ""LockoutType"" = 0 THEN 1 END) as AutomaticLockouts,
                COUNT(CASE WHEN ""LockoutType"" = 1 THEN 1 END) as ManualLockouts,
                COUNT(CASE WHEN ""LockoutType"" = 2 THEN 1 END) as SuspiciousActivityLockouts,
                COUNT(DISTINCT ""UserId"") as UniqueUsersLocked,
                AVG(""LockoutLevel"") as AverageLockoutLevel
            FROM ""UserLockoutHistory""
            WHERE ""LockoutStart"" >= @FromDate AND ""LockoutStart"" <= @ToDate
                AND ""IsDeleted"" = false";

        using var connection = _context.Database.GetDbConnection();
        var result = await connection.QueryFirstAsync<dynamic>(sql, new { FromDate = fromDate, ToDate = toDate });

        return new Dictionary<string, int>
        {
            ["TotalLockouts"] = (int)result.totallockouts,
            ["ActiveLockouts"] = (int)result.activelockouts,
            ["AutomaticLockouts"] = (int)result.automaticlockouts,
            ["ManualLockouts"] = (int)result.manuallockouts,
            ["SuspiciousActivityLockouts"] = (int)result.suspiciousactivitylockouts,
            ["UniqueUsersLocked"] = (int)result.uniqueuserslocked,
            ["AverageLockoutLevel"] = (int)Math.Round((decimal)result.averagelockoutlevel ?? 0)
        };
    }

    /// <summary>
    /// Releases an active lockout
    /// </summary>
    public async Task<bool> ReleaseLockoutAsync(Guid lockoutId, LockoutReleaseReasonEnum releaseReason, 
        Guid? releasedByUserId = null, CancellationToken cancellationToken = default)
    {
        var lockout = await _context.UserLockoutHistory
            .FirstOrDefaultAsync(lh => lh.Id == lockoutId && lh.IsActive, cancellationToken);

        if (lockout == null)
            return false;

        lockout.IsActive = false;
        lockout.ReleasedAt = DateTime.UtcNow;
        lockout.ReleaseReason = releaseReason;
        lockout.ReleasedByUserId = releasedByUserId;
        lockout.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    /// <summary>
    /// Cleans up old lockout history
    /// </summary>
    public async Task<int> CleanupOldHistoryAsync(int olderThanDays = 365, CancellationToken cancellationToken = default)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-olderThanDays);
        
        var sql = @"
            DELETE FROM ""UserLockoutHistory""
            WHERE ""LockoutStart"" < @CutoffDate AND ""IsActive"" = false";

        using var connection = _context.Database.GetDbConnection();
        return await connection.ExecuteAsync(sql, new { CutoffDate = cutoffDate });
    }
}
