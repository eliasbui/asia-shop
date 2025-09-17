using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserMfaSettings entity
/// </summary>
public class UserMfaSettingsRepository : GenericRepository<UserMfaSettings>, IUserMfaSettingsRepository
{
    private readonly IDapperConnectionFactory _dapperConnectionFactory;

    /// <summary>
    /// Initializes a new instance of the UserMfaSettingsRepository
    /// </summary>
    /// <param name="context">Database context</param>
    /// <param name="dapperConnectionFactory">Dapper connection factory</param>
    public UserMfaSettingsRepository(ApplicationDbContext context, IDapperConnectionFactory dapperConnectionFactory)
        : base(context)
    {
        _dapperConnectionFactory = dapperConnectionFactory ?? throw new ArgumentNullException(nameof(dapperConnectionFactory));
    }

    /// <summary>
    /// Gets MFA settings by user ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>MFA settings or null if not found</returns>
    public async Task<UserMfaSettings?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(ms => ms.BackupCodes.Where(bc => !bc.IsDeleted))
            .Include(ms => ms.AuditLogs.Where(al => !al.IsDeleted))
            .FirstOrDefaultAsync(ms => ms.UserId == userId, cancellationToken);
    }

    /// <summary>
    /// Gets all users with MFA enabled
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of users with MFA enabled</returns>
    public async Task<List<UserMfaSettings>> GetEnabledMfaUsersAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(ms => ms.IsEnabled)
            .Include(ms => ms.User)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets all users with MFA enforced
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of users with MFA enforced</returns>
    public async Task<List<UserMfaSettings>> GetEnforcedMfaUsersAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(ms => ms.IsEnforced)
            .Include(ms => ms.User)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets users whose MFA enforcement grace period is expiring
    /// </summary>
    /// <param name="daysBeforeExpiry">Days before expiry to check</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of users with expiring grace period</returns>
    public async Task<List<UserMfaSettings>> GetExpiringGracePeriodUsersAsync(int daysBeforeExpiry = 7, 
        CancellationToken cancellationToken = default)
    {
        var expiryDate = DateTime.UtcNow.AddDays(daysBeforeExpiry);
        
        return await _dbSet
            .Where(ms => ms.IsEnforced && 
                        ms.EnforcementGracePeriodEnd.HasValue && 
                        ms.EnforcementGracePeriodEnd <= expiryDate &&
                        !ms.IsEnabled)
            .Include(ms => ms.User)
            .ToListAsync(cancellationToken);
    }
}
