#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Mfa.Responses;

namespace UserManagerServices.Application.Features.Mfa.Queries;

/// <summary>
/// Query to get MFA status for a user
/// </summary>
public class GetMfaStatusQuery : IRequest<BaseResponse<MfaStatusResponse>>
{
    /// <summary>
    /// User ID to get MFA status for
    /// </summary>
    public required Guid UserId { get; set; }
}

/// <summary>
/// Response model for MFA status
/// </summary>
public class MfaStatusResponse
{
    /// <summary>
    /// Whether MFA is enabled for the user
    /// </summary>
    public bool IsEnabled { get; set; }

    /// <summary>
    /// Whether MFA is enforced by policy
    /// </summary>
    public bool IsEnforced { get; set; }

    /// <summary>
    /// Whether TOTP is enabled
    /// </summary>
    public bool IsTotpEnabled { get; set; }

    /// <summary>
    /// Whether email OTP is enabled
    /// </summary>
    public bool IsEmailOtpEnabled { get; set; }

    /// <summary>
    /// Whether backup codes are enabled
    /// </summary>
    public bool IsBackupCodesEnabled { get; set; }

    /// <summary>
    /// Number of backup codes remaining
    /// </summary>
    public int BackupCodesRemaining { get; set; }

    /// <summary>
    /// Available MFA methods
    /// </summary>
    public List<string> AvailableMethods { get; set; } = new();

    /// <summary>
    /// When MFA was enabled
    /// </summary>
    public DateTime? EnabledAt { get; set; }

    /// <summary>
    /// When MFA was last used
    /// </summary>
    public DateTime? LastUsedAt { get; set; }

    /// <summary>
    /// Grace period end date (if enforced)
    /// </summary>
    public DateTime? EnforcementGracePeriodEnd { get; set; }
}