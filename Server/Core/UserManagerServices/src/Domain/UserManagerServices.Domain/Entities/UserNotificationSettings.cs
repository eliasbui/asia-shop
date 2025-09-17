using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

/// <summary>
/// User notification settings entity with detailed notification preferences
/// This is a comprehensive notification settings entity with individual properties for each setting type
/// </summary>
[Table("UserNotificationSettingsDetailed")]
public class UserNotificationSettings : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;

    // Email notification settings
    public bool EmailEnabled { get; set; } = true;
    public bool EmailSecurityAlerts { get; set; } = true;
    public bool EmailAccountUpdates { get; set; } = true;
    public bool EmailMarketing { get; set; } = false;
    public bool EmailNewsletter { get; set; } = false;
    public bool EmailSystemNotifications { get; set; } = true;

    // SMS notification settings
    public bool SmsEnabled { get; set; } = false;
    public bool SmsSecurityAlerts { get; set; } = false;
    public bool SmsAccountUpdates { get; set; } = false;
    public bool SmsTwoFactorAuth { get; set; } = false;

    // Push notification settings
    public bool PushEnabled { get; set; } = true;
    public bool PushSecurityAlerts { get; set; } = true;
    public bool PushAccountUpdates { get; set; } = true;
    public bool PushSystemNotifications { get; set; } = true;

    // In-app notification settings
    public bool InAppEnabled { get; set; } = true;
    public bool InAppSecurityAlerts { get; set; } = true;
    public bool InAppAccountUpdates { get; set; } = true;
    public bool InAppSystemNotifications { get; set; } = true;

    // Global notification settings
    public bool DoNotDisturb { get; set; } = false;
    public TimeOnly? DoNotDisturbStart { get; set; }
    public TimeOnly? DoNotDisturbEnd { get; set; }
    public string? TimeZone { get; set; } = "UTC";
    public string? Frequency { get; set; } = "immediate"; // immediate, hourly, daily, weekly

    // Base entity properties
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; } = null;
    public Guid? CreatedBy { get; } = null;
    public Guid? UpdatedBy { get; } = null;
    public bool IsDeleted { get; } = false;
}