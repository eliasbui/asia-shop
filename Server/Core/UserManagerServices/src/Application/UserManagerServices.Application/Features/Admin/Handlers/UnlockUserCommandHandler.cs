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
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Admin.Commands;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Admin.Handlers;

/// <summary>
/// Handler for unlocking a user account
/// </summary>
public class UnlockUserCommandHandler(
    IUnitOfWork unitOfWork,
    UserManager<User> userManager,
    ILogger<UnlockUserCommandHandler> logger) : IRequestHandler<UnlockUserCommand, BaseResponse<bool>>
{
    /// <summary>
    /// Handles the unlock user command
    /// </summary>
    /// <param name="request">Unlock user command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success result</returns>
    public async Task<BaseResponse<bool>> Handle(UnlockUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Unlocking user: {UserId} (unlocked by: {UnlockedBy})",
                request.UserId, request.UnlockedBy);

            // Get user to unlock
            var user = await userManager.FindByIdAsync(request.UserId.ToString());
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<bool>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Check if user is actually locked
            var isLocked = await userManager.IsLockedOutAsync(user);
            if (!isLocked)
            {
                logger.LogWarning("User {UserId} is not locked", request.UserId);
                return BaseResponse<bool>.Failure("User account is not locked", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_LOCKED"
                });
            }

            // Unlock the user by setting lockout end date to null
            var result = await userManager.SetLockoutEndDateAsync(user, null);
            if (!result.Succeeded)
            {
                logger.LogWarning("Failed to unlock user {UserId}: {Errors}",
                    request.UserId, string.Join(", ", result.Errors.Select(e => e.Description)));
                return BaseResponse<bool>.Failure("Failed to unlock user account", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_UNLOCK_FAILED",
                    ["errors"] = result.Errors.Select(e => e.Description).ToList()
                });
            }

            // Reset access failed count
            await userManager.ResetAccessFailedCountAsync(user);

            // Update user metadata
            user.UpdatedBy = request.UnlockedBy;
            user.UpdatedAt = DateTime.UtcNow;
            await userManager.UpdateAsync(user);

            logger.LogInformation("Successfully unlocked user: {UserId}", request.UserId);
            return BaseResponse<bool>.Success(true, "User account unlocked successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error unlocking user: {UserId}", request.UserId);
            return BaseResponse<bool>.Failure("An error occurred while unlocking the user account. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}