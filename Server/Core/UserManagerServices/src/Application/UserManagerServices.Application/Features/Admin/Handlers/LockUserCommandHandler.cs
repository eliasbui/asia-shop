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

namespace UserManagerServices.Application.Features.Admin.Handlers;

/// <summary>
/// Handler for locking a user account
/// </summary>
public class LockUserCommandHandler(
    UserManager<User> userManager,
    ILogger<LockUserCommandHandler> logger) : IRequestHandler<LockUserCommand, BaseResponse<bool>>
{
    /// <summary>
    /// Handles the lock user command
    /// </summary>
    /// <param name="request">Lock user command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success result</returns>
    public async Task<BaseResponse<bool>> Handle(LockUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Locking user: {UserId} (locked by: {LockedBy})",
                request.UserId, request.LockedBy);

            // Get user to lock
            var user = await userManager.FindByIdAsync(request.UserId.ToString());
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<bool>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Prevent admin from locking themselves
            if (user.Id == request.LockedBy)
            {
                logger.LogWarning("Admin {LockedBy} attempted to lock themselves", request.LockedBy);
                return BaseResponse<bool>.Failure("You cannot lock your own account", new Dictionary<string, object>
                {
                    ["errorCode"] = "CANNOT_LOCK_SELF"
                });
            }

            // Check if user is already locked
            var isAlreadyLocked = await userManager.IsLockedOutAsync(user);
            if (isAlreadyLocked)
            {
                logger.LogWarning("User {UserId} is already locked", request.UserId);
                return BaseResponse<bool>.Failure("User account is already locked", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_ALREADY_LOCKED"
                });
            }

            // Set lockout end time
            var lockoutEnd = request.LockDurationHours.HasValue
                ? DateTime.UtcNow.AddHours(request.LockDurationHours.Value)
                : DateTime.UtcNow.AddYears(100); // Indefinite lock (far future date)

            // Lock the user
            var result = await userManager.SetLockoutEndDateAsync(user, lockoutEnd);
            if (!result.Succeeded)
            {
                logger.LogWarning("Failed to lock user {UserId}: {Errors}",
                    request.UserId, string.Join(", ", result.Errors.Select(e => e.Description)));
                return BaseResponse<bool>.Failure("Failed to lock user account", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_LOCK_FAILED",
                    ["errors"] = result.Errors.Select(e => e.Description).ToList()
                });
            }

            // Update user metadata
            user.UpdatedBy = request.LockedBy;
            user.UpdatedAt = DateTime.UtcNow;
            await userManager.UpdateAsync(user);

            // Log the action (you might want to add this to activity log)
            logger.LogInformation("Successfully locked user: {UserId} until {LockoutEnd}. Reason: {Reason}",
                request.UserId, lockoutEnd, request.Reason ?? "No reason provided");

            return BaseResponse<bool>.Success(true, "User account locked successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error locking user: {UserId}", request.UserId);
            return BaseResponse<bool>.Failure("An error occurred while locking the user account. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}