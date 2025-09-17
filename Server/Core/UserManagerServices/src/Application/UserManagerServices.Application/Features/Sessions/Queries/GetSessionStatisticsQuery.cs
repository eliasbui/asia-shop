using MediatR;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Features.Sessions.Queries;

/// <summary>
/// Query for getting session statistics for a user
/// </summary>
public class GetSessionStatisticsQuery : IRequest<BaseResponse<SessionStatistics>>
{
    /// <summary>
    /// User ID whose session statistics to retrieve
    /// </summary>
    public Guid UserId { get; set; }
}
