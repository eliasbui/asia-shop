#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/19
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace NotificationService.Domain.ValueObjects;

public class Recipient
{
    public string Id { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? DeviceToken { get; set; } // For push notifications
    public Dictionary<string, string> CustomData { get; set; } = new();
    public bool IsDelivered { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public string? FailureReason { get; set; }
}