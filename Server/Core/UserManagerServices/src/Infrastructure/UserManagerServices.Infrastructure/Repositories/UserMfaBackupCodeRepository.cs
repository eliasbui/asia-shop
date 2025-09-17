using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserMfaBackupCode entity
/// </summary>
public class UserMfaBackupCodeRepository : GenericRepository<UserMfaBackupCode>, IUserMfaBackupCodeRepository
{
    private readonly IDapperConnectionFactory _dapperConnectionFactory;

    /// <summary>
    /// Initializes a new instance of the UserMfaBackupCodeRepository
    /// </summary>
    /// <param name="context">Database context</param>
    /// <param name="dapperConnectionFactory">Dapper connection factory</param>
    public UserMfaBackupCodeRepository(ApplicationDbContext context, IDapperConnectionFactory dapperConnectionFactory)
        : base(context)
    {
        _dapperConnectionFactory =
            dapperConnectionFactory ?? throw new ArgumentNullException(nameof(dapperConnectionFactory));
    }

    /// <summary>
    /// Gets all backup codes for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of backup codes</returns>
    public async Task<List<UserMfaBackupCode>> GetByUserIdAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(bc => bc.UserId == userId)
            .OrderByDescending(bc => bc.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets active (unused and not expired) backup codes for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of active backup codes</returns>
    public async Task<List<UserMfaBackupCode>> GetActiveByUserIdAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(bc => bc.UserId == userId &&
                         !bc.IsUsed &&
                         bc.ExpiresAt > DateTime.UtcNow)
            .OrderBy(bc => bc.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets backup codes by generation batch ID
    /// </summary>
    /// <param name="batchId">Generation batch ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of backup codes in the batch</returns>
    public async Task<List<UserMfaBackupCode>> GetByBatchIdAsync(Guid batchId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(bc => bc.GenerationBatchId == batchId)
            .OrderBy(bc => bc.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets count of remaining backup codes for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of remaining backup codes</returns>
    public async Task<int> GetRemainingCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .CountAsync(bc => bc.UserId == userId &&
                              !bc.IsUsed &&
                              bc.ExpiresAt > DateTime.UtcNow,
                cancellationToken);
    }

    /// <summary>
    /// Marks all backup codes for a user as deleted
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of codes marked as deleted</returns>
    public async Task<int> InvalidateAllByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var codes = await _dbSet
            .Where(bc => bc.UserId == userId && !bc.IsDeleted)
            .ToListAsync(cancellationToken);

        foreach (var code in codes)
        {
            code.IsDeleted = true;
            code.UpdatedAt = DateTime.UtcNow;
        }

        return codes.Count;
    }
}