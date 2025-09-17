using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Repository interface for UserLockoutHistory entity
/// </summary>
public interface IUserLockoutHistoryRepository : IGenericRepository<UserLockoutHistory>
{
    /// <summary>
    /// Gets active lockout for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Active lockout or null</returns>
    Task<UserLockoutHistory?> GetActiveLockoutAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets lockout history for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated lockout history and total count</returns>
    Task<(List<UserLockoutHistory> history, int totalCount)> GetUserLockoutHistoryAsync(Guid userId, 
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets lockout count for a user within a time period
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Lockout count</returns>
    Task<int> GetLockoutCountAsync(Guid userId, DateTime fromDate, DateTime toDate, 
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the highest lockout level for a user within a time period
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Highest lockout level</returns>
    Task<int> GetHighestLockoutLevelAsync(Guid userId, DateTime fromDate, DateTime toDate, 
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets recent lockouts across all users
    /// </summary>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated recent lockouts and total count</returns>
    Task<(List<UserLockoutHistory> lockouts, int totalCount)> GetRecentLockoutsAsync(
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets lockouts by type
    /// </summary>
    /// <param name="lockoutType">Lockout type</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated lockouts and total count</returns>
    Task<(List<UserLockoutHistory> lockouts, int totalCount)> GetLockoutsByTypeAsync(LockoutTypeEnum lockoutType, 
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets lockout statistics for a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Lockout statistics</returns>
    Task<Dictionary<string, int>> GetLockoutStatisticsAsync(DateTime fromDate, DateTime toDate, 
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Releases an active lockout
    /// </summary>
    /// <param name="lockoutId">Lockout ID</param>
    /// <param name="releaseReason">Release reason</param>
    /// <param name="releasedByUserId">User who released the lockout</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if released successfully</returns>
    Task<bool> ReleaseLockoutAsync(Guid lockoutId, LockoutReleaseReasonEnum releaseReason, 
        Guid? releasedByUserId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cleans up old lockout history
    /// </summary>
    /// <param name="olderThanDays">Delete history older than specified days</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of records cleaned up</returns>
    Task<int> CleanupOldHistoryAsync(int olderThanDays = 365, CancellationToken cancellationToken = default);
}
