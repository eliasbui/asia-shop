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
/// Command for setting up MFA for a user
/// </summary>
public class SetupMfaCommand : IRequest<BaseResponse<MfaSetupResponse>>
{
    /// <summary>
    /// User ID to setup MFA for
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Client IP address for audit logging
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent for audit logging
    /// </summary>
    public string? UserAgent { get; set; }
}