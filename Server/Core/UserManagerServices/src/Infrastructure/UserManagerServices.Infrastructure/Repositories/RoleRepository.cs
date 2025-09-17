using Dapper;
using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Role entity with specialized operations
/// Combines Entity Framework Core with Dapper for optimal performance
/// </summary>
public class RoleRepository : GenericRepository<Role>, IRoleRepository
{
    /// <summary>
    /// Initializes a new instance of the RoleRepository
    /// </summary>
    /// <param name="context">Database context</param>
    public RoleRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    #region Role-Specific Queries

    /// <summary>
    /// Gets a role by name
    /// </summary>
    /// <param name="roleName">Role name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Role if found, null otherwise</returns>
    public async Task<Role?> GetByNameAsync(string roleName, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(r => r.Name == roleName, cancellationToken);
    }

    /// <summary>
    /// Gets a role by normalized name
    /// </summary>
    /// <param name="normalizedName">Normalized role name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Role if found, null otherwise</returns>
    public async Task<Role?> GetByNormalizedNameAsync(string normalizedName,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(r => r.NormalizedName == normalizedName, cancellationToken);
    }

    /// <summary>
    /// Gets all active roles
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Active roles</returns>
    public async Task<IEnumerable<Role>> GetActiveRolesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.Where(r => r.IsActive).ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets all system roles
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>System roles</returns>
    public async Task<IEnumerable<Role>> GetSystemRolesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.Where(r => r.IsSystemRole).ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets all non-system roles (user-defined roles)
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Non-system roles</returns>
    public async Task<IEnumerable<Role>> GetUserDefinedRolesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.Where(r => !r.IsSystemRole).ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets roles assigned to a specific user using Entity Framework
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Roles assigned to the user</returns>
    public async Task<IEnumerable<Role>> GetRolesByUserIdAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserRoles
            .Where(ur => ur.UserId == userId && !ur.IsDeleted)
            .Join(_context.Roles,
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => r)
            .Where(r => !r.IsDeleted)
            .ToListAsync(cancellationToken);
    }

    #endregion

    #region Role Statistics

    /// <summary>
    /// Gets count of users in a specific role using Entity Framework
    /// </summary>
    /// <param name="roleId">Role identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of users in the role</returns>
    public async Task<int> GetUserCountInRoleAsync(Guid roleId, CancellationToken cancellationToken = default)
    {
        return await _context.UserRoles
            .Where(ur => ur.RoleId == roleId && !ur.IsDeleted)
            .Join(_context.Users,
                ur => ur.UserId,
                u => u.Id,
                (ur, u) => u)
            .Where(u => !u.IsDeleted)
            .CountAsync(cancellationToken);
    }

    /// <summary>
    /// Gets role usage statistics using Entity Framework
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Dictionary of role names and user counts</returns>
    public async Task<Dictionary<string, int>> GetRoleUsageStatisticsAsync(
        CancellationToken cancellationToken = default)
    {
        var roleStats = await _context.Roles
            .Where(r => !r.IsDeleted)
            .Select(r => new
            {
                r.Name,
                UserCount = _context.UserRoles
                    .Where(ur => ur.RoleId == r.Id && !ur.IsDeleted)
                    .Join(_context.Users.Where(u => !u.IsDeleted),
                        ur => ur.UserId,
                        u => u.Id,
                        (ur, u) => u)
                    .Count()
            })
            .OrderByDescending(x => x.UserCount)
            .ToListAsync(cancellationToken);

        return roleStats.ToDictionary(r => r.Name ?? string.Empty, r => r.UserCount);
    }

    #endregion

    #region Role Validation

    /// <summary>
    /// Checks if role name is already taken by another role
    /// </summary>
    /// <param name="roleName">Role name to check</param>
    /// <param name="excludeRoleId">Role ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if role name is taken, false otherwise</returns>
    public async Task<bool> IsRoleNameTakenAsync(string roleName, Guid? excludeRoleId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(r => r.Name == roleName);

        if (excludeRoleId.HasValue) query = query.Where(r => r.Id != excludeRoleId.Value);

        return await query.AnyAsync(cancellationToken);
    }

    /// <summary>
    /// Checks if a role can be deleted (not a system role and has no users)
    /// </summary>
    /// <param name="roleId">Role identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if role can be deleted, false otherwise</returns>
    public async Task<bool> CanDeleteRoleAsync(Guid roleId, CancellationToken cancellationToken = default)
    {
        var role = await _dbSet.FirstOrDefaultAsync(r => r.Id == roleId, cancellationToken);
        if (role == null || role.IsSystemRole) return false;

        var userCount = await GetUserCountInRoleAsync(roleId, cancellationToken);
        return userCount == 0;
    }

    #endregion

    #region Search and Filtering

    /// <summary>
    /// Searches roles by name and description using Entity Framework
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="isActive">Filter by active status</param>
    /// <param name="isSystemRole">Filter by system role status</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated search results</returns>
    public async Task<(IEnumerable<Role> Roles, int TotalCount)> SearchRolesAsync(
        string? searchTerm = null,
        bool? isActive = null,
        bool? isSystemRole = null,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(r => !r.IsDeleted);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(r => (r.Name != null && r.Name.ToLower().Contains(lowerSearchTerm)) ||
                                   (r.Description != null && r.Description.ToLower().Contains(lowerSearchTerm)));
        }

        if (isActive.HasValue)
        {
            query = query.Where(r => r.IsActive == isActive.Value);
        }

        if (isSystemRole.HasValue)
        {
            query = query.Where(r => r.IsSystemRole == isSystemRole.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var roles = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (roles, totalCount);
    }

    #endregion
}
