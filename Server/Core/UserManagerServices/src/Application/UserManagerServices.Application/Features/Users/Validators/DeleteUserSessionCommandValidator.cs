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
/// Validator for delete user session command
/// </summary>
public class DeleteUserSessionCommandValidator : AbstractValidator<DeleteUserSessionCommand>
{
    /// <summary>
    /// Initializes validation rules for deleting user session
    /// </summary>
    public DeleteUserSessionCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.SessionId)
            .NotEmpty()
            .WithMessage("Session ID is required");
    }
}