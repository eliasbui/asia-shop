using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Commands;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for updating user notification settings
/// </summary>
public class UpdateNotificationSettingsCommandHandler(
    IUnitOfWork unitOfWork,
    ILogger<UpdateNotificationSettingsCommandHandler> logger) : IRequestHandler<UpdateNotificationSettingsCommand, BaseResponse<NotificationSettingsResponse>>
{
    /// <summary>
    /// Handles the update notification settings command
    /// </summary>
    /// <param name="request">Update notification settings command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated notification settings</returns>
    public async Task<BaseResponse<NotificationSettingsResponse>> Handle(UpdateNotificationSettingsCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Updating notification settings for user: {UserId}", request.UserId);

            // Validate that user exists
            var user = await unitOfWork.Users.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<NotificationSettingsResponse>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Create or update notification settings entity
            var notificationSettings = new UserNotificationSettings
            {
                UserId = request.UserId,
                
                // Email settings
                EmailEnabled = request.Email.Enabled,
                EmailSecurityAlerts = request.Email.SecurityAlerts,
                EmailAccountUpdates = request.Email.AccountUpdates,
                EmailMarketing = request.Email.Marketing,
                EmailNewsletter = request.Email.Newsletter,
                EmailSystemNotifications = request.Email.SystemNotifications,
                
                // SMS settings
                SmsEnabled = request.Sms.Enabled,
                SmsSecurityAlerts = request.Sms.SecurityAlerts,
                SmsAccountUpdates = request.Sms.AccountUpdates,
                SmsTwoFactorAuth = request.Sms.TwoFactorAuth,
                
                // Push settings
                PushEnabled = request.Push.Enabled,
                PushSecurityAlerts = request.Push.SecurityAlerts,
                PushAccountUpdates = request.Push.AccountUpdates,
                PushSystemNotifications = request.Push.SystemNotifications,
                
                // In-app settings
                InAppEnabled = request.InApp.Enabled,
                InAppSecurityAlerts = request.InApp.SecurityAlerts,
                InAppAccountUpdates = request.InApp.AccountUpdates,
                InAppSystemNotifications = request.InApp.SystemNotifications,
                
                // Global settings
                DoNotDisturb = request.Global.DoNotDisturb,
                DoNotDisturbStart = request.Global.DoNotDisturbStart,
                DoNotDisturbEnd = request.Global.DoNotDisturbEnd,
                TimeZone = request.Global.TimeZone,
                Frequency = request.Global.Frequency
            };

            await unitOfWork.Users.AddOrUpdateNotificationSettingsAsync(notificationSettings, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            // Get updated settings for response
            var updatedSettings = await unitOfWork.Users.GetUserNotificationSettingsAsync(request.UserId, cancellationToken);

            var response = new NotificationSettingsResponse
            {
                UserId = request.UserId,
                Email = new EmailNotificationSettings
                {
                    Enabled = updatedSettings!.EmailEnabled,
                    SecurityAlerts = updatedSettings.EmailSecurityAlerts,
                    AccountUpdates = updatedSettings.EmailAccountUpdates,
                    Marketing = updatedSettings.EmailMarketing,
                    Newsletter = updatedSettings.EmailNewsletter,
                    SystemNotifications = updatedSettings.EmailSystemNotifications
                },
                Sms = new SmsNotificationSettings
                {
                    Enabled = updatedSettings.SmsEnabled,
                    SecurityAlerts = updatedSettings.SmsSecurityAlerts,
                    AccountUpdates = updatedSettings.SmsAccountUpdates,
                    TwoFactorAuth = updatedSettings.SmsTwoFactorAuth
                },
                Push = new PushNotificationSettings
                {
                    Enabled = updatedSettings.PushEnabled,
                    SecurityAlerts = updatedSettings.PushSecurityAlerts,
                    AccountUpdates = updatedSettings.PushAccountUpdates,
                    SystemNotifications = updatedSettings.PushSystemNotifications
                },
                InApp = new InAppNotificationSettings
                {
                    Enabled = updatedSettings.InAppEnabled,
                    SecurityAlerts = updatedSettings.InAppSecurityAlerts,
                    AccountUpdates = updatedSettings.InAppAccountUpdates,
                    SystemNotifications = updatedSettings.InAppSystemNotifications
                },
                Global = new GlobalNotificationSettings
                {
                    DoNotDisturb = updatedSettings.DoNotDisturb,
                    DoNotDisturbStart = updatedSettings.DoNotDisturbStart,
                    DoNotDisturbEnd = updatedSettings.DoNotDisturbEnd,
                    TimeZone = updatedSettings.TimeZone ?? "UTC",
                    Frequency = updatedSettings.Frequency ?? "immediate"
                },
                LastUpdated = updatedSettings.UpdatedAt ?? updatedSettings.CreatedAt
            };

            logger.LogInformation("Successfully updated notification settings for user: {UserId}", request.UserId);
            return BaseResponse<NotificationSettingsResponse>.Success(response, "Notification settings updated successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating notification settings for user: {UserId}", request.UserId);
            return BaseResponse<NotificationSettingsResponse>.Failure("An error occurred while updating notification settings. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}
