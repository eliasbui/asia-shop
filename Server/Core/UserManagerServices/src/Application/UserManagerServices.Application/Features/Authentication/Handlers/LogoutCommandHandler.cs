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
using UserManagerServices.Application.Features.Authentication.Commands;

namespace UserManagerServices.Application.Features.Authentication.Handlers;

/// <summary>
/// Handler for logout command
/// </summary>
public class LogoutCommandHandler(
    ITokenService tokenService,
    ILogger<LogoutCommandHandler> logger) : IRequestHandler<LogoutCommand, BaseResponse>
{
    /// <summary>
    /// Handles the logout command
    /// </summary>
    /// <param name="request">Logout command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Response indicating success or failure</returns>
    public async Task<BaseResponse> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Logout attempt for user: {UserId}", request.UserId);

            // Extract token information
            var tokenId = tokenService.GetTokenId(request.Token);
            var tokenExpiry = tokenService.GetTokenExpiry(request.Token);

            if (string.IsNullOrEmpty(tokenId))
            {
                logger.LogWarning("Invalid token provided for logout");
                return BaseResponse.Failure("Invalid token", new Dictionary<string, object>
                {
                    ["errorCode"] = "INVALID_TOKEN"
                });
            }

            if (tokenExpiry == null)
            {
                logger.LogWarning("Could not determine token expiry for logout");
                return BaseResponse.Failure("Invalid token", new Dictionary<string, object>
                {
                    ["errorCode"] = "INVALID_TOKEN"
                });
            }

            await tokenService.BlacklistTokenAsync(tokenId, tokenExpiry.Value, cancellationToken);

            logger.LogInformation("Logout successful for user: {UserId}, token: {TokenId}", request.UserId, tokenId);
            return new BaseResponse
            {
                IsSuccess = true,
                StatusCode = 200,
                Message = "Logout successful"
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during logout for user: {UserId}", request.UserId);
            return BaseResponse.Failure("An error occurred during logout. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}