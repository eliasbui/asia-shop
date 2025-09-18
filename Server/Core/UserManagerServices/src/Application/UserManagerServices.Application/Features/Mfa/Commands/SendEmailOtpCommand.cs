#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Mfa.Commands;

/// <summary>
/// Command to send email OTP for MFA verification
/// </summary>
public class SendEmailOtpCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID to send OTP to
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// Purpose of the OTP (default: MFA)
    /// </summary>
    public string Purpose { get; set; } = "MFA";

    /// <summary>
    /// IP address of the request (for audit)
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent of the request (for audit)
    /// </summary>
    public string? UserAgent { get; set; }
}