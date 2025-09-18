#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using FluentValidation;
using UserManagerServices.Application.Features.Admin.Commands;

namespace UserManagerServices.Application.Features.Admin.Validators;

/// <summary>
/// Validator for lock user command
/// </summary>
public class LockUserCommandValidator : AbstractValidator<LockUserCommand>
{
    /// <summary>
    /// Initializes validation rules for locking user
    /// </summary>
    public LockUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.LockedBy)
            .NotEmpty()
            .WithMessage("Locked by user ID is required");

        RuleFor(x => x)
            .Must(x => x.UserId != x.LockedBy)
            .WithMessage("Cannot lock your own account");

        RuleFor(x => x.Reason)
            .MaximumLength(500)
            .WithMessage("Reason must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Reason));

        RuleFor(x => x.LockDurationHours)
            .GreaterThan(0)
            .WithMessage("Lock duration must be greater than 0 hours")
            .LessThanOrEqualTo(8760) // 1 year
            .WithMessage("Lock duration cannot exceed 1 year (8760 hours)")
            .When(x => x.LockDurationHours.HasValue);
    }
}