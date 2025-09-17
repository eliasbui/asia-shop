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
