#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/19
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using NotificationService.Domain.Common;
using NotificationService.Domain.Enums;

namespace NotificationService.Domain.Entities;

public class NotificationTemplate : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public NotificationType Type { get; set; }
    public string Language { get; set; } = "en";

    public string SubjectTemplate { get; set; } = string.Empty;
    public string BodyTemplate { get; set; } = string.Empty;

    public List<string> RequiredVariables { get; set; } = new();
    public Dictionary<string, string> DefaultValues { get; set; } = new();

    public bool IsActive { get; set; } = true;
    public string? Category { get; set; }
    public string? Description { get; set; }

    public int Version { get; set; } = 1;
}