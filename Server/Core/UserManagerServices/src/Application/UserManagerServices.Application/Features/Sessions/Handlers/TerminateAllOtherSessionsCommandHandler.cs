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
using UserManagerServices.Application.Features.Sessions.Commands;

namespace UserManagerServices.Application.Features.Sessions.Handlers;

/// <summary>
/// Handler for terminating all other user sessions except the current one
/// </summary>
public class
    TerminateAllOtherSessionsCommandHandler : IRequestHandler<TerminateAllOtherSessionsCommand, BaseResponse<int>>
{
    private readonly ISessionManagementService _sessionManagementService;
    private readonly ILogger<TerminateAllOtherSessionsCommandHandler> _logger;

    public TerminateAllOtherSessionsCommandHandler(
        ISessionManagementService sessionManagementService,
        ILogger<TerminateAllOtherSessionsCommandHandler> logger)
    {
        _sessionManagementService = sessionManagementService;
        _logger = logger;
    }

    public async Task<BaseResponse<int>> Handle(TerminateAllOtherSessionsCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Terminating all other sessions for user {UserId}", request.UserId);

            var terminatedCount = await _sessionManagementService.TerminateAllOtherSessionsAsync(
                request.UserId,
                request.CurrentSessionId,
                request.Reason,
                cancellationToken);

            _logger.LogInformation("Successfully terminated {Count} sessions for user {UserId}",
                terminatedCount, request.UserId);

            return BaseResponse<int>.Success(terminatedCount,
                $"Successfully terminated {terminatedCount} sessions");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error terminating sessions for user {UserId}", request.UserId);
            return BaseResponse<int>.Failure("An error occurred while terminating sessions. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SESSION_TERMINATION_ERROR"
                });
        }
    }
}