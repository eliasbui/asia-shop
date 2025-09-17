using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Infrastructure.Services;

/// <summary>
/// Email service implementation using Zoho Mail API
/// Provides functionality to send emails through Zoho Mail service
/// </summary>
public class ZohoEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ZohoEmailService> _logger;
    private readonly ZohoEmailConfiguration _configuration;

    public ZohoEmailService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<ZohoEmailService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration.GetSection("Zoho:Email").Get<ZohoEmailConfiguration>()
                         ?? throw new InvalidOperationException("Zoho email configuration is missing");

        ConfigureHttpClient();
    }

    /// <summary>
    /// Sends a simple email asynchronously
    /// </summary>
    public async Task<bool> SendEmailAsync(string to, string subject, string body, bool isHtml = true,
        CancellationToken cancellationToken = default)
    {
        return await SendEmailAsync(to, null, null, subject, body, isHtml, cancellationToken);
    }

    /// <summary>
    /// Sends an email with CC and BCC recipients asynchronously
    /// </summary>
    public async Task<bool> SendEmailAsync(string to, string? cc, string? bcc, string subject, string body,
        bool isHtml = true, CancellationToken cancellationToken = default)
    {
        try
        {
            var emailRequest = new ZohoEmailRequest
            {
                FromAddress = _configuration.FromAddress,
                ToAddress = to,
                CcAddress = cc,
                BccAddress = bcc,
                Subject = subject,
                Content = body,
                MailFormat = isHtml ? "html" : "plaintext",
                AskReceipt = "no"
            };

            var response = await SendEmailRequestAsync(emailRequest, cancellationToken);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To} with subject {Subject}", to, subject);
            return false;
        }
    }

    /// <summary>
    /// Sends an email with attachments asynchronously
    /// Note: This is a basic implementation. Zoho API might require different approach for attachments
    /// </summary>
    public async Task<bool> SendEmailWithAttachmentsAsync(string to, string subject, string body,
        Dictionary<string, byte[]> attachments, bool isHtml = true, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogWarning(
                "Attachment support is not fully implemented for Zoho API. Sending email without attachments.");

            return await SendEmailAsync(to, subject, body, isHtml, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email with attachments to {To}", to);
            return false;
        }
    }

    /// <summary>
    /// Sends a templated email asynchronously
    /// </summary>
    public async Task<bool> SendTemplatedEmailAsync(string to, string templateName,
        Dictionary<string, object> templateData, CancellationToken cancellationToken = default)
    {
        try
        {
            // Load template (this would typically come from a template service or file system)
            var template = await LoadEmailTemplateAsync(templateName, cancellationToken);
            if (string.IsNullOrEmpty(template))
            {
                _logger.LogError("Email template {TemplateName} not found", templateName);
                return false;
            }

            // Replace placeholders in template
            var processedContent = ProcessTemplate(template, templateData);
            var subject = ExtractSubjectFromTemplate(template, templateData);

            return await SendEmailAsync(to, subject, processedContent, true, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send templated email to {To} using template {TemplateName}", to,
                templateName);
            return false;
        }
    }

    /// <summary>
    /// Configures the HTTP client with necessary headers
    /// </summary>
    private void ConfigureHttpClient()
    {
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Zoho-oauthtoken", _configuration.OAuthToken);
    }

    /// <summary>
    /// Sends the email request to Zoho API
    /// </summary>
    private async Task<bool> SendEmailRequestAsync(ZohoEmailRequest emailRequest, CancellationToken cancellationToken)
    {
        try
        {
            var requestUrl = $"https://mail.zoho.com/api/accounts/{_configuration.AccountId}/messages";
            var jsonContent = JsonSerializer.Serialize(emailRequest, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            _logger.LogInformation("Sending email to {To} via Zoho API", emailRequest.ToAddress);

            var response = await _httpClient.PostAsync(requestUrl, content, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogInformation("Email sent successfully to {To}. Response: {Response}",
                    emailRequest.ToAddress, responseContent);
                return true;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Failed to send email to {To}. Status: {StatusCode}, Error: {Error}",
                    emailRequest.ToAddress, response.StatusCode, errorContent);
                return false;
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP request failed while sending email to {To}", emailRequest.ToAddress);
            return false;
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "Request timeout while sending email to {To}", emailRequest.ToAddress);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while sending email to {To}", emailRequest.ToAddress);
            return false;
        }
    }

    /// <summary>
    /// Loads email template from storage
    /// </summary>
    private async Task<string> LoadEmailTemplateAsync(string templateName, CancellationToken cancellationToken)
    {
        // This is a placeholder implementation
        // In a real application, you would load templates from:
        // - File system
        // - Database
        // - External template service
        // - Embedded resources

        var templatePath = Path.Combine(_configuration.TemplatesPath ?? "Templates", $"{templateName}.html");

        if (File.Exists(templatePath)) return await File.ReadAllTextAsync(templatePath, cancellationToken);

        _logger.LogWarning("Template file not found: {TemplatePath}", templatePath);
        return string.Empty;
    }

    /// <summary>
    /// Processes template by replacing placeholders with actual data
    /// </summary>
    private static string ProcessTemplate(string template, Dictionary<string, object> templateData)
    {
        var processedTemplate = template;

        foreach (var kvp in templateData)
        {
            var placeholder = $"{{{{{kvp.Key}}}}}";
            processedTemplate = processedTemplate.Replace(placeholder, kvp.Value?.ToString() ?? string.Empty);
        }

        return processedTemplate;
    }

    /// <summary>
    /// Extracts subject from template or uses provided subject
    /// </summary>
    private static string ExtractSubjectFromTemplate(string template, Dictionary<string, object> templateData)
    {
        // Look for subject in template data first
        if (templateData.TryGetValue("Subject", out var subjectObj) && subjectObj != null)
            return subjectObj.ToString() ?? "No Subject";

        // Try to extract from template (look for <!-- SUBJECT: ... --> comment)
        var subjectMatch = System.Text.RegularExpressions.Regex.Match(
            template, @"<!--\s*SUBJECT:\s*(.+?)\s*-->");

        if (subjectMatch.Success)
        {
            var subject = subjectMatch.Groups[1].Value;
            return ProcessTemplate(subject, templateData);
        }

        return "No Subject";
    }
}

/// <summary>
/// Configuration settings for Zoho email service
/// </summary>
public class ZohoEmailConfiguration
{
    public string OAuthToken { get; set; } = string.Empty;
    public string AccountId { get; set; } = string.Empty;
    public string FromAddress { get; set; } = string.Empty;
    public string? TemplatesPath { get; set; }
    public int TimeoutSeconds { get; set; } = 30;
}

/// <summary>
/// Request model for Zoho email API
/// </summary>
internal class ZohoEmailRequest
{
    public string FromAddress { get; set; } = string.Empty;
    public string ToAddress { get; set; } = string.Empty;
    public string? CcAddress { get; set; }
    public string? BccAddress { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string MailFormat { get; set; } = "html";
    public string AskReceipt { get; set; } = "no";
}