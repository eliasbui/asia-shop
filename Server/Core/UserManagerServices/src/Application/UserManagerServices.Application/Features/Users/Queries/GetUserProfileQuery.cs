using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.Application.Features.Users.Queries;

/// <summary>
/// Query for getting user profile information
/// </summary>
public class GetUserProfileQuery : IRequest<BaseResponse<UserProfileResponse>>
{
    /// <summary>
    /// User ID whose profile to retrieve
    /// </summary>
    public Guid UserId { get; set; }
}