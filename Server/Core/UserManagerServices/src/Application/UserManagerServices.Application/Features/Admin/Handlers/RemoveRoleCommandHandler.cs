using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Admin.Commands;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Admin.Handlers;

/// <summary>
/// Handler for removing a role from a user
/// </summary>
public class RemoveRoleCommandHandler(
    IUnitOfWork unitOfWork,
    UserManager<User> userManager,
    RoleManager<Role> roleManager,
    ILogger<RemoveRoleCommandHandler> logger) : IRequestHandler<RemoveRoleCommand, BaseResponse<bool>>
{
    /// <summary>
    /// Handles the remove role command
    /// </summary>
    /// <param name="request">Remove role command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success result</returns>
    public async Task<BaseResponse<bool>> Handle(RemoveRoleCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Removing role '{RoleName}' from user: {UserId} (removed by: {RemovedBy})",
                request.RoleName, request.UserId, request.RemovedBy);

            // Get user
            var user = await userManager.FindByIdAsync(request.UserId.ToString());
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<bool>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Check if role exists
            var roleExists = await roleManager.RoleExistsAsync(request.RoleName);
            if (!roleExists)
            {
                logger.LogWarning("Role not found: {RoleName}", request.RoleName);
                return BaseResponse<bool>.Failure("Role not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "ROLE_NOT_FOUND"
                });
            }

            // Check if user has the role
            var userHasRole = await userManager.IsInRoleAsync(user, request.RoleName);
            if (!userHasRole)
            {
                logger.LogWarning("User {UserId} does not have role '{RoleName}'", request.UserId, request.RoleName);
                return BaseResponse<bool>.Failure("User does not have this role", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_DOES_NOT_HAVE_ROLE"
                });
            }

            // Remove role from user
            var result = await userManager.RemoveFromRoleAsync(user, request.RoleName);
            if (!result.Succeeded)
            {
                logger.LogWarning("Failed to remove role '{RoleName}' from user {UserId}: {Errors}",
                    request.RoleName, request.UserId, string.Join(", ", result.Errors.Select(e => e.Description)));
                return BaseResponse<bool>.Failure("Failed to remove role from user", new Dictionary<string, object>
                {
                    ["errorCode"] = "ROLE_REMOVAL_FAILED",
                    ["errors"] = result.Errors.Select(e => e.Description).ToList()
                });
            }

            logger.LogInformation("Successfully removed role '{RoleName}' from user: {UserId}",
                request.RoleName, request.UserId);

            return BaseResponse<bool>.Success(true, "Role removed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error removing role '{RoleName}' from user: {UserId}",
                request.RoleName, request.UserId);
            return BaseResponse<bool>.Failure("An error occurred while removing the role. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}