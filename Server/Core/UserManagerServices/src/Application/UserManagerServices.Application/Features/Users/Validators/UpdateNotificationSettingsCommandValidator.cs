#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using FluentValidation;
using UserManagerServices.Application.Features.Users.Commands;

namespace UserManagerServices.Application.Features.Users.Validators;

/// <summary>
/// Validator for update notification settings command
/// </summary>
public class UpdateNotificationSettingsCommandValidator : AbstractValidator<UpdateNotificationSettingsCommand>
{
    /// <summary>
    /// Initializes validation rules for updating notification settings
    /// </summary>
    public UpdateNotificationSettingsCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.Email)
            .NotNull()
            .WithMessage("Email settings cannot be null");

        RuleFor(x => x.Sms)
            .NotNull()
            .WithMessage("SMS settings cannot be null");

        RuleFor(x => x.Push)
            .NotNull()
            .WithMessage("Push settings cannot be null");

        RuleFor(x => x.InApp)
            .NotNull()
            .WithMessage("In-app settings cannot be null");

        RuleFor(x => x.Global)
            .NotNull()
            .WithMessage("Global settings cannot be null");

        RuleFor(x => x.Global.TimeZone)
            .NotEmpty()
            .WithMessage("Time zone is required")
            .MaximumLength(50)
            .WithMessage("Time zone must not exceed 50 characters");

        RuleFor(x => x.Global.Frequency)
            .NotEmpty()
            .WithMessage("Notification frequency is required")
            .Must(frequency => new[] { "immediate", "hourly", "daily", "weekly" }.Contains(frequency.ToLower()))
            .WithMessage("Notification frequency must be one of: immediate, hourly, daily, weekly");
    }


    /// <summary>
    /// Validates that do not disturb start and end times are different
    /// </summary>
    /// <param name="startTime">Start time</param>
    /// <param name="endTime">End time</param>
    /// <returns>True if times are different or null, false otherwise</returns>
    private static bool ValidateDoNotDisturbTimes(string? startTime, string? endTime)
    {
        if (string.IsNullOrEmpty(startTime) || string.IsNullOrEmpty(endTime))
            return true;

        return startTime != endTime;
    }
}