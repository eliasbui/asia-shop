using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Admin.Commands;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Features.Admin.Handlers;

/// <summary>
/// Handler for deleting a user
/// </summary>
public class DeleteUserCommandHandler(
    UserManager<User> userManager,
    ILogger<DeleteUserCommandHandler> logger) : IRequestHandler<DeleteUserCommand, BaseResponse<bool>>
{
    /// <summary>
    /// Handles the delete user command
    /// </summary>
    /// <param name="request">Delete user command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success result</returns>
    public async Task<BaseResponse<bool>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Deleting user: {UserId} (deleted by: {DeletedBy})",
                request.UserId, request.DeletedBy);

            // Get user to delete
            var user = await userManager.FindByIdAsync(request.UserId.ToString());
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<bool>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Prevent admin from deleting themselves
            if (user.Id == request.DeletedBy)
            {
                logger.LogWarning("Admin {DeletedBy} attempted to delete themselves", request.DeletedBy);
                return BaseResponse<bool>.Failure("You cannot delete your own account", new Dictionary<string, object>
                {
                    ["errorCode"] = "CANNOT_DELETE_SELF"
                });
            }

            // Soft delete - mark as deleted instead of hard delete
            user.IsDeleted = true;
            user.IsActive = false;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                logger.LogWarning("Failed to delete user {UserId}: {Errors}",
                    request.UserId, string.Join(", ", result.Errors.Select(e => e.Description)));
                return BaseResponse<bool>.Failure("Failed to delete user", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_DELETION_FAILED",
                    ["errors"] = result.Errors.Select(e => e.Description).ToList()
                });
            }

            logger.LogInformation("Successfully deleted user: {UserId}", request.UserId);
            return BaseResponse<bool>.Success(true, "User deleted successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting user: {UserId}", request.UserId);
            return BaseResponse<bool>.Failure("An error occurred while deleting the user. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}