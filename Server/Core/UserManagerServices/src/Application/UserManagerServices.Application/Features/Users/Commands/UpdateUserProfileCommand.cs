#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Application.Features.Users.Commands;

/// <summary>
/// Command for updating user profile information
/// </summary>
public class UpdateUserProfileCommand : IRequest<BaseResponse<UserProfileResponse>>
{
    /// <summary>
    /// User ID (set from JWT token)
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// First name
    /// </summary>
    public string? FirstName { get; set; }

    /// <summary>
    /// Last name
    /// </summary>
    public string? LastName { get; set; }

    /// <summary>
    /// Date of birth
    /// </summary>
    public DateTime? DateOfBirth { get; set; }

    /// <summary>
    /// Gender
    /// </summary>
    public GenderEnum? Gender { get; set; }

    /// <summary>
    /// Phone number
    /// </summary>
    public string? PhoneNumber { get; set; }

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
    /// Province/State
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
    /// Additional preferences as JSON
    /// </summary>
    public Dictionary<string, object>? Preferences { get; set; }
}