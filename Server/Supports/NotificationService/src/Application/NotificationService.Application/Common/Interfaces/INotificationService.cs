#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/19
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using NotificationService.Domain.Entities;

namespace NotificationService.Application.Common.Interfaces;

public interface IEmailService
{
    Task<bool> SendEmailAsync(string to, string subject, string body, Dictionary<string, string>? attachments = null,
        CancellationToken cancellationToken = default);

    Task<bool> SendBulkEmailAsync(List<string> recipients, string subject, string body,
        CancellationToken cancellationToken = default);
}

public interface ISmsService
{
    Task<bool> SendSmsAsync(string phoneNumber, string message, CancellationToken cancellationToken = default);

    Task<bool> SendBulkSmsAsync(List<string> phoneNumbers, string message,
        CancellationToken cancellationToken = default);
}

public interface IPushNotificationService
{
    Task<bool> SendPushNotificationAsync(string deviceToken, string title, string body,
        Dictionary<string, object>? data = null, CancellationToken cancellationToken = default);

    Task<bool> SendBulkPushNotificationAsync(List<string> deviceTokens, string title, string body,
        Dictionary<string, object>? data = null, CancellationToken cancellationToken = default);
}

public interface ITemplateService
{
    Task<string> RenderTemplateAsync(string templateContent, Dictionary<string, string> variables,
        CancellationToken cancellationToken = default);

    Task<(string subject, string body)> ProcessTemplateAsync(string templateId, Dictionary<string, string> variables,
        CancellationToken cancellationToken = default);
}

public interface IMessageQueueService
{
    Task PublishAsync<T>(string topic, T message, CancellationToken cancellationToken = default) where T : class;

    Task SubscribeAsync<T>(string topic, Func<T, Task> handler, CancellationToken cancellationToken = default)
        where T : class;
}

public interface IWebSocketService
{
    Task SendToUserAsync(string userId, string message, CancellationToken cancellationToken = default);
    Task SendToGroupAsync(string groupName, string message, CancellationToken cancellationToken = default);
    Task SendToAllAsync(string message, CancellationToken cancellationToken = default);
}