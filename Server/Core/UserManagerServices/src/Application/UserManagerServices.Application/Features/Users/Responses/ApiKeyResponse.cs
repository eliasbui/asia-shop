namespace UserManagerServices.Application.Features.Users.Responses;

/// <summary>
/// Response model for API key creation (includes the actual key value)
/// </summary>
public class ApiKeyResponse
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
    /// The actual API key value (only returned on creation)
    /// </summary>
    public string Key { get; set; } = string.Empty;

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
    /// Important security notice
    /// </summary>
    public string SecurityNotice { get; set; } = "This is the only time you will see the full API key. Please store it securely.";
}
