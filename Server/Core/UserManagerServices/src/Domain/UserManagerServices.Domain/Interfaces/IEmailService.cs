#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Interface for email service operations
/// Provides abstraction for sending emails through various providers
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Sends an email asynchronously
    /// </summary>
    /// <param name="to">Recipient email address</param>
    /// <param name="subject">Email subject</param>
    /// <param name="body">Email body content</param>
    /// <param name="isHtml">Whether the body is HTML formatted</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the async operation</returns>
    Task<bool> SendEmailAsync(string to, string subject, string body, bool isHtml = true,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends an email with CC and BCC recipients asynchronously
    /// </summary>
    /// <param name="to">Primary recipient email address</param>
    /// <param name="cc">CC recipients (optional)</param>
    /// <param name="bcc">BCC recipients (optional)</param>
    /// <param name="subject">Email subject</param>
    /// <param name="body">Email body content</param>
    /// <param name="isHtml">Whether the body is HTML formatted</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the async operation</returns>
    Task<bool> SendEmailAsync(string to, string? cc, string? bcc, string subject, string body, bool isHtml = true,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends an email with attachments asynchronously
    /// </summary>
    /// <param name="to">Recipient email address</param>
    /// <param name="subject">Email subject</param>
    /// <param name="body">Email body content</param>
    /// <param name="attachments">Dictionary of attachment filename and content</param>
    /// <param name="isHtml">Whether the body is HTML formatted</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the async operation</returns>
    Task<bool> SendEmailWithAttachmentsAsync(string to, string subject, string body,
        Dictionary<string, byte[]> attachments, bool isHtml = true, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends a templated email asynchronously
    /// </summary>
    /// <param name="to">Recipient email address</param>
    /// <param name="templateName">Email template name</param>
    /// <param name="templateData">Template data for placeholders</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the async operation</returns>
    Task<bool> SendTemplatedEmailAsync(string to, string templateName, Dictionary<string, object> templateData,
        CancellationToken cancellationToken = default);
}