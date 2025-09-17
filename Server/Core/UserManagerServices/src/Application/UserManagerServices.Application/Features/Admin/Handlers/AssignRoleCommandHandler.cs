using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Admin.Commands;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Admin.Handlers;

/// <summary>
/// Handler for assigning a role to a user
/// </summary>
public class AssignRoleCommandHandler(
    IUnitOfWork unitOfWork,
    UserManager<User> userManager,
    RoleManager<Role> roleManager,
    ILogger<AssignRoleCommandHandler> logger) : IRequestHandler<AssignRoleCommand, BaseResponse<bool>>
{
    /// <summary>
    /// Handles the assign role command
    /// </summary>
    /// <param name="request">Assign role command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success result</returns>
    public async Task<BaseResponse<bool>> Handle(AssignRoleCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Assigning role '{RoleName}' to user: {UserId} (assigned by: {AssignedBy})",
                request.RoleName, request.UserId, request.AssignedBy);

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

            // Check if user already has the role
            var userHasRole = await userManager.IsInRoleAsync(user, request.RoleName);
            if (userHasRole)
            {
                logger.LogWarning("User {UserId} already has role '{RoleName}'", request.UserId, request.RoleName);
                return BaseResponse<bool>.Failure("User already has this role", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_ALREADY_HAS_ROLE"
                });
            }

            // Assign role to user
            var result = await userManager.AddToRoleAsync(user, request.RoleName);
            if (!result.Succeeded)
            {
                logger.LogWarning("Failed to assign role '{RoleName}' to user {UserId}: {Errors}",
                    request.RoleName, request.UserId, string.Join(", ", result.Errors.Select(e => e.Description)));
                return BaseResponse<bool>.Failure("Failed to assign role to user", new Dictionary<string, object>
                {
                    ["errorCode"] = "ROLE_ASSIGNMENT_FAILED",
                    ["errors"] = result.Errors.Select(e => e.Description).ToList()
                });
            }

            logger.LogInformation("Successfully assigned role '{RoleName}' to user: {UserId}",
                request.RoleName, request.UserId);

            return BaseResponse<bool>.Success(true, "Role assigned successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error assigning role '{RoleName}' to user: {UserId}",
                request.RoleName, request.UserId);
            return BaseResponse<bool>.Failure("An error occurred while assigning the role. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}