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
/// Command for verifying MFA during login
/// </summary>
public class VerifyMfaCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID to verify MFA for
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// MFA code (TOTP, backup code, or email OTP)
    /// </summary>
    public string MfaCode { get; set; } = string.Empty;

    /// <summary>
    /// Type of MFA code (TOTP, BackupCode, EmailOTP)
    /// </summary>
    public string MfaType { get; set; } = "TOTP";

    /// <summary>
    /// Client IP address for audit logging
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent for audit logging
    /// </summary>
    public string? UserAgent { get; set; }

    /// <summary>
    /// Session ID for tracking
    /// </summary>
    public Guid? SessionId { get; set; }
}