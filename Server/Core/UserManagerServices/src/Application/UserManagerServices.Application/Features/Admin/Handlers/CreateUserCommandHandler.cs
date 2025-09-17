using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Admin.Commands;
using UserManagerServices.Application.Features.Admin.Responses;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Features.Admin.Handlers;

/// <summary>
/// Handler for creating a new user
/// </summary>
public class CreateUserCommandHandler(
    UserManager<User> userManager,
    ILogger<CreateUserCommandHandler> logger) : IRequestHandler<CreateUserCommand, BaseResponse<UserResponse>>
{
    /// <summary>
    /// Handles the create user command
    /// </summary>
    /// <param name="request">Create user command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created user</returns>
    public async Task<BaseResponse<UserResponse>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Creating user with email: {Email} (created by: {CreatedBy})",
                request.Email, request.CreatedBy);

            // Check if user already exists
            var existingUser = await userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                logger.LogWarning("User with email {Email} already exists", request.Email);
                return BaseResponse<UserResponse>.Failure("A user with this email already exists",
                    new Dictionary<string, object>
                    {
                        ["errorCode"] = "USER_ALREADY_EXISTS"
                    });
            }

            // Create new user
            var user = new User
            {
                Email = request.Email,
                UserName = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                IsActive = request.IsActive,
                EmailConfirmed = !request.RequireEmailConfirmation,
                CreatedBy = request.CreatedBy
            };

            // Create user with password
            var result = await userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                logger.LogWarning("Failed to create user {Email}: {Errors}",
                    request.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
                return BaseResponse<UserResponse>.Failure("Failed to create user", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_CREATION_FAILED",
                    ["errors"] = result.Errors.Select(e => e.Description).ToList()
                });
            }

            // Assign roles if specified
            if (request.Roles.Any())
            {
                var roleResult = await userManager.AddToRolesAsync(user, request.Roles);
                if (!roleResult.Succeeded)
                    logger.LogWarning("Failed to assign roles to user {Email}: {Errors}",
                        request.Email, string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                // Don't fail the entire operation, just log the warning
            }

            // Get updated user with roles
            var createdUser = await userManager.FindByIdAsync(user.Id.ToString());
            var userRoles = await userManager.GetRolesAsync(createdUser!);
            var userClaims = await userManager.GetClaimsAsync(createdUser!);

            var response = new UserResponse
            {
                Id = createdUser!.Id,
                Email = createdUser.Email ?? string.Empty,
                FirstName = createdUser.FirstName,
                LastName = createdUser.LastName,
                FullName = $"{createdUser.FirstName} {createdUser.LastName}".Trim(),
                PhoneNumber = createdUser.PhoneNumber,
                IsActive = createdUser.IsActive,
                EmailConfirmed = createdUser.EmailConfirmed,
                PhoneNumberConfirmed = createdUser.PhoneNumberConfirmed,
                TwoFactorEnabled = createdUser.TwoFactorEnabled,
                Roles = userRoles.ToList(),
                Claims = userClaims.Select(c => new UserClaimInfo
                {
                    Type = c.Type,
                    Value = c.Value
                }).ToList(),
                CreatedAt = createdUser.CreatedAt,
                UpdatedAt = createdUser.UpdatedAt,
                LastLoginAt = createdUser.LastLoginAt,
                IsLockedOut = await userManager.IsLockedOutAsync(createdUser),
                LockoutEnd = createdUser.LockoutEnd
            };

            logger.LogInformation("Successfully created user {Email} with ID: {UserId}",
                request.Email, createdUser.Id);

            return BaseResponse<UserResponse>.Success(response, "User created successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating user with email: {Email}", request.Email);
            return BaseResponse<UserResponse>.Failure("An error occurred while creating the user. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}