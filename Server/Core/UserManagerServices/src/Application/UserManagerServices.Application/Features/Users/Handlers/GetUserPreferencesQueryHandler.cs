using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Queries;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for getting user preferences
/// </summary>
public class GetUserPreferencesQueryHandler(
    IUnitOfWork unitOfWork,
    ILogger<GetUserPreferencesQueryHandler> logger)
    : IRequestHandler<GetUserPreferencesQuery, BaseResponse<UserPreferencesResponse>>
{
    /// <summary>
    /// Handles the get user preferences query
    /// </summary>
    /// <param name="request">Get user preferences query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User preferences</returns>
    public async Task<BaseResponse<UserPreferencesResponse>> Handle(GetUserPreferencesQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Getting user preferences for user: {UserId}", request.UserId);

            // Get user preferences
            var userPreferences = await unitOfWork.Users.GetUserPreferencesAsync(request.UserId, cancellationToken);

            // Group preferences by category
            var groupedPreferences = new Dictionary<string, Dictionary<string, PreferenceItem>>();
            DateTime? lastUpdated = null;

            foreach (var pref in userPreferences.Where(p => p.IsActive && !p.IsDeleted))
            {
                if (!groupedPreferences.ContainsKey(pref.Category))
                    groupedPreferences[pref.Category] = new Dictionary<string, PreferenceItem>();

                // Parse the value based on data type
                object parsedValue;
                try
                {
                    parsedValue = pref.DataType.ToLower() switch
                    {
                        "bool" => bool.Parse(pref.Value),
                        "int" => int.Parse(pref.Value),
                        "double" => double.Parse(pref.Value),
                        "json" => JsonSerializer.Deserialize<object>(pref.Value),
                        _ => pref.Value
                    };
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to parse preference value for {Category}.{Key}, using raw value",
                        pref.Category, pref.Key);
                    parsedValue = pref.Value;
                }

                groupedPreferences[pref.Category][pref.Key] = new PreferenceItem
                {
                    Key = pref.Key,
                    Value = parsedValue,
                    DataType = pref.DataType,
                    IsActive = pref.IsActive,
                    CreatedAt = pref.CreatedAt,
                    UpdatedAt = pref.UpdatedAt
                };

                // Track the latest update time
                var prefUpdateTime = pref.UpdatedAt ?? pref.CreatedAt;
                if (lastUpdated == null || prefUpdateTime > lastUpdated) lastUpdated = prefUpdateTime;
            }

            var response = new UserPreferencesResponse
            {
                UserId = request.UserId,
                Preferences = groupedPreferences,
                LastUpdated = lastUpdated
            };

            logger.LogInformation("Successfully retrieved {Count} preferences for user: {UserId}",
                userPreferences.Count(), request.UserId);

            return BaseResponse<UserPreferencesResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting user preferences for user: {UserId}", request.UserId);
            return BaseResponse<UserPreferencesResponse>.Failure(
                "An error occurred while retrieving user preferences. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}