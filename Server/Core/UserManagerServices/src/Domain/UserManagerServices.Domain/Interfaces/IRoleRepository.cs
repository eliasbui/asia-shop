using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Repository interface for Role entity with specialized operations
/// Extends generic repository with role-specific functionality
/// </summary>
public interface IRoleRepository : IGenericRepository<Role>
{
    #region Role-Specific Queries

    /// <summary>
    /// Gets a role by name
    /// </summary>
    /// <param name="roleName">Role name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Role if found, null otherwise</returns>
    Task<Role?> GetByNameAsync(string roleName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a role by normalized name
    /// </summary>
    /// <param name="normalizedName">Normalized role name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Role if found, null otherwise</returns>
    Task<Role?> GetByNormalizedNameAsync(string normalizedName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all active roles
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Active roles</returns>
    Task<IEnumerable<Role>> GetActiveRolesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all system roles
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>System roles</returns>
    Task<IEnumerable<Role>> GetSystemRolesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all non-system roles (user-defined roles)
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Non-system roles</returns>
    Task<IEnumerable<Role>> GetUserDefinedRolesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets roles assigned to a specific user
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Roles assigned to the user</returns>
    Task<IEnumerable<Role>> GetRolesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    #endregion

    #region Role Statistics

    /// <summary>
    /// Gets count of users in a specific role
    /// </summary>
    /// <param name="roleId">Role identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of users in the role</returns>
    Task<int> GetUserCountInRoleAsync(Guid roleId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets role usage statistics
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Dictionary of role names and user counts</returns>
    Task<Dictionary<string, int>> GetRoleUsageStatisticsAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Role Validation

    /// <summary>
    /// Checks if role name is already taken by another role
    /// </summary>
    /// <param name="roleName">Role name to check</param>
    /// <param name="excludeRoleId">Role ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if role name is taken, false otherwise</returns>
    Task<bool> IsRoleNameTakenAsync(string roleName, Guid? excludeRoleId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a role can be deleted (not a system role and has no users)
    /// </summary>
    /// <param name="roleId">Role identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if role can be deleted, false otherwise</returns>
    Task<bool> CanDeleteRoleAsync(Guid roleId, CancellationToken cancellationToken = default);

    #endregion

    #region Search and Filtering

    /// <summary>
    /// Searches roles by name and description
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="isActive">Filter by active status</param>
    /// <param name="isSystemRole">Filter by system role status</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated search results</returns>
    Task<(IEnumerable<Role> Roles, int TotalCount)> SearchRolesAsync(
        string? searchTerm = null,
        bool? isActive = null,
        bool? isSystemRole = null,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);

    #endregion
}