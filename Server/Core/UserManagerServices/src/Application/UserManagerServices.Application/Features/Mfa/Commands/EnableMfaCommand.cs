using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Mfa.Responses;

namespace UserManagerServices.Application.Features.Mfa.Commands;

/// <summary>
/// Command for enabling MFA for a user
/// </summary>
public class EnableMfaCommand : IRequest<BaseResponse<MfaEnableResponse>>
{
    /// <summary>
    /// User ID to enable MFA for
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// TOTP code for verification
    /// </summary>
    public string TotpCode { get; set; } = string.Empty;

    /// <summary>
    /// Client IP address for audit logging
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent for audit logging
    /// </summary>
    public string? UserAgent { get; set; }
}
