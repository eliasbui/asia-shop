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
/// Validator for delete API key command
/// </summary>
public class DeleteApiKeyCommandValidator : AbstractValidator<DeleteApiKeyCommand>
{
    /// <summary>
    /// Initializes validation rules for deleting API key
    /// </summary>
    public DeleteApiKeyCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.KeyId)
            .NotEmpty()
            .WithMessage("API key ID is required");
    }
}