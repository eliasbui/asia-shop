using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Mfa.Commands;

/// <summary>
/// Command for disabling MFA for a user
/// </summary>
public class DisableMfaCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID to disable MFA for
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Current password for verification
    /// </summary>
    public string CurrentPassword { get; set; } = string.Empty;

    /// <summary>
    /// MFA code for verification (TOTP or backup code)
    /// </summary>
    public string MfaCode { get; set; } = string.Empty;

    /// <summary>
    /// Reason for disabling MFA
    /// </summary>
    public string? Reason { get; set; }

    /// <summary>
    /// ID of user/admin disabling MFA
    /// </summary>
    public Guid DisabledBy { get; set; }

    /// <summary>
    /// Client IP address for audit logging
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent for audit logging
    /// </summary>
    public string? UserAgent { get; set; }
}