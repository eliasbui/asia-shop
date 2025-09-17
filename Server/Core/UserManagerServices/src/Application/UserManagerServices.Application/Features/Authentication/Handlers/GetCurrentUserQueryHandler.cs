using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Authentication.Extensions;
using UserManagerServices.Application.Features.Authentication.Queries;
using UserManagerServices.Application.Features.Authentication.Responses;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Authentication.Handlers;

/// <summary>
/// Handler for getting current user profile information
/// </summary>
public class GetCurrentUserQueryHandler(
    UserManager<User> userManager,
    IUnitOfWork unitOfWork,
    ILogger<GetCurrentUserQueryHandler> logger)
    : IRequestHandler<GetCurrentUserQuery, BaseResponse<CurrentUserResponse>>
{
    /// <summary>
    /// Handles the get current user query
    /// </summary>
    /// <param name="request">Get current user query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Current user profile information</returns>
    public async Task<BaseResponse<CurrentUserResponse>> Handle(GetCurrentUserQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Getting current user profile for user: {UserId}", request.UserId);

            // Get user with all related data
            var user = await unitOfWork.Users.GetWithAllRelatedDataAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<CurrentUserResponse>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Get user roles
            var roles = await userManager.GetRolesAsync(user);

            // Get user claims
            var claims = await userManager.GetClaimsAsync(user);

            // Get user profile
            var profile = user.UserProfiles.FirstOrDefault();

            // Get user preferences
            var preferences = new Dictionary<string, object>();
            foreach (var pref in user.UserPreferences.Where(p => p is { IsActive: true, IsDeleted: false }))
                try
                {
                    var value = pref.DataType.ToLower() switch
                    {
                        "bool" => bool.Parse(pref.Value ?? "false"),
                        "int" => int.Parse(pref.Value ?? "0"),
                        "double" => double.Parse(pref.Value ?? "0.0"),
                        "json" => JsonSerializer.Deserialize<object>(pref.Value ?? "{}"),
                        _ => pref.Value ?? string.Empty
                    };
                    preferences[$"{pref.Category}.{pref.Key}"] = value ?? string.Empty;
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to parse preference value for {Category}.{Key}", pref.Category,
                        pref.Key);
                    preferences[$"{pref.Category}.{pref.Key}"] = pref.Value ?? string.Empty;
                }

            // Get notification settings using extension method
            var notificationSettings = user.NotificationSettings != null && !user.NotificationSettings.IsDeleted
                ? user.NotificationSettings.ToNotificationSettingInfo()
                : null;

            var response = new CurrentUserResponse
            {
                Id = user.Id,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender?.ToString(),
                PhoneNumber = user.PhoneNumber,
                Roles = roles.ToList(),
                Claims = claims.Select(c => new UserClaimInfo
                {
                    Type = c.Type,
                    Value = c.Value
                }).ToList(),
                EmailConfirmed = user.EmailConfirmed,
                PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                TwoFactorEnabled = user.TwoFactorEnabled,
                IsLockedOut = await userManager.IsLockedOutAsync(user),
                IsActive = user.IsActive,
                LastLoginAt = user.LastLoginAt,
                LastLoginIp = user.LastLoginIp,
                CreatedAt = user.CreatedAt,
                Profile = profile != null
                    ? new UserProfileInfo
                    {
                        Address = profile.Address,
                        PostalCode = profile.PostalCode,
                        City = profile.City,
                        Country = profile.Country,
                        Province = profile.Province,
                        TimeZone = profile.TimeZone,
                        Language = profile.Language
                    }
                    : null,
                Preferences = preferences,
                NotificationSettings = notificationSettings
            };

            logger.LogInformation("Successfully retrieved current user profile for user: {UserId}", request.UserId);
            return BaseResponse<CurrentUserResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting current user profile for user: {UserId}", request.UserId);
            return BaseResponse<CurrentUserResponse>.Failure(
                "An error occurred while retrieving user profile. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}