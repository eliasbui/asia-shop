#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Repository interface for UserMfaSettings entity
/// </summary>
public interface IUserMfaSettingsRepository : IGenericRepository<UserMfaSettings>
{
    /// <summary>
    /// Gets MFA settings by user ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>MFA settings or null if not found</returns>
    Task<UserMfaSettings?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all users with MFA enabled
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of users with MFA enabled</returns>
    Task<List<UserMfaSettings>> GetEnabledMfaUsersAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all users with MFA enforced
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of users with MFA enforced</returns>
    Task<List<UserMfaSettings>> GetEnforcedMfaUsersAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets users whose MFA enforcement grace period is expiring
    /// </summary>
    /// <param name="daysBeforeExpiry">Days before expiry to check</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of users with expiring grace period</returns>
    Task<List<UserMfaSettings>> GetExpiringGracePeriodUsersAsync(int daysBeforeExpiry = 7,
        CancellationToken cancellationToken = default);
}