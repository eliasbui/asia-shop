#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/19
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using NotificationService.Domain.Enums;

namespace NotificationService.Application.DTOs;

public class NotificationDto
{
    public string? Id { get; set; }
    public NotificationType Type { get; set; }
    public NotificationStatus Status { get; set; }
    public NotificationPriority Priority { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<RecipientDto> Recipients { get; set; } = new();
    public DateTime? ScheduledAt { get; set; }
    public DateTime? SentAt { get; set; }
    public string? ErrorMessage { get; set; }
}

public class RecipientDto
{
    public string Id { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? DeviceToken { get; set; }
}

public class CreateNotificationDto
{
    public NotificationType Type { get; set; }
    public NotificationPriority Priority { get; set; } = NotificationPriority.Normal;
    public string? TemplateCode { get; set; }
    public string? Subject { get; set; }
    public string? Content { get; set; }
    public List<RecipientDto> Recipients { get; set; } = new();
    public Dictionary<string, string> TemplateVariables { get; set; } = new();
    public DateTime? ScheduledAt { get; set; }
}

public class NotificationTemplateDto
{
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public NotificationType Type { get; set; }
    public string Language { get; set; } = "en";
    public string SubjectTemplate { get; set; } = string.Empty;
    public string BodyTemplate { get; set; } = string.Empty;
    public List<string> RequiredVariables { get; set; } = new();
    public bool IsActive { get; set; } = true;
}