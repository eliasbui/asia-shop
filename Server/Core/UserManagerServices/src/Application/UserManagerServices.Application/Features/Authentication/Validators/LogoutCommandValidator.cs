#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using FluentValidation;
using UserManagerServices.Application.Features.Authentication.Commands;

namespace UserManagerServices.Application.Features.Authentication.Validators;

/// <summary>
/// Validator for logout command
/// </summary>
public class LogoutCommandValidator : AbstractValidator<LogoutCommand>
{
    /// <summary>
    /// Initializes validation rules
    /// </summary>
    public LogoutCommandValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty()
            .WithMessage("Token is required for logout");
    }
}