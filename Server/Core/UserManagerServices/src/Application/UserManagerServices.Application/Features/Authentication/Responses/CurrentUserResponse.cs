#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace UserManagerServices.Application.Features.Authentication.Responses;

/// <summary>
/// Response model for current user profile information
/// </summary>
public class CurrentUserResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Username
    /// </summary>
    public string UserName { get; set; } = string.Empty;

    /// <summary>
    /// Email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// First name
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Last name
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Date of birth
    /// </summary>
    public DateTime? DateOfBirth { get; set; }

    /// <summary>
    /// Gender
    /// </summary>
    public string? Gender { get; set; }

    /// <summary>
    /// Phone number
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// User roles
    /// </summary>
    public List<string> Roles { get; set; } = new();

    /// <summary>
    /// User claims/permissions
    /// </summary>
    public List<UserClaimInfo> Claims { get; set; } = new();

    /// <summary>
    /// Email confirmation status
    /// </summary>
    public bool EmailConfirmed { get; set; }

    /// <summary>
    /// Phone number confirmation status
    /// </summary>
    public bool PhoneNumberConfirmed { get; set; }

    /// <summary>
    /// Two-factor authentication enabled status
    /// </summary>
    public bool TwoFactorEnabled { get; set; }

    /// <summary>
    /// Account lockout status
    /// </summary>
    public bool IsLockedOut { get; set; }

    /// <summary>
    /// Account active status
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Last login timestamp
    /// </summary>
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Last login IP address
    /// </summary>
    public string? LastLoginIp { get; set; }

    /// <summary>
    /// Account creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Profile information
    /// </summary>
    public UserProfileInfo? Profile { get; set; }

    /// <summary>
    /// User preferences
    /// </summary>
    public Dictionary<string, object> Preferences { get; set; } = new();

    /// <summary>
    /// Notification settings
    /// </summary>
    public NotificationSettingInfo? NotificationSettings { get; set; }
}

/// <summary>
/// User claim information
/// </summary>
public class UserClaimInfo
{
    /// <summary>
    /// Claim type
    /// </summary>
    public string Type { get; set; } = string.Empty;

    /// <summary>
    /// Claim value
    /// </summary>
    public string Value { get; set; } = string.Empty;
}

/// <summary>
/// User profile information
/// </summary>
public class UserProfileInfo
{
    /// <summary>
    /// Address
    /// </summary>
    public string? Address { get; set; }

    /// <summary>
    /// Postal code
    /// </summary>
    public string? PostalCode { get; set; }

    /// <summary>
    /// City
    /// </summary>
    public string? City { get; set; }

    /// <summary>
    /// Country
    /// </summary>
    public string? Country { get; set; }

    /// <summary>
    /// Province/State
    /// </summary>
    public string? Province { get; set; }

    /// <summary>
    /// Time zone
    /// </summary>
    public string? TimeZone { get; set; }

    /// <summary>
    /// Language preference
    /// </summary>
    public string? Language { get; set; }
}

/// <summary>
/// Notification setting information based on UserNotificationSettings entity
/// </summary>
public class NotificationSettingInfo
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Email notification settings
    /// </summary>
    public EmailNotificationInfo Email { get; set; } = new();

    /// <summary>
    /// SMS notification settings
    /// </summary>
    public SmsNotificationInfo Sms { get; set; } = new();

    /// <summary>
    /// Push notification settings
    /// </summary>
    public PushNotificationInfo Push { get; set; } = new();

    /// <summary>
    /// In-app notification settings
    /// </summary>
    public InAppNotificationInfo InApp { get; set; } = new();

    /// <summary>
    /// Global notification settings
    /// </summary>
    public GlobalNotificationInfo Global { get; set; } = new();

    /// <summary>
    /// Last notification settings update timestamp
    /// </summary>
    public DateTime? LastUpdated { get; set; }

    /// <summary>
    /// Settings creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Email notification settings information
/// </summary>
public class EmailNotificationInfo
{
    /// <summary>
    /// Enable email notifications
    /// </summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// Security alerts via email
    /// </summary>
    public bool SecurityAlerts { get; set; } = true;

    /// <summary>
    /// Account updates via email
    /// </summary>
    public bool AccountUpdates { get; set; } = true;

    /// <summary>
    /// Marketing emails
    /// </summary>
    public bool Marketing { get; set; } = false;

    /// <summary>
    /// Newsletter subscription
    /// </summary>
    public bool Newsletter { get; set; } = false;

    /// <summary>
    /// System notifications via email
    /// </summary>
    public bool SystemNotifications { get; set; } = true;
}

/// <summary>
/// SMS notification settings information
/// </summary>
public class SmsNotificationInfo
{
    /// <summary>
    /// Enable SMS notifications
    /// </summary>
    public bool Enabled { get; set; } = false;

    /// <summary>
    /// Security alerts via SMS
    /// </summary>
    public bool SecurityAlerts { get; set; } = false;

    /// <summary>
    /// Account updates via SMS
    /// </summary>
    public bool AccountUpdates { get; set; } = false;

    /// <summary>
    /// Two-factor authentication codes
    /// </summary>
    public bool TwoFactorAuth { get; set; } = false;
}

/// <summary>
/// Push notification settings information
/// </summary>
public class PushNotificationInfo
{
    /// <summary>
    /// Enable push notifications
    /// </summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// Security alerts via push
    /// </summary>
    public bool SecurityAlerts { get; set; } = true;

    /// <summary>
    /// Account updates via push
    /// </summary>
    public bool AccountUpdates { get; set; } = true;

    /// <summary>
    /// System notifications via push
    /// </summary>
    public bool SystemNotifications { get; set; } = true;
}

/// <summary>
/// In-app notification settings information
/// </summary>
public class InAppNotificationInfo
{
    /// <summary>
    /// Enable in-app notifications
    /// </summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// Security alerts in-app
    /// </summary>
    public bool SecurityAlerts { get; set; } = true;

    /// <summary>
    /// Account updates in-app
    /// </summary>
    public bool AccountUpdates { get; set; } = true;

    /// <summary>
    /// System notifications in-app
    /// </summary>
    public bool SystemNotifications { get; set; } = true;
}

/// <summary>
/// Global notification settings information
/// </summary>
public class GlobalNotificationInfo
{
    /// <summary>
    /// Do not disturb mode enabled
    /// </summary>
    public bool DoNotDisturb { get; set; } = false;

    /// <summary>
    /// Do not disturb start time
    /// </summary>
    public TimeOnly? DoNotDisturbStart { get; set; }

    /// <summary>
    /// Do not disturb end time
    /// </summary>
    public TimeOnly? DoNotDisturbEnd { get; set; }

    /// <summary>
    /// User's time zone for notifications
    /// </summary>
    public string? TimeZone { get; set; } = "UTC";

    /// <summary>
    /// Notification frequency (immediate, hourly, daily, weekly)
    /// </summary>
    public string? Frequency { get; set; } = "immediate";
}