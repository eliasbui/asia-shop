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
/// Validator for token revocation command
/// </summary>
public class RevokeTokenCommandValidator : AbstractValidator<RevokeTokenCommand>
{
    /// <summary>
    /// Initializes validation rules for token revocation
    /// </summary>
    public RevokeTokenCommandValidator()
    {
        RuleFor(x => x.CurrentUserId)
            .NotEmpty()
            .WithMessage("Current user ID is required");

        RuleFor(x => x.TargetUserId)
            .NotEmpty()
            .WithMessage("Target user ID cannot be empty when specified")
            .When(x => x.TargetUserId.HasValue);

        RuleFor(x => x.Token)
            .NotEmpty()
            .WithMessage("Token is required when not revoking all tokens")
            .When(x => !x.RevokeAllTokens);

        RuleFor(x => x)
            .Must(x => x.RevokeAllTokens || !string.IsNullOrEmpty(x.Token))
            .WithMessage("Either specify a token to revoke or set RevokeAllTokens to true");

        RuleFor(x => x.Reason)
            .MaximumLength(500)
            .WithMessage("Reason must not exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Reason));
    }
}