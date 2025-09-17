using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.Application.Features.Users.Commands;

/// <summary>
/// Command for updating user preferences
/// </summary>
public class UpdateUserPreferencesCommand : IRequest<BaseResponse<UserPreferencesResponse>>
{
    /// <summary>
    /// User ID (set from JWT token)
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User preferences organized by category and key
    /// </summary>
    public Dictionary<string, Dictionary<string, PreferenceValue>> Preferences { get; set; } = new();
}

/// <summary>
/// Preference value with type information
/// </summary>
public class PreferenceValue
{
    /// <summary>
    /// The preference value
    /// </summary>
    public object Value { get; set; } = null!;

    /// <summary>
    /// Data type of the preference (string, bool, int, double, json)
    /// </summary>
    public string DataType { get; set; } = "string";
}
