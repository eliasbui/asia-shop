using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.Application.Features.Users.Queries;

/// <summary>
/// Query for getting user sessions
/// </summary>
public class GetUserSessionsQuery : IRequest<BaseResponse<UserSessionsResponse>>
{
    /// <summary>
    /// User ID whose sessions to retrieve
    /// </summary>
    public Guid UserId { get; set; }
}