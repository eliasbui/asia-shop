using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Sessions.Commands;

/// <summary>
/// Command for terminating all other user sessions except the current one
/// </summary>
public class TerminateAllOtherSessionsCommand : IRequest<BaseResponse<int>>
{
    /// <summary>
    /// User ID (set from JWT token)
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Current session ID to keep active
    /// </summary>
    public Guid? CurrentSessionId { get; set; }

    /// <summary>
    /// Reason for termination
    /// </summary>
    public string Reason { get; set; } = "User requested";
}
