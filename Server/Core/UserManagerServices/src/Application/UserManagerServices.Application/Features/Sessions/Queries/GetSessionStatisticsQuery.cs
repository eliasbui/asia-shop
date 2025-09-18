#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

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