using UserManagerServices.Application.Features.Users.Commands;

namespace UserManagerServices.Application.Features.Users.Responses;

/// <summary>
/// Response model for user notification settings
/// </summary>
public class NotificationSettingsResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Email notification settings
    /// </summary>
    public EmailNotificationSettings Email { get; set; } = new();

    /// <summary>
    /// SMS notification settings
    /// </summary>
    public SmsNotificationSettings Sms { get; set; } = new();

    /// <summary>
    /// Push notification settings
    /// </summary>
    public PushNotificationSettings Push { get; set; } = new();

    /// <summary>
    /// In-app notification settings
    /// </summary>
    public InAppNotificationSettings InApp { get; set; } = new();

    /// <summary>
    /// Global notification settings
    /// </summary>
    public GlobalNotificationSettings Global { get; set; } = new();

    /// <summary>
    /// Last notification settings update timestamp
    /// </summary>
    public DateTime? LastUpdated { get; set; }
}
