#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Infrastructure.Services;

/// <summary>
/// Example class demonstrating how to use the IEmailService
/// This is for documentation purposes and should be removed in production
/// </summary>
public class EmailServiceUsageExample
{
    private readonly IEmailService _emailService;

    public EmailServiceUsageExample(IEmailService emailService)
    {
        _emailService = emailService;
    }

    /// <summary>
    /// Example: Send a simple email
    /// </summary>
    public async Task<bool> SendSimpleEmailExample()
    {
        var result = await _emailService.SendEmailAsync(
            "user@example.com",
            "Welcome to Our Service",
            "<h1>Welcome!</h1><p>Thank you for joining us.</p>",
            true
        );

        return result;
    }

    /// <summary>
    /// Example: Send email with CC and BCC
    /// </summary>
    public async Task<bool> SendEmailWithCopyRecipientsExample()
    {
        var result = await _emailService.SendEmailAsync(
            "user@example.com",
            "manager@example.com",
            "admin@example.com",
            "Project Update",
            "<p>Here's the latest project update...</p>",
            true
        );

        return result;
    }

    /// <summary>
    /// Example: Send templated welcome email
    /// </summary>
    public async Task<bool> SendWelcomeEmailExample(string userEmail, string firstName, string lastName)
    {
        var templateData = new Dictionary<string, object>
        {
            { "FirstName", firstName },
            { "LastName", lastName },
            { "Email", userEmail },
            { "CompanyName", "Asia Shop" },
            { "LoginUrl", "https://yourdomain.com/login" },
            { "SupportEmail", "support@yourdomain.com" }
        };

        var result = await _emailService.SendTemplatedEmailAsync(
            userEmail,
            "welcome",
            templateData
        );

        return result;
    }

    /// <summary>
    /// Example: Send password reset email
    /// </summary>
    public async Task<bool> SendPasswordResetEmailExample(string userEmail, string firstName, string resetToken)
    {
        var resetUrl = $"https://yourdomain.com/reset-password?token={resetToken}";

        var templateData = new Dictionary<string, object>
        {
            { "FirstName", firstName },
            { "Email", userEmail },
            { "CompanyName", "Asia Shop" },
            { "ResetUrl", resetUrl },
            { "ExpiryHours", "24" },
            { "SupportEmail", "support@yourdomain.com" }
        };

        var result = await _emailService.SendTemplatedEmailAsync(
            userEmail,
            "password-reset",
            templateData
        );

        return result;
    }

    /// <summary>
    /// Example: Send email with attachments (basic implementation)
    /// </summary>
    public async Task<bool> SendEmailWithAttachmentsExample()
    {
        var attachments = new Dictionary<string, byte[]>
        {
            { "document.pdf", await File.ReadAllBytesAsync("path/to/document.pdf") },
            { "image.jpg", await File.ReadAllBytesAsync("path/to/image.jpg") }
        };

        var result = await _emailService.SendEmailWithAttachmentsAsync(
            "user@example.com",
            "Documents Attached",
            "<p>Please find the attached documents.</p>",
            attachments,
            true
        );

        return result;
    }
}