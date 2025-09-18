#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Admin.Commands;

/// <summary>
/// Command for removing a role from a user
/// </summary>
public class RemoveRoleCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID to remove role from
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Role name to remove
    /// </summary>
    public string RoleName { get; set; } = string.Empty;

    /// <summary>
    /// ID of the admin removing the role
    /// </summary>
    public Guid RemovedBy { get; set; }
}