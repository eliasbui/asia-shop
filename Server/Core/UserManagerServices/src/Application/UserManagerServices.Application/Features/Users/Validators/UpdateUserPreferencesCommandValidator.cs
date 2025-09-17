using FluentValidation;
using UserManagerServices.Application.Features.Users.Commands;

namespace UserManagerServices.Application.Features.Users.Validators;

/// <summary>
/// Validator for update user preferences command
/// </summary>
public class UpdateUserPreferencesCommandValidator : AbstractValidator<UpdateUserPreferencesCommand>
{
    /// <summary>
    /// Initializes validation rules for updating user preferences
    /// </summary>
    public UpdateUserPreferencesCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.Preferences)
            .NotNull()
            .WithMessage("Preferences cannot be null");

        RuleForEach(x => x.Preferences)
            .ChildRules(category =>
            {
                category.RuleFor(x => x.Key)
                    .NotEmpty()
                    .WithMessage("Category name cannot be empty")
                    .MaximumLength(100)
                    .WithMessage("Category name must not exceed 100 characters")
                    .Matches(@"^[a-zA-Z0-9_\-\.]+$")
                    .WithMessage("Category name can only contain letters, numbers, underscores, hyphens, and periods");

                category.RuleForEach(x => x.Value)
                    .ChildRules(preference =>
                    {
                        preference.RuleFor(x => x.Key)
                            .NotEmpty()
                            .WithMessage("Preference key cannot be empty")
                            .MaximumLength(100)
                            .WithMessage("Preference key must not exceed 100 characters")
                            .Matches(@"^[a-zA-Z0-9_\-\.]+$")
                            .WithMessage("Preference key can only contain letters, numbers, underscores, hyphens, and periods");

                        preference.RuleFor(x => x.Value.DataType)
                            .NotEmpty()
                            .WithMessage("Data type is required")
                            .Must(dataType => new[] { "string", "bool", "int", "double", "json" }.Contains(dataType.ToLower()))
                            .WithMessage("Data type must be one of: string, bool, int, double, json");

                        preference.RuleFor(x => x.Value.Value)
                            .NotNull()
                            .WithMessage("Preference value cannot be null");

                        // Validate value based on data type
                        preference.RuleFor(x => x.Value)
                            .Must(BeValidForDataType)
                            .WithMessage("Preference value is not valid for the specified data type");
                    });
            });
    }

    /// <summary>
    /// Validates that the preference value is valid for its data type
    /// </summary>
    /// <param name="preferenceValue">Preference value to validate</param>
    /// <returns>True if valid, false otherwise</returns>
    private static bool BeValidForDataType(PreferenceValue preferenceValue)
    {
        if (preferenceValue.Value == null)
            return false;

        try
        {
            return preferenceValue.DataType.ToLower() switch
            {
                "bool" => bool.TryParse(preferenceValue.Value.ToString(), out _),
                "int" => int.TryParse(preferenceValue.Value.ToString(), out _),
                "double" => double.TryParse(preferenceValue.Value.ToString(), out _),
                "json" => IsValidJson(preferenceValue.Value.ToString()),
                "string" => true, // Any value can be a string
                _ => false
            };
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Validates if a string is valid JSON
    /// </summary>
    /// <param name="jsonString">JSON string to validate</param>
    /// <returns>True if valid JSON, false otherwise</returns>
    private static bool IsValidJson(string? jsonString)
    {
        if (string.IsNullOrEmpty(jsonString))
            return false;

        try
        {
            System.Text.Json.JsonDocument.Parse(jsonString);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
