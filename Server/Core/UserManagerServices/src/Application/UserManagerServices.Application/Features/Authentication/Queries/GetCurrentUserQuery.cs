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