using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Commands;
using UserManagerServices.Application.Features.Users.Queries;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for getting user notification settings
/// </summary>
public class GetNotificationSettingsQueryHandler(
    IUnitOfWork unitOfWork,
    ILogger<GetNotificationSettingsQueryHandler> logger)
    : IRequestHandler<GetNotificationSettingsQuery, BaseResponse<NotificationSettingsResponse>>
{
    /// <summary>
    /// Handles the get notification settings query
    /// </summary>
    /// <param name="request">Get notification settings query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User notification settings</returns>
    public async Task<BaseResponse<NotificationSettingsResponse>> Handle(GetNotificationSettingsQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Getting notification settings for user: {UserId}", request.UserId);

            // Get user notification settings
            var settings = await unitOfWork.Users.GetUserNotificationSettingsAsync(request.UserId, cancellationToken);

            // If no settings exist, return default settings
            if (settings == null)
            {
                var defaultResponse = new NotificationSettingsResponse
                {
                    UserId = request.UserId,
                    Email = new EmailNotificationSettings
                    {
                        Enabled = true,
                        SecurityAlerts = true,
                        AccountUpdates = true,
                        Marketing = false,
                        Newsletter = false,
                        SystemNotifications = true
                    },
                    Sms = new SmsNotificationSettings
                    {
                        Enabled = false,
                        SecurityAlerts = false,
                        AccountUpdates = false,
                        TwoFactorAuth = false
                    },
                    Push = new PushNotificationSettings
                    {
                        Enabled = true,
                        SecurityAlerts = true,
                        AccountUpdates = true,
                        SystemNotifications = true
                    },
                    InApp = new InAppNotificationSettings
                    {
                        Enabled = true,
                        SecurityAlerts = true,
                        AccountUpdates = true,
                        SystemNotifications = true
                    },
                    Global = new GlobalNotificationSettings
                    {
                        DoNotDisturb = false,
                        TimeZone = "UTC",
                        Frequency = "immediate"
                    },
                    LastUpdated = null
                };

                logger.LogInformation("No notification settings found for user {UserId}, returning defaults",
                    request.UserId);
                return BaseResponse<NotificationSettingsResponse>.Success(defaultResponse);
            }

            // Map entity to response
            var response = new NotificationSettingsResponse
            {
                UserId = request.UserId,
                Email = new EmailNotificationSettings
                {
                    Enabled = settings.EmailEnabled,
                    SecurityAlerts = settings.EmailSecurityAlerts,
                    AccountUpdates = settings.EmailAccountUpdates,
                    Marketing = settings.EmailMarketing,
                    Newsletter = settings.EmailNewsletter,
                    SystemNotifications = settings.EmailSystemNotifications
                },
                Sms = new SmsNotificationSettings
                {
                    Enabled = settings.SmsEnabled,
                    SecurityAlerts = settings.SmsSecurityAlerts,
                    AccountUpdates = settings.SmsAccountUpdates,
                    TwoFactorAuth = settings.SmsTwoFactorAuth
                },
                Push = new PushNotificationSettings
                {
                    Enabled = settings.PushEnabled,
                    SecurityAlerts = settings.PushSecurityAlerts,
                    AccountUpdates = settings.PushAccountUpdates,
                    SystemNotifications = settings.PushSystemNotifications
                },
                InApp = new InAppNotificationSettings
                {
                    Enabled = settings.InAppEnabled,
                    SecurityAlerts = settings.InAppSecurityAlerts,
                    AccountUpdates = settings.InAppAccountUpdates,
                    SystemNotifications = settings.InAppSystemNotifications
                },
                Global = new GlobalNotificationSettings
                {
                    DoNotDisturb = settings.DoNotDisturb,
                    DoNotDisturbStart = settings.DoNotDisturbStart,
                    DoNotDisturbEnd = settings.DoNotDisturbEnd,
                    TimeZone = settings.TimeZone ?? "UTC",
                    Frequency = settings.Frequency ?? "immediate"
                },
                LastUpdated = settings.UpdatedAt ?? settings.CreatedAt
            };

            logger.LogInformation("Successfully retrieved notification settings for user: {UserId}", request.UserId);
            return BaseResponse<NotificationSettingsResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting notification settings for user: {UserId}", request.UserId);
            return BaseResponse<NotificationSettingsResponse>.Failure(
                "An error occurred while retrieving notification settings. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}