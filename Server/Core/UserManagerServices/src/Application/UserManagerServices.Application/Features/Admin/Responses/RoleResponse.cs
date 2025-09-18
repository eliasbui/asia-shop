#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace UserManagerServices.Application.Features.Admin.Responses;

/// <summary>
/// Response model for single role operations
/// </summary>
public class RoleResponse
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
    /// Role claims
    /// </summary>
    public List<RoleClaimInfo> Claims { get; set; } = new();

    /// <summary>
    /// Number of users with this role
    /// </summary>
    public int UserCount { get; set; }

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
/// Role claim information
/// </summary>
public class RoleClaimInfo
{
    /// <summary>
    /// Claim ID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Claim type
    /// </summary>
    public string Type { get; set; } = string.Empty;

    /// <summary>
    /// Claim value
    /// </summary>
    public string Value { get; set; } = string.Empty;
}