#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using FluentValidation;
using UserManagerServices.Application.Features.Admin.Queries;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Application.Features.Admin.Validators;

/// <summary>
/// Validator for get user activity query
/// </summary>
public class GetUserActivityQueryValidator : AbstractValidator<GetUserActivityQuery>
{
    /// <summary>
    /// Initializes validation rules for getting user activity
    /// </summary>
    public GetUserActivityQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.RequestingUserId)
            .NotEmpty()
            .WithMessage("Requesting user ID is required");

        RuleFor(x => x.PageNumber)
            .GreaterThan(0)
            .WithMessage("Page number must be greater than 0");

        RuleFor(x => x.PageSize)
            .GreaterThan(0)
            .WithMessage("Page size must be greater than 0")
            .LessThanOrEqualTo(100)
            .WithMessage("Page size cannot exceed 100");

        RuleFor(x => x.Action)
            .Must(BeValidActionEnum)
            .WithMessage("Invalid action type")
            .When(x => !string.IsNullOrEmpty(x.Action));

        RuleFor(x => x.StartDate)
            .LessThan(x => x.EndDate)
            .WithMessage("Start date must be before end date")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);

        RuleFor(x => x.EndDate)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("End date cannot be in the future")
            .When(x => x.EndDate.HasValue);

        // Validate date range is not too large (max 1 year)
        RuleFor(x => x)
            .Must(x => !x.StartDate.HasValue || !x.EndDate.HasValue ||
                       (x.EndDate.Value - x.StartDate.Value).TotalDays <= 365)
            .WithMessage("Date range cannot exceed 365 days")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);
    }

    /// <summary>
    /// Validates that the action string is a valid ActionEnum value
    /// </summary>
    /// <param name="action">Action string to validate</param>
    /// <returns>True if valid, false otherwise</returns>
    private static bool BeValidActionEnum(string? action)
    {
        if (string.IsNullOrEmpty(action))
            return true;

        return Enum.TryParse<ActionEnum>(action, true, out _);
    }
}