using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Commands;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for updating user preferences
/// </summary>
public class UpdateUserPreferencesCommandHandler(
    IUnitOfWork unitOfWork,
    ILogger<UpdateUserPreferencesCommandHandler> logger) : IRequestHandler<UpdateUserPreferencesCommand, BaseResponse<UserPreferencesResponse>>
{
    /// <summary>
    /// Handles the update user preferences command
    /// </summary>
    /// <param name="request">Update user preferences command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated user preferences</returns>
    public async Task<BaseResponse<UserPreferencesResponse>> Handle(UpdateUserPreferencesCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Updating user preferences for user: {UserId}", request.UserId);

            // Validate that user exists
            var user = await unitOfWork.Users.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<UserPreferencesResponse>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Process each category and preference
            foreach (var category in request.Preferences)
            {
                foreach (var preference in category.Value)
                {
                    try
                    {
                        // Serialize the value based on data type
                        string serializedValue;
                        var dataType = preference.Value.DataType.ToLower();
                        
                        switch (dataType)
                        {
                            case "json":
                                serializedValue = JsonSerializer.Serialize(preference.Value.Value);
                                break;
                            case "bool":
                                if (preference.Value.Value is bool boolValue)
                                    serializedValue = boolValue.ToString().ToLower();
                                else
                                    serializedValue = bool.Parse(preference.Value.Value.ToString()!).ToString().ToLower();
                                break;
                            case "int":
                                if (preference.Value.Value is int intValue)
                                    serializedValue = intValue.ToString();
                                else
                                    serializedValue = int.Parse(preference.Value.Value.ToString()!).ToString();
                                break;
                            case "double":
                                if (preference.Value.Value is double doubleValue)
                                    serializedValue = doubleValue.ToString();
                                else
                                    serializedValue = double.Parse(preference.Value.Value.ToString()!).ToString();
                                break;
                            default:
                                serializedValue = preference.Value.Value.ToString() ?? string.Empty;
                                break;
                        }

                        var userPreference = new UserPreference
                        {
                            UserId = request.UserId,
                            Category = category.Key,
                            Key = preference.Key,
                            Value = serializedValue,
                            DataType = dataType,
                            IsActive = true
                        };

                        await unitOfWork.Users.AddOrUpdateUserPreferenceAsync(userPreference, cancellationToken);
                    }
                    catch (Exception ex)
                    {
                        logger.LogWarning(ex, "Failed to process preference {Category}.{Key} for user {UserId}", 
                            category.Key, preference.Key, request.UserId);
                        // Continue processing other preferences
                    }
                }
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);

            // Get updated preferences for response
            var updatedPreferences = await unitOfWork.Users.GetUserPreferencesAsync(request.UserId, cancellationToken);

            // Group preferences by category
            var groupedPreferences = new Dictionary<string, Dictionary<string, PreferenceItem>>();
            DateTime? lastUpdated = null;

            foreach (var pref in updatedPreferences.Where(p => p.IsActive && !p.IsDeleted))
            {
                if (!groupedPreferences.ContainsKey(pref.Category))
                {
                    groupedPreferences[pref.Category] = new Dictionary<string, PreferenceItem>();
                }

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
                    logger.LogWarning(ex, "Failed to parse preference value for {Category}.{Key}, using raw value", pref.Category, pref.Key);
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
                if (lastUpdated == null || prefUpdateTime > lastUpdated)
                {
                    lastUpdated = prefUpdateTime;
                }
            }

            var response = new UserPreferencesResponse
            {
                UserId = request.UserId,
                Preferences = groupedPreferences,
                LastUpdated = lastUpdated
            };

            logger.LogInformation("Successfully updated preferences for user: {UserId}", request.UserId);
            return BaseResponse<UserPreferencesResponse>.Success(response, "Preferences updated successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating user preferences for user: {UserId}", request.UserId);
            return BaseResponse<UserPreferencesResponse>.Failure("An error occurred while updating user preferences. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}
