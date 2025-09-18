#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Sessions.Commands;

/// <summary>
/// Command for updating session timeout settings
/// </summary>
public class UpdateSessionTimeoutCommand : IRequest<BaseResponse<bool>>
{
    /// <summary>
    /// User ID (set from JWT token)
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Session timeout in minutes
    /// </summary>
    public int SessionTimeoutMinutes { get; set; }

    /// <summary>
    /// Maximum concurrent sessions allowed
    /// </summary>
    public int MaxConcurrentSessions { get; set; }

    /// <summary>
    /// Whether to enable automatic session extension
    /// </summary>
    public bool EnableAutoExtension { get; set; } = true;
}