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
/// Validator for create user command
/// </summary>
public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    /// <summary>
    /// Initializes validation rules for creating user
    /// </summary>
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required")
            .EmailAddress()
            .WithMessage("Invalid email format")
            .MaximumLength(256)
            .WithMessage("Email must not exceed 256 characters");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("First name is required")
            .MaximumLength(100)
            .WithMessage("First name must not exceed 100 characters")
            .Matches(@"^[a-zA-Z\s\-'\.]+$")
            .WithMessage("First name can only contain letters, spaces, hyphens, apostrophes, and periods");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Last name is required")
            .MaximumLength(100)
            .WithMessage("Last name must not exceed 100 characters")
            .Matches(@"^[a-zA-Z\s\-'\.]+$")
            .WithMessage("Last name can only contain letters, spaces, hyphens, apostrophes, and periods");

        RuleFor(x => x.PhoneNumber)
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Invalid phone number format")
            .When(x => !string.IsNullOrEmpty(x.PhoneNumber));

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required")
            .MinimumLength(8)
            .WithMessage("Password must be at least 8 characters long")
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]")
            .WithMessage(
                "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty()
            .WithMessage("Password confirmation is required")
            .Equal(x => x.Password)
            .WithMessage("Password and confirmation password do not match");

        RuleFor(x => x.CreatedBy)
            .NotEmpty()
            .WithMessage("Created by user ID is required");

        RuleForEach(x => x.Roles)
            .NotEmpty()
            .WithMessage("Role cannot be empty")
            .MaximumLength(50)
            .WithMessage("Role name must not exceed 50 characters");

        // Validate that roles list is not too long
        RuleFor(x => x.Roles)
            .Must(roles => roles.Count <= 10)
            .WithMessage("Cannot assign more than 10 roles to a user");
    }
}