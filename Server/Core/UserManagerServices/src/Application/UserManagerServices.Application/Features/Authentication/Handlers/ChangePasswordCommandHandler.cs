using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Authentication.Commands;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Features.Authentication.Handlers;

/// <summary>
/// Handler for change password command
/// </summary>
public class ChangePasswordCommandHandler(
    UserManager<User> userManager,
    ILogger<ChangePasswordCommandHandler> logger) : IRequestHandler<ChangePasswordCommand, BaseResponse>
{
    /// <summary>
    /// Handles the change password command
    /// </summary>
    /// <param name="request">Change password command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Response indicating success or failure</returns>
    public async Task<BaseResponse> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Password change attempt for user: {UserId}", request.UserId);

            // Find the user
            var user = await userManager.FindByIdAsync(request.UserId.ToString());
            if (user == null)
            {
                logger.LogWarning("Password change failed: User not found {UserId}", request.UserId);
                return BaseResponse.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Verify current password
            var isCurrentPasswordValid = await userManager.CheckPasswordAsync(user, request.CurrentPassword);
            if (!isCurrentPasswordValid)
            {
                logger.LogWarning("Password change failed: Invalid current password for user {UserId}",
                    request.UserId);
                return BaseResponse.Failure("Current password is incorrect", new Dictionary<string, object>
                {
                    ["errorCode"] = "INVALID_CURRENT_PASSWORD"
                });
            }

            // Change password
            var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                logger.LogWarning("Password change failed for user {UserId}: {Errors}", request.UserId, errors);

                return BaseResponse.Failure("Password change failed", new Dictionary<string, object>
                {
                    ["errorsCode"] = "PASSWORD_CHANGE_FAILED"
                });
            }

            // Update security stamp to invalidate existing tokens
            await userManager.UpdateSecurityStampAsync(user);

            logger.LogInformation("Password changed successfully for user: {UserId}", request.UserId);
            return new BaseResponse
            {
                IsSuccess = true,
                StatusCode = 200,
                Message = "Password changed successfully"
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during password change for user: {UserId}", request.UserId);
            return BaseResponse.Failure("An error occurred during password change. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}