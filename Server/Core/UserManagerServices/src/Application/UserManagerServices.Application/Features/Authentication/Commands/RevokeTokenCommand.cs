#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Authentication.Commands;

/// <summary>
/// Command for revoking JWT tokens
/// </summary>
public class RevokeTokenCommand : IRequest<BaseResponse>
{
    /// <summary>
    /// User ID whose tokens should be revoked (optional - if not provided, revokes current user's tokens)
    /// </summary>
    public Guid? TargetUserId { get; set; }

    /// <summary>
    /// Specific token to revoke (optional - if not provided, revokes all user's tokens)
    /// </summary>
    public string? Token { get; set; }

    /// <summary>
    /// Current user ID (set from JWT token)
    /// </summary>
    public Guid CurrentUserId { get; set; }

    /// <summary>
    /// Whether to revoke all tokens for the user
    /// </summary>
    public bool RevokeAllTokens { get; set; } = false;

    /// <summary>
    /// Reason for token revocation (for audit purposes)
    /// </summary>
    public string? Reason { get; set; }

    /// <summary>
    /// Client IP address for security logging
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent for session tracking
    /// </summary>
    public string? UserAgent { get; set; }
}