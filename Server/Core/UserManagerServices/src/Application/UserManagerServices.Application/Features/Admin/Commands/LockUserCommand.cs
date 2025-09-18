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
/// Command for locking a user account
/// </summary>
public class LockUserCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID to lock
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Reason for locking the account
    /// </summary>
    public string? Reason { get; set; }

    /// <summary>
    /// Duration of the lock in hours (null for indefinite)
    /// </summary>
    public int? LockDurationHours { get; set; }

    /// <summary>
    /// ID of the admin locking the user
    /// </summary>
    public Guid LockedBy { get; set; }
}