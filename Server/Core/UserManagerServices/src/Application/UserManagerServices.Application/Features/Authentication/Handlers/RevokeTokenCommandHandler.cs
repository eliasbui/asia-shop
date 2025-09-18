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
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Authentication.Handlers;

/// <summary>
/// Handler for token revocation command
/// </summary>
public class RevokeTokenCommandHandler(
    UserManager<User> userManager,
    ITokenService tokenService,
    IUnitOfWork unitOfWork,
    ILogger<RevokeTokenCommandHandler> logger) : IRequestHandler<RevokeTokenCommand, BaseResponse>
{
    /// <summary>
    /// Handles the token revocation command
    /// </summary>
    /// <param name="request">Token revocation command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Response indicating success or failure</returns>
    public async Task<BaseResponse> Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var targetUserId = request.TargetUserId ?? request.CurrentUserId;

            logger.LogInformation("Token revocation attempt for user: {TargetUserId} by user: {CurrentUserId}",
                targetUserId, request.CurrentUserId);

            // Check if current user has permission to revoke tokens
            if (request.TargetUserId.HasValue && request.TargetUserId != request.CurrentUserId)
            {
                // Only admins can revoke other users' tokens
                var currentUser = await userManager.FindByIdAsync(request.CurrentUserId.ToString());
                if (currentUser == null)
                {
                    logger.LogWarning("Current user not found: {CurrentUserId}", request.CurrentUserId);
                    return BaseResponse.Failure("User not found", new Dictionary<string, object>
                    {
                        ["errorCode"] = "USER_NOT_FOUND"
                    });
                }

                var isAdmin = await userManager.IsInRoleAsync(currentUser, "Admin") ||
                              await userManager.IsInRoleAsync(currentUser, "SuperAdmin");

                if (!isAdmin)
                {
                    logger.LogWarning(
                        "Unauthorized token revocation attempt by user: {CurrentUserId} for user: {TargetUserId}",
                        request.CurrentUserId, request.TargetUserId);
                    return BaseResponse.Failure("Insufficient permissions to revoke other users' tokens",
                        new Dictionary<string, object>
                        {
                            ["errorCode"] = "INSUFFICIENT_PERMISSIONS"
                        });
                }
            }

            // Get target user
            var targetUser = await userManager.FindByIdAsync(targetUserId.ToString());
            if (targetUser == null)
            {
                logger.LogWarning("Target user not found: {TargetUserId}", targetUserId);
                return BaseResponse.Failure("Target user not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "TARGET_USER_NOT_FOUND"
                });
            }

            if (request.RevokeAllTokens)
            {
                // Revoke all tokens by updating security stamp
                await userManager.UpdateSecurityStampAsync(targetUser);

                // Also deactivate all user sessions
                var activeSessions =
                    await unitOfWork.UserSessions.GetActiveSessionsByUserIdAsync(targetUserId, cancellationToken);
                foreach (var session in activeSessions)
                    await unitOfWork.UserSessions.DeactivateSessionAsync(session.Id, cancellationToken);

                await unitOfWork.SaveChangesAsync(cancellationToken);

                logger.LogInformation(
                    "All tokens revoked for user: {TargetUserId} by user: {CurrentUserId}. Reason: {Reason}",
                    targetUserId, request.CurrentUserId, request.Reason ?? "Not specified");

                return new BaseResponse
                {
                    IsSuccess = true,
                    StatusCode = 200,
                    Message = "All tokens have been revoked successfully"
                };
            }
            else if (!string.IsNullOrEmpty(request.Token))
            {
                // Revoke specific token
                var tokenId = tokenService.GetTokenId(request.Token);
                var tokenExpiry = tokenService.GetTokenExpiry(request.Token);

                if (string.IsNullOrEmpty(tokenId))
                {
                    logger.LogWarning("Invalid token provided for revocation");
                    return BaseResponse.Failure("Invalid token", new Dictionary<string, object>
                    {
                        ["errorCode"] = "INVALID_TOKEN"
                    });
                }

                if (tokenExpiry == null)
                {
                    logger.LogWarning("Could not determine token expiry for revocation");
                    return BaseResponse.Failure("Invalid token", new Dictionary<string, object>
                    {
                        ["errorCode"] = "INVALID_TOKEN"
                    });
                }

                // Verify token belongs to target user
                var tokenUserId = await tokenService.GetUserIdFromTokenAsync(request.Token);
                if (tokenUserId != targetUserId)
                {
                    logger.LogWarning(
                        "Token does not belong to target user. Token user: {TokenUserId}, Target user: {TargetUserId}",
                        tokenUserId, targetUserId);
                    return BaseResponse.Failure("Token does not belong to the specified user",
                        new Dictionary<string, object>
                        {
                            ["errorCode"] = "TOKEN_USER_MISMATCH"
                        });
                }

                await tokenService.BlacklistTokenAsync(tokenId, tokenExpiry.Value, cancellationToken);

                // Also deactivate the corresponding session if it exists
                var session = await unitOfWork.UserSessions.GetBySessionTokenAsync(request.Token, cancellationToken);
                if (session != null)
                {
                    await unitOfWork.UserSessions.DeactivateSessionAsync(session.Id, cancellationToken);
                    await unitOfWork.SaveChangesAsync(cancellationToken);
                }

                logger.LogInformation(
                    "Token {TokenId} revoked for user: {TargetUserId} by user: {CurrentUserId}. Reason: {Reason}",
                    tokenId, targetUserId, request.CurrentUserId, request.Reason ?? "Not specified");

                return new BaseResponse
                {
                    IsSuccess = true,
                    StatusCode = 200,
                    Message = "Token has been revoked successfully"
                };
            }
            else
            {
                logger.LogWarning("No token or revoke all flag specified in revocation request");
                return BaseResponse.Failure("Either specify a token to revoke or set RevokeAllTokens to true",
                    new Dictionary<string, object>
                    {
                        ["errorCode"] = "INVALID_REQUEST"
                    });
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during token revocation for user: {TargetUserId} by user: {CurrentUserId}",
                request.TargetUserId, request.CurrentUserId);
            return BaseResponse.Failure("An error occurred during token revocation. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}