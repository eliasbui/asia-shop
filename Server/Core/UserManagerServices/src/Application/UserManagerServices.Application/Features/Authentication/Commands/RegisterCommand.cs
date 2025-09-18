#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Authentication.Responses;

namespace UserManagerServices.Application.Features.Authentication.Commands;

/// <summary>
/// Command for user registration
/// </summary>
public class RegisterCommand : IRequest<BaseResponse<LoginResponse>>
{
    /// <summary>
    /// User's email address (required)
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Username (optional, will use email if not provided)
    /// </summary>
    public string? UserName { get; set; }

    /// <summary>
    /// User's password
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Confirm password
    /// </summary>
    public string ConfirmPassword { get; set; } = string.Empty;

    /// <summary>
    /// User's first name
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// User's last name
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// User's date of birth (optional)
    /// </summary>
    public DateTime? DateOfBirth { get; set; }

    /// <summary>
    /// Requested role (optional, defaults to "User")
    /// </summary>
    public string? RequestedRole { get; set; }

    /// <summary>
    /// Client IP address for security logging
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent for session tracking
    /// </summary>
    public string? UserAgent { get; set; }

    /// <summary>
    /// Whether to automatically confirm email (for admin registration)
    /// </summary>
    public bool AutoConfirmEmail { get; set; } = false;
}