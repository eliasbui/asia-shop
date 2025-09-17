using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Admin.Commands;

/// <summary>
/// Command for deleting a role
/// </summary>
public class DeleteRoleCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// Role ID to delete
    /// </summary>
    public Guid RoleId { get; set; }

    /// <summary>
    /// ID of the admin deleting the role
    /// </summary>
    public Guid DeletedBy { get; set; }
}
