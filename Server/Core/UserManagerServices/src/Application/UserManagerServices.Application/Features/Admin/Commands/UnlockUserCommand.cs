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
/// Command for unlocking a user account
/// </summary>
public class UnlockUserCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID to unlock
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// ID of the admin unlocking the user
    /// </summary>
    public Guid UnlockedBy { get; set; }
}