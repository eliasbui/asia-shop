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
/// Command for initiating password reset process
/// </summary>
public class ForgotPasswordCommand : IRequest<BaseResponse>
{
    /// <summary>
    /// Email address to send password reset link
    /// </summary>
    public string Email { get; set; } = string.Empty;
}