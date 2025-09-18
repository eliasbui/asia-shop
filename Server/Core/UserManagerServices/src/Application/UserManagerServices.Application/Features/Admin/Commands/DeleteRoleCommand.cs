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