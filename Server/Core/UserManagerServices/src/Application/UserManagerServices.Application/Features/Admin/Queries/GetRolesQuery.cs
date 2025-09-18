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

namespace UserManagerServices.Application.Features.Admin.Queries;

/// <summary>
/// Query for getting roles with pagination
/// </summary>
public class GetRolesQuery : IRequest<BaseResponse<RolesResponse>>
{
    /// <summary>
    /// Page number for pagination
    /// </summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>
    /// Page size for pagination
    /// </summary>
    public int PageSize { get; set; } = 20;

    /// <summary>
    /// Search term for filtering roles
    /// </summary>
    public string? SearchTerm { get; set; }

    /// <summary>
    /// ID of the user making the request
    /// </summary>
    public Guid RequestingUserId { get; set; }
}