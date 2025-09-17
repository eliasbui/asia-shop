using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Queries;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for getting user API keys
/// </summary>
public class GetUserApiKeysQueryHandler(
    IUnitOfWork unitOfWork,
    ILogger<GetUserApiKeysQueryHandler> logger)
    : IRequestHandler<GetUserApiKeysQuery, BaseResponse<UserApiKeysResponse>>
{
    /// <summary>
    /// Handles the get user API keys query
    /// </summary>
    /// <param name="request">Get user API keys query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User API keys</returns>
    public async Task<BaseResponse<UserApiKeysResponse>> Handle(GetUserApiKeysQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Getting API keys for user: {UserId}", request.UserId);

            // Get user API keys
            var apiKeys = await unitOfWork.Users.GetUserApiKeysAsync(request.UserId, cancellationToken);

            var apiKeyInfos = apiKeys.Select(key => new ApiKeyInfo
            {
                Id = key.Id,
                Name = key.KeyName,
                MaskedKey = MaskApiKey(key.KeyValue),
                Scopes = ParseScopes(key.Permissions),
                IsActive = key.IsActive && key.ExpiresAt > DateTime.UtcNow,
                CreatedAt = key.CreatedAt,
                ExpiresAt = key.ExpiresAt,
                LastUsedAt = key.LastUsedAt
            }).ToList();

            var response = new UserApiKeysResponse
            {
                UserId = request.UserId,
                ApiKeys = apiKeyInfos,
                TotalKeys = apiKeyInfos.Count,
                ActiveKeys = apiKeyInfos.Count(k => k.IsActive && !k.IsExpired)
            };

            logger.LogInformation("Successfully retrieved {Count} API keys for user: {UserId}",
                apiKeyInfos.Count, request.UserId);

            return BaseResponse<UserApiKeysResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting API keys for user: {UserId}", request.UserId);
            return BaseResponse<UserApiKeysResponse>.Failure(
                "An error occurred while retrieving API keys. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }

    /// <summary>
    /// Masks the API key for security (shows only last 4 characters)
    /// </summary>
    /// <param name="apiKey">Full API key</param>
    /// <returns>Masked API key</returns>
    private static string MaskApiKey(string apiKey)
    {
        if (string.IsNullOrEmpty(apiKey) || apiKey.Length <= 4)
            return "****";

        return "****" + apiKey[^4..];
    }

    /// <summary>
    /// Parses the permissions JSON string to a list of scopes
    /// </summary>
    /// <param name="permissionsJson">Permissions JSON string</param>
    /// <returns>List of scopes</returns>
    private List<string> ParseScopes(string permissionsJson)
    {
        try
        {
            if (string.IsNullOrEmpty(permissionsJson))
                return new List<string>();

            var scopes = JsonSerializer.Deserialize<List<string>>(permissionsJson);
            return scopes ?? new List<string>();
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to parse permissions JSON: {PermissionsJson}", permissionsJson);
            return new List<string>();
        }
    }
}