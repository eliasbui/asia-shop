#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace UserManagerServices.Application.Features.Users.Responses;

/// <summary>
/// Response model for user API keys
/// </summary>
public class UserApiKeysResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// List of API keys
    /// </summary>
    public List<ApiKeyInfo> ApiKeys { get; set; } = new();

    /// <summary>
    /// Total number of API keys
    /// </summary>
    public int TotalKeys { get; set; }

    /// <summary>
    /// Number of active API keys
    /// </summary>
    public int ActiveKeys { get; set; }
}

/// <summary>
/// API key information (without the actual key value for security)
/// </summary>
public class ApiKeyInfo
{
    /// <summary>
    /// API key ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// API key name/description
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Masked API key (showing only last 4 characters)
    /// </summary>
    public string MaskedKey { get; set; } = string.Empty;

    /// <summary>
    /// API key scopes/permissions
    /// </summary>
    public List<string> Scopes { get; set; } = new();

    /// <summary>
    /// Whether the API key is active
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// When the API key was created
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// When the API key expires
    /// </summary>
    public DateTime? ExpiresAt { get; set; }

    /// <summary>
    /// Last time the API key was used
    /// </summary>
    public DateTime? LastUsedAt { get; set; }

    /// <summary>
    /// Whether the API key is expired
    /// </summary>
    public bool IsExpired => ExpiresAt.HasValue && ExpiresAt.Value <= DateTime.UtcNow;
}