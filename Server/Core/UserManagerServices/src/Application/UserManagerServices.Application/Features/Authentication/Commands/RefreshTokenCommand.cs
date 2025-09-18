#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Authentication.Responses;

namespace UserManagerServices.Application.Features.Authentication.Commands;

/// <summary>
/// Command for refreshing JWT tokens
/// </summary>
public class RefreshTokenCommand : IRequest<BaseResponse<LoginResponse>>
{
    /// <summary>
    /// Refresh token to use for generating new access token
    /// </summary>
    public string RefreshToken { get; set; } = string.Empty;

    /// <summary>
    /// Client IP address for security logging
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent for session tracking
    /// </summary>
    public string? UserAgent { get; set; }
}