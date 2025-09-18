#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Authentication.Commands;

/// <summary>
/// Command for user logout
/// </summary>
public class LogoutCommand : IRequest<BaseResponse>
{
    /// <summary>
    /// JWT token to blacklist
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// User ID for logging purposes
    /// </summary>
    public Guid? UserId { get; set; }
}