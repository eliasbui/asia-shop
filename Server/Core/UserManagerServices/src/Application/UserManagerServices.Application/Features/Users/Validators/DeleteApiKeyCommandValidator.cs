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