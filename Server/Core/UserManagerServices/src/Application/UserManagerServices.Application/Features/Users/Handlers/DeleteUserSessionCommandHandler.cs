using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Commands;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for deleting a user session
/// </summary>
public class DeleteUserSessionCommandHandler(
    IUnitOfWork unitOfWork,
    ILogger<DeleteUserSessionCommandHandler> logger) : IRequestHandler<DeleteUserSessionCommand, BaseResponse<bool>>
{
    /// <summary>
    /// Handles the delete user session command
    /// </summary>
    /// <param name="request">Delete user session command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success result</returns>
    public async Task<BaseResponse<bool>> Handle(DeleteUserSessionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Deleting session {SessionId} for user: {UserId}", request.SessionId, request.UserId);

            // Get the session to verify it belongs to the user
            var session = await unitOfWork.UserSessions.GetByIdAsync(request.SessionId, cancellationToken);
            if (session == null)
            {
                logger.LogWarning("Session not found: {SessionId}", request.SessionId);
                return BaseResponse<bool>.Failure("Session not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "SESSION_NOT_FOUND"
                });
            }

            // Verify the session belongs to the requesting user
            if (session.UserId != request.UserId)
            {
                logger.LogWarning("User {UserId} attempted to delete session {SessionId} belonging to user {SessionUserId}", 
                    request.UserId, request.SessionId, session.UserId);
                return BaseResponse<bool>.Failure("You can only delete your own sessions", new Dictionary<string, object>
                {
                    ["errorCode"] = "UNAUTHORIZED_SESSION_ACCESS"
                });
            }

            // Deactivate the session
            var deactivated = await unitOfWork.UserSessions.DeactivateSessionAsync(request.SessionId, cancellationToken);
            if (!deactivated)
            {
                logger.LogWarning("Failed to deactivate session {SessionId}", request.SessionId);
                return BaseResponse<bool>.Failure("Failed to delete session", new Dictionary<string, object>
                {
                    ["errorCode"] = "SESSION_DEACTIVATION_FAILED"
                });
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Successfully deleted session {SessionId} for user: {UserId}", request.SessionId, request.UserId);
            return BaseResponse<bool>.Success(true, "Session deleted successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting session {SessionId} for user: {UserId}", request.SessionId, request.UserId);
            return BaseResponse<bool>.Failure("An error occurred while deleting the session. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}
