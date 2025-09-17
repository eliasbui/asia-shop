using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Commands;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for deleting an API key
/// </summary>
public class DeleteApiKeyCommandHandler(
    IUnitOfWork unitOfWork,
    ILogger<DeleteApiKeyCommandHandler> logger) : IRequestHandler<DeleteApiKeyCommand, BaseResponse<bool>>
{
    /// <summary>
    /// Handles the delete API key command
    /// </summary>
    /// <param name="request">Delete API key command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success result</returns>
    public async Task<BaseResponse<bool>> Handle(DeleteApiKeyCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Deleting API key {KeyId} for user: {UserId}", request.KeyId, request.UserId);

            // Verify the API key exists and belongs to the user
            var apiKey = await unitOfWork.Users.GetUserApiKeyAsync(request.KeyId, request.UserId, cancellationToken);
            if (apiKey == null)
            {
                logger.LogWarning("API key not found or does not belong to user: KeyId={KeyId}, UserId={UserId}", 
                    request.KeyId, request.UserId);
                return BaseResponse<bool>.Failure("API key not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "API_KEY_NOT_FOUND"
                });
            }

            // Delete the API key (soft delete)
            var deleted = await unitOfWork.Users.DeleteUserApiKeyAsync(request.KeyId, request.UserId, cancellationToken);
            if (!deleted)
            {
                logger.LogWarning("Failed to delete API key {KeyId} for user: {UserId}", request.KeyId, request.UserId);
                return BaseResponse<bool>.Failure("Failed to delete API key", new Dictionary<string, object>
                {
                    ["errorCode"] = "API_KEY_DELETION_FAILED"
                });
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Successfully deleted API key {KeyId} for user: {UserId}", request.KeyId, request.UserId);
            return BaseResponse<bool>.Success(true, "API key deleted successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting API key {KeyId} for user: {UserId}", request.KeyId, request.UserId);
            return BaseResponse<bool>.Failure("An error occurred while deleting the API key. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}
