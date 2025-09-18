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
/// Command for updating a user
/// </summary>
public class UpdateUserCommand : IRequest<BaseResponse<UserResponse>>
{
    /// <summary>
    /// User ID to update
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User's email address
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// User's first name
    /// </summary>
    public string? FirstName { get; set; }

    /// <summary>
    /// User's last name
    /// </summary>
    public string? LastName { get; set; }

    /// <summary>
    /// User's phone number
    /// </summary>
    public string? PhoneNumber { get; set; }

    /// <summary>
    /// Whether the user is active
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Whether email is confirmed
    /// </summary>
    public bool? EmailConfirmed { get; set; }

    /// <summary>
    /// Whether phone number is confirmed
    /// </summary>
    public bool? PhoneNumberConfirmed { get; set; }

    /// <summary>
    /// Whether two-factor authentication is enabled
    /// </summary>
    public bool? TwoFactorEnabled { get; set; }

    /// <summary>
    /// ID of the admin updating the user
    /// </summary>
    public Guid UpdatedBy { get; set; }
}