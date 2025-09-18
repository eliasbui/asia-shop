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
/// Command for updating user notification settings
/// </summary>
public class UpdateNotificationSettingsCommand : IRequest<BaseResponse<NotificationSettingsResponse>>
{
    /// <summary>
    /// User ID (set from JWT token)
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
}

/// <summary>
/// Email notification settings
/// </summary>
public class EmailNotificationSettings
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
/// SMS notification settings
/// </summary>
public class SmsNotificationSettings
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
/// Push notification settings
/// </summary>
public class PushNotificationSettings
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
/// In-app notification settings
/// </summary>
public class InAppNotificationSettings
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
/// Global notification settings
/// </summary>
public class GlobalNotificationSettings
{
    /// <summary>
    /// Do not disturb mode
    /// </summary>
    public bool DoNotDisturb { get; set; } = false;

    /// <summary>
    /// Do not disturb start time (24-hour format, e.g., "22:00")
    /// </summary>
    public TimeOnly? DoNotDisturbStart { get; set; }

    /// <summary>
    /// Do not disturb end time (24-hour format, e.g., "08:00")
    /// </summary>
    public TimeOnly? DoNotDisturbEnd { get; set; }

    /// <summary>
    /// Time zone for notification scheduling
    /// </summary>
    public string TimeZone { get; set; } = "UTC";

    /// <summary>
    /// Notification frequency (immediate, hourly, daily, weekly)
    /// </summary>
    public string Frequency { get; set; } = "immediate";
}