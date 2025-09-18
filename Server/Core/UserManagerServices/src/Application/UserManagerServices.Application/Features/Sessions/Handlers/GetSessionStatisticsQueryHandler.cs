#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Sessions.Queries;

namespace UserManagerServices.Application.Features.Sessions.Handlers;

/// <summary>
/// Handler for getting session statistics for a user
/// </summary>
public class
    GetSessionStatisticsQueryHandler : IRequestHandler<GetSessionStatisticsQuery, BaseResponse<SessionStatistics>>
{
    private readonly ISessionManagementService _sessionManagementService;
    private readonly ILogger<GetSessionStatisticsQueryHandler> _logger;

    public GetSessionStatisticsQueryHandler(
        ISessionManagementService sessionManagementService,
        ILogger<GetSessionStatisticsQueryHandler> logger)
    {
        _sessionManagementService = sessionManagementService;
        _logger = logger;
    }

    public async Task<BaseResponse<SessionStatistics>> Handle(GetSessionStatisticsQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Getting session statistics for user {UserId}", request.UserId);

            var statistics =
                await _sessionManagementService.GetSessionStatisticsAsync(request.UserId, cancellationToken);

            _logger.LogInformation(
                "Successfully retrieved session statistics for user {UserId}. Total: {Total}, Active: {Active}",
                request.UserId, statistics.TotalSessions, statistics.ActiveSessions);

            return BaseResponse<SessionStatistics>.Success(statistics, "Session statistics retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting session statistics for user {UserId}", request.UserId);
            return BaseResponse<SessionStatistics>.Failure(
                "An error occurred while retrieving session statistics. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SESSION_STATISTICS_ERROR"
                });
        }
    }
}