using MediatR;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.Application.Features.Users.Queries;

/// <summary>
/// Query for getting user preferences
/// </summary>
public class GetUserPreferencesQuery : IRequest<BaseResponse<UserPreferencesResponse>>
{
    /// <summary>
    /// User ID whose preferences to retrieve
    /// </summary>
    public Guid UserId { get; set; }
}