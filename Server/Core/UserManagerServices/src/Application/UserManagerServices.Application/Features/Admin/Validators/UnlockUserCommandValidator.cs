using FluentValidation;
using UserManagerServices.Application.Features.Admin.Commands;

namespace UserManagerServices.Application.Features.Admin.Validators;

/// <summary>
/// Validator for unlock user command
/// </summary>
public class UnlockUserCommandValidator : AbstractValidator<UnlockUserCommand>
{
    /// <summary>
    /// Initializes validation rules for unlocking user
    /// </summary>
    public UnlockUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.UnlockedBy)
            .NotEmpty()
            .WithMessage("Unlocked by user ID is required");
    }
}
