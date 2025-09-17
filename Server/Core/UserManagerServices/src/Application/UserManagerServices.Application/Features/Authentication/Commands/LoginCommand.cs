using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Authentication.Responses;

namespace UserManagerServices.Application.Features.Authentication.Commands;

/// <summary>
/// Command for user login
/// </summary>
public class LoginCommand : IRequest<BaseResponse<LoginResponse>>
{
    /// <summary>
    /// Email or username for login
    /// </summary>
    public string EmailOrUsername { get; set; } = string.Empty;

    /// <summary>
    /// User password
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Remember me flag for extended session
    /// </summary>
    public bool RememberMe { get; set; }

    /// <summary>
    /// Client IP address for security logging
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent for session tracking
    /// </summary>
    public string? UserAgent { get; set; }
}

