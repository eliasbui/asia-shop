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
using UserManagerServices.Application.Features.Admin.Responses;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Admin.Handlers;

/// <summary>
/// Handler for updating a user
/// </summary>
public class UpdateUserCommandHandler(
    IUnitOfWork unitOfWork,
    UserManager<User> userManager,
    ILogger<UpdateUserCommandHandler> logger) : IRequestHandler<UpdateUserCommand, BaseResponse<UserResponse>>
{
    /// <summary>
    /// Handles the update user command
    /// </summary>
    /// <param name="request">Update user command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated user</returns>
    public async Task<BaseResponse<UserResponse>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Updating user: {UserId} (updated by: {UpdatedBy})",
                request.UserId, request.UpdatedBy);

            // Get user to update
            var user = await userManager.FindByIdAsync(request.UserId.ToString());
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<UserResponse>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Update user properties
            var hasChanges = false;

            if (!string.IsNullOrEmpty(request.Email) && request.Email != user.Email)
            {
                // Check if email is already taken
                var existingUser = await userManager.FindByEmailAsync(request.Email);
                if (existingUser != null && existingUser.Id != user.Id)
                    return BaseResponse<UserResponse>.Failure("Email is already taken by another user",
                        new Dictionary<string, object>
                        {
                            ["errorCode"] = "EMAIL_ALREADY_EXISTS"
                        });
                user.Email = request.Email;
                user.UserName = request.Email;
                hasChanges = true;
            }

            if (!string.IsNullOrEmpty(request.FirstName) && request.FirstName != user.FirstName)
            {
                user.FirstName = request.FirstName;
                hasChanges = true;
            }

            if (!string.IsNullOrEmpty(request.LastName) && request.LastName != user.LastName)
            {
                user.LastName = request.LastName;
                hasChanges = true;
            }

            if (request.PhoneNumber != null && request.PhoneNumber != user.PhoneNumber)
            {
                user.PhoneNumber = request.PhoneNumber;
                hasChanges = true;
            }

            if (request.IsActive.HasValue && request.IsActive.Value != user.IsActive)
            {
                user.IsActive = request.IsActive.Value;
                hasChanges = true;
            }

            if (request.EmailConfirmed.HasValue && request.EmailConfirmed.Value != user.EmailConfirmed)
            {
                user.EmailConfirmed = request.EmailConfirmed.Value;
                hasChanges = true;
            }

            if (request.PhoneNumberConfirmed.HasValue &&
                request.PhoneNumberConfirmed.Value != user.PhoneNumberConfirmed)
            {
                user.PhoneNumberConfirmed = request.PhoneNumberConfirmed.Value;
                hasChanges = true;
            }

            if (request.TwoFactorEnabled.HasValue && request.TwoFactorEnabled.Value != user.TwoFactorEnabled)
            {
                user.TwoFactorEnabled = request.TwoFactorEnabled.Value;
                hasChanges = true;
            }

            if (hasChanges)
            {
                user.UpdatedBy = request.UpdatedBy;
                user.UpdatedAt = DateTime.UtcNow;

                var result = await userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    logger.LogWarning("Failed to update user {UserId}: {Errors}",
                        request.UserId, string.Join(", ", result.Errors.Select(e => e.Description)));
                    return BaseResponse<UserResponse>.Failure("Failed to update user", new Dictionary<string, object>
                    {
                        ["errorCode"] = "USER_UPDATE_FAILED",
                        ["errors"] = result.Errors.Select(e => e.Description).ToList()
                    });
                }
            }

            // Get updated user with roles and claims
            var updatedUser = await userManager.FindByIdAsync(user.Id.ToString());
            var userRoles = await userManager.GetRolesAsync(updatedUser!);
            var userClaims = await userManager.GetClaimsAsync(updatedUser!);

            var response = new UserResponse
            {
                Id = updatedUser!.Id,
                Email = updatedUser.Email ?? string.Empty,
                FirstName = updatedUser.FirstName,
                LastName = updatedUser.LastName,
                FullName = $"{updatedUser.FirstName} {updatedUser.LastName}".Trim(),
                PhoneNumber = updatedUser.PhoneNumber,
                IsActive = updatedUser.IsActive,
                EmailConfirmed = updatedUser.EmailConfirmed,
                PhoneNumberConfirmed = updatedUser.PhoneNumberConfirmed,
                TwoFactorEnabled = updatedUser.TwoFactorEnabled,
                Roles = userRoles.ToList(),
                Claims = userClaims.Select(c => new UserClaimInfo
                {
                    Type = c.Type,
                    Value = c.Value
                }).ToList(),
                CreatedAt = updatedUser.CreatedAt,
                UpdatedAt = updatedUser.UpdatedAt,
                LastLoginAt = updatedUser.LastLoginAt,
                IsLockedOut = await userManager.IsLockedOutAsync(updatedUser),
                LockoutEnd = updatedUser.LockoutEnd
            };

            logger.LogInformation("Successfully updated user: {UserId}", request.UserId);
            return BaseResponse<UserResponse>.Success(response, "User updated successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating user: {UserId}", request.UserId);
            return BaseResponse<UserResponse>.Failure("An error occurred while updating the user. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}