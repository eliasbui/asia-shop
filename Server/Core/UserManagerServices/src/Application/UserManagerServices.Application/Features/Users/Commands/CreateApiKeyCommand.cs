#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.Application.Features.Users.Commands;

/// <summary>
/// Command for creating a new API key
/// </summary>
public class CreateApiKeyCommand : IRequest<BaseResponse<ApiKeyResponse>>
{
    /// <summary>
    /// User ID (set from JWT token)
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Name/description for the API key
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Scopes/permissions for the API key
    /// </summary>
    public List<string> Scopes { get; set; } = new();

    /// <summary>
    /// Expiration date for the API key (optional, defaults to 1 year)
    /// </summary>
    public DateTime? ExpiresAt { get; set; }

    /// <summary>
    /// Whether the API key is active
    /// </summary>
    public bool IsActive { get; set; } = true;
}