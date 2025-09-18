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
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Sessions.Handlers;

/// <summary>
/// Handler for updating session timeout settings
/// </summary>
public class UpdateSessionTimeoutCommandHandler : IRequestHandler<UpdateSessionTimeoutCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateSessionTimeoutCommandHandler> _logger;

    public UpdateSessionTimeoutCommandHandler(
        IUnitOfWork unitOfWork,
        ILogger<UpdateSessionTimeoutCommandHandler> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<BaseResponse<bool>> Handle(UpdateSessionTimeoutCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Updating session timeout settings for user {UserId}", request.UserId);

            // Validate input
            if (request.SessionTimeoutMinutes < 5 || request.SessionTimeoutMinutes > 1440)
                return BaseResponse<bool>.Failure("Session timeout must be between 5 and 1440 minutes",
                    new Dictionary<string, object>
                    {
                        ["errorCode"] = "INVALID_TIMEOUT_VALUE"
                    });

            if (request.MaxConcurrentSessions < 1 || request.MaxConcurrentSessions > 20)
                return BaseResponse<bool>.Failure("Maximum concurrent sessions must be between 1 and 20",
                    new Dictionary<string, object>
                    {
                        ["errorCode"] = "INVALID_SESSION_LIMIT"
                    });

            // Get current security settings
            var securitySettings =
                await _unitOfWork.UserSecuritySettings.GetUserSecuritySettingsAsync(request.UserId, cancellationToken);

            // Update session-related settings
            securitySettings.SessionTimeoutMinutes = request.SessionTimeoutMinutes;
            securitySettings.MaxConcurrentSessions = request.MaxConcurrentSessions;

            // Save updated settings
            await _unitOfWork.UserSecuritySettings.CreateOrUpdateUserSettingsAsync(request.UserId, securitySettings,
                cancellationToken);

            _logger.LogInformation(
                "Successfully updated session timeout settings for user {UserId}. Timeout: {Timeout}min, Max Sessions: {MaxSessions}",
                request.UserId, request.SessionTimeoutMinutes, request.MaxConcurrentSessions);

            return BaseResponse<bool>.Success(true, "Session timeout settings updated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating session timeout settings for user {UserId}", request.UserId);
            return BaseResponse<bool>.Failure("An error occurred while updating session settings. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SESSION_SETTINGS_UPDATE_ERROR"
                });
        }
    }
}