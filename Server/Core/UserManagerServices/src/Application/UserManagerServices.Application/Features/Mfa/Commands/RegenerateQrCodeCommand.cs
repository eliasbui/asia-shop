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

namespace UserManagerServices.Application.Features.Mfa.Commands;

/// <summary>
/// Command to regenerate QR code for MFA setup when expired
/// </summary>
public class RegenerateQrCodeCommand : IRequest<BaseResponse<MfaSetupResponse>>
{
    /// <summary>
    /// User ID requesting QR code regeneration
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Setup session ID from the previous QR code
    /// </summary>
    public string SetupSessionId { get; set; } = string.Empty;
}
