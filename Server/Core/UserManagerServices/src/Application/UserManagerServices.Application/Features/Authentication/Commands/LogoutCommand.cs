using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Authentication.Commands;

/// <summary>
/// Command for user logout
/// </summary>
public class LogoutCommand : IRequest<BaseResponse>
{
    /// <summary>
    /// JWT token to blacklist
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// User ID for logging purposes
    /// </summary>
    public Guid? UserId { get; set; }
}