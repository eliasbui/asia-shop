using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Admin.Responses;

namespace UserManagerServices.Application.Features.Admin.Commands;

/// <summary>
/// Command for updating a role
/// </summary>
public class UpdateRoleCommand : IRequest<BaseResponse<RoleResponse>>
{
    /// <summary>
    /// Role ID to update
    /// </summary>
    public Guid RoleId { get; set; }

    /// <summary>
    /// Role name
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// Role description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Whether the role is active
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// ID of the admin updating the role
    /// </summary>
    public Guid UpdatedBy { get; set; }
}
