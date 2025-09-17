using UserManagerServices.Application.Features.Authentication.Responses;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Features.Authentication.Extensions;

/// <summary>
/// Extension methods for mapping UserNotificationSettings entity to DTOs
/// </summary>
public static class NotificationSettingsExtensions
{
    /// <summary>
    /// Maps UserNotificationSettings entity to NotificationSettingInfo DTO
    /// </summary>
    /// <param name="settings">UserNotificationSettings entity</param>
    /// <returns>NotificationSettingInfo DTO</returns>
    public static NotificationSettingInfo ToNotificationSettingInfo(this UserNotificationSettings settings)
    {
        return new NotificationSettingInfo
        {
            UserId = settings.UserId,
            Email = new EmailNotificationInfo
            {
                Enabled = settings.EmailEnabled,
                SecurityAlerts = settings.EmailSecurityAlerts,
                AccountUpdates = settings.EmailAccountUpdates,
                Marketing = settings.EmailMarketing,
                Newsletter = settings.EmailNewsletter,
                SystemNotifications = settings.EmailSystemNotifications
            },
            Sms = new SmsNotificationInfo
            {
                Enabled = settings.SmsEnabled,
                SecurityAlerts = settings.SmsSecurityAlerts,
                AccountUpdates = settings.SmsAccountUpdates,
                TwoFactorAuth = settings.SmsTwoFactorAuth
            },
            Push = new PushNotificationInfo
            {
                Enabled = settings.PushEnabled,
                SecurityAlerts = settings.PushSecurityAlerts,
                AccountUpdates = settings.PushAccountUpdates,
                SystemNotifications = settings.PushSystemNotifications
            },
            InApp = new InAppNotificationInfo
            {
                Enabled = settings.InAppEnabled,
                SecurityAlerts = settings.InAppSecurityAlerts,
                AccountUpdates = settings.InAppAccountUpdates,
                SystemNotifications = settings.InAppSystemNotifications
            },
            Global = new GlobalNotificationInfo
            {
                DoNotDisturb = settings.DoNotDisturb,
                DoNotDisturbStart = settings.DoNotDisturbStart,
                DoNotDisturbEnd = settings.DoNotDisturbEnd,
                TimeZone = settings.TimeZone,
                Frequency = settings.Frequency
            },
            LastUpdated = settings.UpdatedAt,
            CreatedAt = settings.CreatedAt
        };
    }

    /// <summary>
    /// Maps NotificationSettingInfo DTO to UserNotificationSettings entity
    /// </summary>
    /// <param name="info">NotificationSettingInfo DTO</param>
    /// <param name="existingSettings">Existing settings entity (optional)</param>
    /// <returns>UserNotificationSettings entity</returns>
    public static UserNotificationSettings ToUserNotificationSettings(this NotificationSettingInfo info,
        UserNotificationSettings? existingSettings = null)
    {
        var settings = existingSettings ?? new UserNotificationSettings();

        settings.UserId = info.UserId;

        // Email settings
        settings.EmailEnabled = info.Email.Enabled;
        settings.EmailSecurityAlerts = info.Email.SecurityAlerts;
        settings.EmailAccountUpdates = info.Email.AccountUpdates;
        settings.EmailMarketing = info.Email.Marketing;
        settings.EmailNewsletter = info.Email.Newsletter;
        settings.EmailSystemNotifications = info.Email.SystemNotifications;

        // SMS settings
        settings.SmsEnabled = info.Sms.Enabled;
        settings.SmsSecurityAlerts = info.Sms.SecurityAlerts;
        settings.SmsAccountUpdates = info.Sms.AccountUpdates;
        settings.SmsTwoFactorAuth = info.Sms.TwoFactorAuth;

        // Push settings
        settings.PushEnabled = info.Push.Enabled;
        settings.PushSecurityAlerts = info.Push.SecurityAlerts;
        settings.PushAccountUpdates = info.Push.AccountUpdates;
        settings.PushSystemNotifications = info.Push.SystemNotifications;

        // In-app settings
        settings.InAppEnabled = info.InApp.Enabled;
        settings.InAppSecurityAlerts = info.InApp.SecurityAlerts;
        settings.InAppAccountUpdates = info.InApp.AccountUpdates;
        settings.InAppSystemNotifications = info.InApp.SystemNotifications;

        // Global settings
        settings.DoNotDisturb = info.Global.DoNotDisturb;
        settings.DoNotDisturbStart = info.Global.DoNotDisturbStart;
        settings.DoNotDisturbEnd = info.Global.DoNotDisturbEnd;
        settings.TimeZone = info.Global.TimeZone;
        settings.Frequency = info.Global.Frequency;

        return settings;
    }
}