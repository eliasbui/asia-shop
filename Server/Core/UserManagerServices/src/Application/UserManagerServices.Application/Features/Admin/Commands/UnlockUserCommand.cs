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