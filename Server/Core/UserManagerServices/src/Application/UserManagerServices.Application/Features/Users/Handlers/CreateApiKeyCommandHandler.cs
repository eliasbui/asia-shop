using MediatR;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Commands;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for creating a new API key
/// </summary>
public class CreateApiKeyCommandHandler(
    IUnitOfWork unitOfWork,
    ILogger<CreateApiKeyCommandHandler> logger) : IRequestHandler<CreateApiKeyCommand, BaseResponse<ApiKeyResponse>>
{
    /// <summary>
    /// Handles the create API key command
    /// </summary>
    /// <param name="request">Create API key command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created API key</returns>
    public async Task<BaseResponse<ApiKeyResponse>> Handle(CreateApiKeyCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Creating API key '{Name}' for user: {UserId}", request.Name, request.UserId);

            // Validate that user exists
            var user = await unitOfWork.Users.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<ApiKeyResponse>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Check if user already has an API key with the same name
            var existingKeys = await unitOfWork.Users.GetUserApiKeysAsync(request.UserId, cancellationToken);
            if (existingKeys.Any(k => k.KeyName.Equals(request.Name, StringComparison.OrdinalIgnoreCase)))
            {
                logger.LogWarning("API key with name '{Name}' already exists for user: {UserId}", request.Name, request.UserId);
                return BaseResponse<ApiKeyResponse>.Failure("An API key with this name already exists", new Dictionary<string, object>
                {
                    ["errorCode"] = "DUPLICATE_API_KEY_NAME"
                });
            }

            // Generate a secure API key
            var apiKeyValue = GenerateApiKey();

            // Set expiration date (default to 1 year if not specified)
            var expiresAt = request.ExpiresAt ?? DateTime.UtcNow.AddYears(1);

            // Serialize scopes to JSON
            var permissionsJson = JsonSerializer.Serialize(request.Scopes);

            // Create the API key entity
            var apiKey = new UserApiKey
            {
                UserId = request.UserId,
                KeyName = request.Name,
                KeyValue = apiKeyValue,
                IsActive = request.IsActive,
                Permissions = permissionsJson,
                ExpiresAt = expiresAt,
                LastUsedAt = DateTime.UtcNow,
                RequestLimit = 1000, // Default request limit
                RequestCount = 0
            };

            await unitOfWork.Users.AddUserApiKeyAsync(apiKey, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            var response = new ApiKeyResponse
            {
                Id = apiKey.Id,
                Name = apiKey.KeyName,
                Key = apiKeyValue, // Only returned on creation
                Scopes = request.Scopes,
                IsActive = apiKey.IsActive,
                CreatedAt = apiKey.CreatedAt,
                ExpiresAt = apiKey.ExpiresAt
            };

            logger.LogInformation("Successfully created API key '{Name}' for user: {UserId}", request.Name, request.UserId);
            return BaseResponse<ApiKeyResponse>.Success(response, "API key created successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating API key '{Name}' for user: {UserId}", request.Name, request.UserId);
            return BaseResponse<ApiKeyResponse>.Failure("An error occurred while creating the API key. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }

    /// <summary>
    /// Generates a secure API key
    /// </summary>
    /// <returns>Generated API key</returns>
    private static string GenerateApiKey()
    {
        const string prefix = "ak_";
        const int keyLength = 32;

        using var rng = RandomNumberGenerator.Create();
        var bytes = new byte[keyLength];
        rng.GetBytes(bytes);

        var keyPart = Convert.ToBase64String(bytes)
            .Replace("+", "")
            .Replace("/", "")
            .Replace("=", "")
            .Substring(0, keyLength);

        return prefix + keyPart;
    }
}
