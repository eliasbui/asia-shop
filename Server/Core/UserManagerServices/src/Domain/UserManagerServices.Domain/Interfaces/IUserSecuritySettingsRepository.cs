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
/// Repository interface for UserSecuritySettings entity
/// </summary>
public interface IUserSecuritySettingsRepository : IGenericRepository<UserSecuritySettings>
{
    /// <summary>
    /// Gets security settings for a user (or global default if user-specific doesn't exist)
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User security settings or global default</returns>
    Task<UserSecuritySettings> GetUserSecuritySettingsAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets global default security settings
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Global default security settings</returns>
    Task<UserSecuritySettings> GetGlobalDefaultSettingsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates or updates user-specific security settings
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="settings">Security settings</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated security settings</returns>
    Task<UserSecuritySettings> CreateOrUpdateUserSettingsAsync(Guid userId, UserSecuritySettings settings,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates global default security settings
    /// </summary>
    /// <param name="settings">Security settings</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated global settings</returns>
    Task<UserSecuritySettings> UpdateGlobalDefaultSettingsAsync(UserSecuritySettings settings,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if user has custom security settings
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if user has custom settings</returns>
    Task<bool> HasCustomSettingsAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes user-specific security settings (falls back to global default)
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if removed successfully</returns>
    Task<bool> RemoveUserSettingsAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all users with custom security settings
    /// </summary>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated users with custom settings and total count</returns>
    Task<(List<UserSecuritySettings> settings, int totalCount)> GetUsersWithCustomSettingsAsync(
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    /// <summary>
    /// Bulk applies global settings to users who don't have custom settings
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of users updated</returns>
    Task<int> ApplyGlobalSettingsToUsersAsync(CancellationToken cancellationToken = default);
}