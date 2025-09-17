using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Admin.Commands;

/// <summary>
/// Command for assigning a role to a user
/// </summary>
public class AssignRoleCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID to assign role to
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Role name to assign
    /// </summary>
    public string RoleName { get; set; } = string.Empty;

    /// <summary>
    /// ID of the admin assigning the role
    /// </summary>
    public Guid AssignedBy { get; set; }
}
