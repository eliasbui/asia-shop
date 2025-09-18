#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Users.Commands;

/// <summary>
/// Command for deleting a user session
/// </summary>
public class DeleteUserSessionCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID (set from JWT token)
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Session ID to delete
    /// </summary>
    public Guid SessionId { get; set; }
}