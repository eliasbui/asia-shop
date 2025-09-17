using FluentValidation;
using UserManagerServices.Application.Features.Admin.Commands;

namespace UserManagerServices.Application.Features.Admin.Validators;

/// <summary>
/// Validator for delete user command
/// </summary>
public class DeleteUserCommandValidator : AbstractValidator<DeleteUserCommand>
{
    /// <summary>
    /// Initializes validation rules for deleting user
    /// </summary>
    public DeleteUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.DeletedBy)
            .NotEmpty()
            .WithMessage("Deleted by user ID is required");

        RuleFor(x => x)
            .Must(x => x.UserId != x.DeletedBy)
            .WithMessage("Cannot delete your own account");
    }
}