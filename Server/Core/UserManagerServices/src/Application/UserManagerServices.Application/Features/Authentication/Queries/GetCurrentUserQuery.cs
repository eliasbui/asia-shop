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

namespace UserManagerServices.Application.Features.Authentication.Queries;

/// <summary>
/// Query for getting current authenticated user's profile information
/// </summary>
public class GetCurrentUserQuery : IRequest<BaseResponse<CurrentUserResponse>>
{
    /// <summary>
    /// Current user ID (set from JWT token)
    /// </summary>
    public Guid UserId { get; set; }
}