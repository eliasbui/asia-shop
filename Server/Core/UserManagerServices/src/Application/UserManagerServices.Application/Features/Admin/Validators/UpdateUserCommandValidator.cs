using FluentValidation;
using UserManagerServices.Application.Features.Admin.Commands;

namespace UserManagerServices.Application.Features.Admin.Validators;

/// <summary>
/// Validator for update user command
/// </summary>
public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    /// <summary>
    /// Initializes validation rules for updating user
    /// </summary>
    public UpdateUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.UpdatedBy)
            .NotEmpty()
            .WithMessage("Updated by user ID is required");

        RuleFor(x => x.Email)
            .EmailAddress()
            .WithMessage("Invalid email format")
            .MaximumLength(256)
            .WithMessage("Email must not exceed 256 characters")
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x.FirstName)
            .MaximumLength(100)
            .WithMessage("First name must not exceed 100 characters")
            .Matches(@"^[a-zA-Z\s\-'\.]+$")
            .WithMessage("First name can only contain letters, spaces, hyphens, apostrophes, and periods")
            .When(x => !string.IsNullOrEmpty(x.FirstName));

        RuleFor(x => x.LastName)
            .MaximumLength(100)
            .WithMessage("Last name must not exceed 100 characters")
            .Matches(@"^[a-zA-Z\s\-'\.]+$")
            .WithMessage("Last name can only contain letters, spaces, hyphens, apostrophes, and periods")
            .When(x => !string.IsNullOrEmpty(x.LastName));

        RuleFor(x => x.PhoneNumber)
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Invalid phone number format")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber));
    }
}