#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/19
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using NotificationService.Domain.Common;
using NotificationService.Domain.Enums;
using NotificationService.Domain.ValueObjects;

namespace NotificationService.Domain.Entities;

public class Notification : BaseEntity
{
    public NotificationType Type { get; set; }
    public NotificationStatus Status { get; set; }
    public NotificationPriority Priority { get; set; }

    public string? TemplateId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;

    public List<Recipient> Recipients { get; set; } = new();
    public Dictionary<string, object> Metadata { get; set; } = new();
    public Dictionary<string, string> TemplateVariables { get; set; } = new();

    public DateTime? ScheduledAt { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? DeliveredAt { get; set; }

    public int RetryCount { get; set; }
    public int MaxRetries { get; set; } = 3;
    public string? ErrorMessage { get; set; }

    public string? Channel { get; set; }
    public string? CorrelationId { get; set; }
    public string? TenantId { get; set; }
}