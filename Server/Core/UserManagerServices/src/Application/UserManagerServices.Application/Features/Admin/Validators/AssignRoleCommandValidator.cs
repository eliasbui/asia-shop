using FluentValidation;
using UserManagerServices.Application.Features.Admin.Commands;

namespace UserManagerServices.Application.Features.Admin.Validators;

/// <summary>
/// Validator for assign role command
/// </summary>
public class AssignRoleCommandValidator : AbstractValidator<AssignRoleCommand>
{
    /// <summary>
    /// Initializes validation rules for assigning role
    /// </summary>
    public AssignRoleCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.RoleName)
            .NotEmpty()
            .WithMessage("Role name is required")
            .MaximumLength(256)
            .WithMessage("Role name must not exceed 256 characters")
            .Matches(@"^[a-zA-Z0-9\s\-_\.]+$")
            .WithMessage("Role name can only contain letters, numbers, spaces, hyphens, underscores, and periods");

        RuleFor(x => x.AssignedBy)
            .NotEmpty()
            .WithMessage("Assigned by user ID is required");
    }
}
