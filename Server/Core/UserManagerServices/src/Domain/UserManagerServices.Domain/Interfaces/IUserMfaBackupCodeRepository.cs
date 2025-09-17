using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Repository interface for UserMfaBackupCode entity
/// </summary>
public interface IUserMfaBackupCodeRepository : IGenericRepository<UserMfaBackupCode>
{
    /// <summary>
    /// Gets all backup codes for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of backup codes</returns>
    Task<List<UserMfaBackupCode>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active (unused and not expired) backup codes for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of active backup codes</returns>
    Task<List<UserMfaBackupCode>> GetActiveByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets backup codes by generation batch ID
    /// </summary>
    /// <param name="batchId">Generation batch ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of backup codes in the batch</returns>
    Task<List<UserMfaBackupCode>> GetByBatchIdAsync(Guid batchId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets count of remaining backup codes for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of remaining backup codes</returns>
    Task<int> GetRemainingCountAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks all backup codes for a user as deleted
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of codes marked as deleted</returns>
    Task<int> InvalidateAllByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}