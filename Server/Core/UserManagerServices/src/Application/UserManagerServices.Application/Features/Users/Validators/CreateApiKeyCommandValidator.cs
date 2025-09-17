using FluentValidation;
using UserManagerServices.Application.Features.Users.Commands;

namespace UserManagerServices.Application.Features.Users.Validators;

/// <summary>
/// Validator for create API key command
/// </summary>
public class CreateApiKeyCommandValidator : AbstractValidator<CreateApiKeyCommand>
{
    /// <summary>
    /// Initializes validation rules for creating API key
    /// </summary>
    public CreateApiKeyCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("API key name is required")
            .MaximumLength(100)
            .WithMessage("API key name must not exceed 100 characters")
            .Matches(@"^[a-zA-Z0-9\s\-_\.]+$")
            .WithMessage("API key name can only contain letters, numbers, spaces, hyphens, underscores, and periods");

        RuleFor(x => x.Scopes)
            .NotNull()
            .WithMessage("Scopes cannot be null");

        RuleForEach(x => x.Scopes)
            .NotEmpty()
            .WithMessage("Scope cannot be empty")
            .MaximumLength(50)
            .WithMessage("Scope must not exceed 50 characters")
            .Matches(@"^[a-zA-Z0-9\-_\.]+$")
            .WithMessage("Scope can only contain letters, numbers, hyphens, underscores, and periods");

        RuleFor(x => x.ExpiresAt)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Expiration date must be in the future")
            .LessThan(DateTime.UtcNow.AddYears(10))
            .WithMessage("Expiration date cannot be more than 10 years in the future")
            .When(x => x.ExpiresAt.HasValue);

        // Validate that scopes list is not too long
        RuleFor(x => x.Scopes)
            .Must(scopes => scopes.Count <= 20)
            .WithMessage("Cannot have more than 20 scopes per API key");
    }
}
