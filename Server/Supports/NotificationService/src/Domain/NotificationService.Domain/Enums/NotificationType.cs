#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/19
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace NotificationService.Domain.Enums;

public enum NotificationType
{
    Email,
    Sms,
    PushNotification,
    InApp
}

public enum NotificationStatus
{
    Pending,
    Sent,
    Failed,
    Cancelled,
    Scheduled,
    Delivered
}

public enum NotificationPriority
{
    Low,
    Normal,
    High,
    Critical
}