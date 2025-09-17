namespace UserManagerServices.Application.Features.Users.Responses;

/// <summary>
/// Response model for user preferences
/// </summary>
public class UserPreferencesResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User preferences organized by category
    /// </summary>
    public Dictionary<string, Dictionary<string, PreferenceItem>> Preferences { get; set; } = new();

    /// <summary>
    /// Last preferences update timestamp
    /// </summary>
    public DateTime? LastUpdated { get; set; }
}

/// <summary>
/// Individual preference item
/// </summary>
public class PreferenceItem
{
    /// <summary>
    /// Preference key
    /// </summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>
    /// Preference value
    /// </summary>
    public object Value { get; set; } = null!;

    /// <summary>
    /// Data type of the preference
    /// </summary>
    public string DataType { get; set; } = "string";

    /// <summary>
    /// Whether the preference is active
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// When the preference was created
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// When the preference was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}
