using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Commands;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for updating user profile information
/// </summary>
public class UpdateUserProfileCommandHandler(
    UserManager<User> userManager,
    IUnitOfWork unitOfWork,
    ILogger<UpdateUserProfileCommandHandler> logger) : IRequestHandler<UpdateUserProfileCommand, BaseResponse<UserProfileResponse>>
{
    /// <summary>
    /// Handles the update user profile command
    /// </summary>
    /// <param name="request">Update user profile command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated user profile information</returns>
    public async Task<BaseResponse<UserProfileResponse>> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Updating user profile for user: {UserId}", request.UserId);

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

            // Update user basic information
            var userUpdated = false;
            if (!string.IsNullOrEmpty(request.FirstName) && user.FirstName != request.FirstName)
            {
                user.FirstName = request.FirstName;
                userUpdated = true;
            }

            if (!string.IsNullOrEmpty(request.LastName) && user.LastName != request.LastName)
            {
                user.LastName = request.LastName;
                userUpdated = true;
            }

            if (request.DateOfBirth.HasValue && user.DateOfBirth != request.DateOfBirth)
            {
                user.DateOfBirth = request.DateOfBirth;
                userUpdated = true;
            }

            if (request.Gender.HasValue && user.Gender != request.Gender)
            {
                user.Gender = request.Gender;
                userUpdated = true;
            }

            if (!string.IsNullOrEmpty(request.PhoneNumber) && user.PhoneNumber != request.PhoneNumber)
            {
                user.PhoneNumber = request.PhoneNumber;
                userUpdated = true;
            }

            if (userUpdated)
            {
                var updateResult = await userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
                    logger.LogWarning("Failed to update user basic information for user {UserId}: {Errors}", request.UserId, errors);
                    return BaseResponse<UserProfileResponse>.Failure("Failed to update user information", new Dictionary<string, object>
                    {
                        ["errorCode"] = "USER_UPDATE_FAILED",
                        ["errors"] = updateResult.Errors.Select(e => new { e.Code, e.Description }).ToList()
                    });
                }
            }

            // Get or create user profile
            var userProfile = await unitOfWork.Users.GetUserProfileAsync(request.UserId, cancellationToken);
            if (userProfile == null)
            {
                userProfile = new UserProfile
                {
                    UserId = request.UserId,
                    TimeZone = "UTC",
                    Language = "en"
                };
                await unitOfWork.Users.AddUserProfileAsync(userProfile, cancellationToken);
            }

            // Update profile information
            if (!string.IsNullOrEmpty(request.Address))
                userProfile.Address = request.Address;

            if (!string.IsNullOrEmpty(request.PostalCode))
                userProfile.PostalCode = request.PostalCode;

            if (!string.IsNullOrEmpty(request.City))
                userProfile.City = request.City;

            if (!string.IsNullOrEmpty(request.Country))
                userProfile.Country = request.Country;

            if (!string.IsNullOrEmpty(request.Province))
                userProfile.Province = request.Province;

            if (!string.IsNullOrEmpty(request.State))
                userProfile.State = request.State;

            if (!string.IsNullOrEmpty(request.District))
                userProfile.District = request.District;

            if (!string.IsNullOrEmpty(request.TimeZone))
                userProfile.TimeZone = request.TimeZone;

            if (!string.IsNullOrEmpty(request.Language))
                userProfile.Language = request.Language;

            // Update preferences if provided
            if (request.Preferences != null && request.Preferences.Any())
            {
                try
                {
                    var preferencesJson = JsonSerializer.Serialize(request.Preferences);
                    userProfile.Preferences = preferencesJson;
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to serialize preferences for user {UserId}", request.UserId);
                }
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);

            // Get updated preferences for response
            var preferences = new Dictionary<string, object>();
            if (!string.IsNullOrEmpty(userProfile.Preferences))
            {
                try
                {
                    preferences = JsonSerializer.Deserialize<Dictionary<string, object>>(userProfile.Preferences) ?? new Dictionary<string, object>();
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to deserialize preferences for user {UserId}", request.UserId);
                }
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
                    Address = userProfile.Address,
                    PostalCode = userProfile.PostalCode,
                    City = userProfile.City,
                    Country = userProfile.Country,
                    Province = userProfile.Province,
                    State = userProfile.State,
                    District = userProfile.District,
                    TimeZone = userProfile.TimeZone,
                    Language = userProfile.Language,
                    Preferences = preferences
                },
                LastUpdated = userProfile.UpdatedAt ?? userProfile.CreatedAt
            };

            logger.LogInformation("Successfully updated user profile for user: {UserId}", request.UserId);
            return BaseResponse<UserProfileResponse>.Success(response, "Profile updated successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating user profile for user: {UserId}", request.UserId);
            return BaseResponse<UserProfileResponse>.Failure("An error occurred while updating user profile. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}
