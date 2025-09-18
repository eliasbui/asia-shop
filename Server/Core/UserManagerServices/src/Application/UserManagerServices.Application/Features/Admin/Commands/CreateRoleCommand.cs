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
/// Command for creating a new role
/// </summary>
public class CreateRoleCommand : IRequest<BaseResponse<RoleResponse>>
{
    /// <summary>
    /// Role name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Role description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Whether the role is active
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// ID of the admin creating the role
    /// </summary>
    public Guid CreatedBy { get; set; }
}