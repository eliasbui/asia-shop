#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Authentication.Commands;
using UserManagerServices.Application.Features.Authentication.Responses;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Features.Authentication.Handlers;

/// <summary>
/// Handler for refresh token command
/// </summary>
public class RefreshTokenCommandHandler(
    ITokenService tokenService,
    UserManager<User> userManager,
    ILogger<RefreshTokenCommandHandler> logger) : IRequestHandler<RefreshTokenCommand, BaseResponse<LoginResponse>>
{
    /// <summary>
    /// Handles the refresh token command
    /// </summary>
    /// <param name="request">Refresh token command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>New login response with refreshed tokens</returns>
    public async Task<BaseResponse<LoginResponse>> Handle(RefreshTokenCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Token refresh attempt for user");

            // Validate the refresh token and get user ID
            var userId = await tokenService.GetUserIdFromTokenAsync(request.RefreshToken);
            if (userId == null)
            {
                logger.LogWarning("Invalid refresh token provided");
                return BaseResponse<LoginResponse>.Failure("Invalid or expired refresh token");
            }

            // Check if the token is blacklisted
            var tokenId = tokenService.GetTokenId(request.RefreshToken);
            if (!string.IsNullOrEmpty(tokenId) &&
                await tokenService.IsTokenBlacklistedAsync(tokenId, cancellationToken))
            {
                logger.LogWarning("Attempted to use blacklisted refresh token: {TokenId}", tokenId);
                return BaseResponse<LoginResponse>.Failure("Invalid or expired refresh token");
            }

            // Fetch user details from the database
            var user = await userManager.FindByIdAsync(userId.Value.ToString());
            if (user == null)
            {
                logger.LogWarning("User not found for refresh token: {UserId}", userId);
                return BaseResponse<LoginResponse>.Failure("Invalid or expired refresh token");
            }

            // Get user roles
            var roles = await userManager.GetRolesAsync(user);

            // Generate new tokens
            var newAccessToken = await tokenService.GenerateAccessTokenAsync(user, roles, cancellationToken);
            var newRefreshToken = tokenService.GenerateRefreshToken();

            var response = new LoginResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                User = new UserInfo
                {
                    Id = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName ?? string.Empty,
                    LastName = user.LastName ?? string.Empty,
                    Roles = roles.ToList(),
                    EmailConfirmed = user.EmailConfirmed
                }
            };

            logger.LogInformation("Token refresh successful for user: {UserId}", userId);
            return BaseResponse<LoginResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during token refresh");
            return BaseResponse<LoginResponse>.Failure("An error occurred during token refresh. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}