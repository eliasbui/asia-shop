using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.Application.Features.Admin.Responses;

/// <summary>
/// Response model for roles list
/// </summary>
public class RolesResponse
{
    /// <summary>
    /// List of roles
    /// </summary>
    public List<RoleInfo> Roles { get; set; } = new();

    /// <summary>
    /// Pagination information
    /// </summary>
    public PaginationInfo Pagination { get; set; } = new();

    /// <summary>
    /// Filter information applied
    /// </summary>
    public RoleFilterInfo Filters { get; set; } = new();

    public string? SearchTerm { get; set; }
}

/// <summary>
/// Role information
/// </summary>
public class RoleInfo
{
    /// <summary>
    /// Role ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Role name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Role description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Whether the role is active
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Number of users with this role
    /// </summary>
    public int UserCount { get; set; }

    /// <summary>
    /// Number of claims associated with this role
    /// </summary>
    public int ClaimCount { get; set; }

    /// <summary>
    /// When the role was created
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// When the role was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Role filter information
/// </summary>
public class RoleFilterInfo
{
    /// <summary>
    /// Search term applied
    /// </summary>
    public string? SearchTerm { get; set; }
}