using FluentValidation;
using UserManagerServices.Application.Features.Admin.Commands;

namespace UserManagerServices.Application.Features.Admin.Validators;

/// <summary>
/// Validator for remove role command
/// </summary>
public class RemoveRoleCommandValidator : AbstractValidator<RemoveRoleCommand>
{
    /// <summary>
    /// Initializes validation rules for removing role
    /// </summary>
    public RemoveRoleCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.RoleName)
            .NotEmpty()
            .WithMessage("Role name is required")
            .MaximumLength(256)
            .WithMessage("Role name must not exceed 256 characters");

        RuleFor(x => x.RemovedBy)
            .NotEmpty()
            .WithMessage("Removed by user ID is required");
    }
}
