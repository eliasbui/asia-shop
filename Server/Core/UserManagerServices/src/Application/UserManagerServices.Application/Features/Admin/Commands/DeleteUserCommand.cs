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
/// Command for deleting a user
/// </summary>
public class DeleteUserCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID to delete
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// ID of the admin deleting the user
    /// </summary>
    public Guid DeletedBy { get; set; }
}