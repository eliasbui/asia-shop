#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Admin.Responses;

namespace UserManagerServices.Application.Features.Admin.Commands;

/// <summary>
/// Command for creating a new user
/// </summary>
public class CreateUserCommand : IRequest<BaseResponse<UserResponse>>
{
    /// <summary>
    /// User's email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User's first name
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// User's last name
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// User's phone number
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// User's password
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Confirm password
    /// </summary>
    public string ConfirmPassword { get; set; } = string.Empty;

    /// <summary>
    /// Roles to assign to the user
    /// </summary>
    public List<string> Roles { get; set; } = new();

    /// <summary>
    /// Whether the user should be active immediately
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Whether email confirmation is required
    /// </summary>
    public bool RequireEmailConfirmation { get; set; } = false;

    /// <summary>
    /// ID of the admin creating the user
    /// </summary>
    public Guid CreatedBy { get; set; }
}