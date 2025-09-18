#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

namespace UserManagerServices.Application.Features.Users.Responses;

/// <summary>
/// Response model for user profile information
/// </summary>
public class UserProfileResponse
{
    /// <summary>
    /// User ID
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Username
    /// </summary>
    public string UserName { get; set; } = string.Empty;

    /// <summary>
    /// Email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// First name
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Last name
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Date of birth
    /// </summary>
    public DateTime? DateOfBirth { get; set; }

    /// <summary>
    /// Gender
    /// </summary>
    public string? Gender { get; set; }

    /// <summary>
    /// Phone number
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// Email confirmation status
    /// </summary>
    public bool EmailConfirmed { get; set; }

    /// <summary>
    /// Phone number confirmation status
    /// </summary>
    public bool PhoneNumberConfirmed { get; set; }

    /// <summary>
    /// Profile information
    /// </summary>
    public ProfileInfo Profile { get; set; } = new();

    /// <summary>
    /// Last profile update timestamp
    /// </summary>
    public DateTime? LastUpdated { get; set; }
}

/// <summary>
/// Profile information details
/// </summary>
public class ProfileInfo
{
    /// <summary>
    /// Address
    /// </summary>
    public string? Address { get; set; }

    /// <summary>
    /// Postal code
    /// </summary>
    public string? PostalCode { get; set; }

    /// <summary>
    /// City
    /// </summary>
    public string? City { get; set; }

    /// <summary>
    /// Country
    /// </summary>
    public string? Country { get; set; }

    /// <summary>
    /// Province
    /// </summary>
    public string? Province { get; set; }

    /// <summary>
    /// State
    /// </summary>
    public string? State { get; set; }

    /// <summary>
    /// District
    /// </summary>
    public string? District { get; set; }

    /// <summary>
    /// Time zone
    /// </summary>
    public string? TimeZone { get; set; }

    /// <summary>
    /// Language preference
    /// </summary>
    public string? Language { get; set; }

    /// <summary>
    /// Additional preferences
    /// </summary>
    public Dictionary<string, object> Preferences { get; set; } = new();
}