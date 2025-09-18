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
using System.Text.Json;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Queries;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for getting user profile information
/// </summary>
public class GetUserProfileQueryHandler(
    UserManager<User> userManager,
    IUnitOfWork unitOfWork,
    ILogger<GetUserProfileQueryHandler> logger)
    : IRequestHandler<GetUserProfileQuery, BaseResponse<UserProfileResponse>>
{
    /// <summary>
    /// Handles the get user profile query
    /// </summary>
    /// <param name="request">Get user profile query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User profile information</returns>
    public async Task<BaseResponse<UserProfileResponse>> Handle(GetUserProfileQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Getting user profile for user: {UserId}", request.UserId);

            // Get user
            var user = await userManager.FindByIdAsync(request.UserId.ToString());
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<UserProfileResponse>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Get user profile
            var userProfile = await unitOfWork.Users.GetUserProfileAsync(request.UserId, cancellationToken);

            // Get user preferences
            var preferences = new Dictionary<string, object>();
            var userPreferences = await unitOfWork.Users.GetUserPreferencesAsync(request.UserId, cancellationToken);

            foreach (var pref in userPreferences.Where(p => p.IsActive && !p.IsDeleted))
                try
                {
                    var value = pref.DataType.ToLower() switch
                    {
                        "bool" => bool.Parse(pref.Value),
                        "int" => int.Parse(pref.Value),
                        "double" => double.Parse(pref.Value),
                        "json" => JsonSerializer.Deserialize<object>(pref.Value),
                        _ => pref.Value
                    };
                    preferences[$"{pref.Category}.{pref.Key}"] = value;
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to parse preference value for {Category}.{Key}", pref.Category,
                        pref.Key);
                    preferences[$"{pref.Category}.{pref.Key}"] = pref.Value;
                }

            var response = new UserProfileResponse
            {
                UserId = user.Id,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender?.ToString(),
                PhoneNumber = user.PhoneNumber,
                EmailConfirmed = user.EmailConfirmed,
                PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                Profile = new ProfileInfo
                {
                    Address = userProfile?.Address,
                    PostalCode = userProfile?.PostalCode,
                    City = userProfile?.City,
                    Country = userProfile?.Country,
                    Province = userProfile?.Province,
                    State = userProfile?.State,
                    District = userProfile?.District,
                    TimeZone = userProfile?.TimeZone ?? "UTC",
                    Language = userProfile?.Language ?? "en",
                    Preferences = preferences
                },
                LastUpdated = userProfile?.UpdatedAt ?? userProfile?.CreatedAt
            };

            logger.LogInformation("Successfully retrieved user profile for user: {UserId}", request.UserId);
            return BaseResponse<UserProfileResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting user profile for user: {UserId}", request.UserId);
            return BaseResponse<UserProfileResponse>.Failure(
                "An error occurred while retrieving user profile. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}