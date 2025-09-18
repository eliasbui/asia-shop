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
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Authentication.Commands;
using UserManagerServices.Application.Features.Authentication.Responses;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Features.Authentication.Handlers;

/// <summary>
/// Handler for login command
/// </summary>
public class LoginCommandHandler(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    ITokenService tokenService,
    ILogger<LoginCommandHandler> logger) : IRequestHandler<LoginCommand, BaseResponse<LoginResponse>>
{
    /// <summary>
    /// Handles the login command
    /// </summary>
    /// <param name="request">Login command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Login response</returns>
    public async Task<BaseResponse<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Login attempt for user: {EmailOrUsername} from IP: {IpAddress}",
                request.EmailOrUsername, request.IpAddress);

            // Find user by email or username
            var user = await FindUserAsync(request.EmailOrUsername);
            if (user == null)
            {
                logger.LogWarning("Login failed: User not found for {EmailOrUsername}", request.EmailOrUsername);
                return BaseResponse<LoginResponse>.Failure("Invalid email/username or password");
            }

            // Check if user is locked out
            if (await userManager.IsLockedOutAsync(user))
            {
                logger.LogWarning("Login failed: User {UserId} is locked out", user.Id);
                return BaseResponse<LoginResponse>.Failure("Account is locked. Please try again later.");
            }

            // Attempt sign in
            var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, true);

            if (!result.Succeeded)
            {
                logger.LogWarning("Login failed for user {UserId}: {Reason}", user.Id, GetFailureReason(result));
                return BaseResponse<LoginResponse>.Failure(GetFailureMessage(result));
            }

            // Generate tokens
            var roles = await userManager.GetRolesAsync(user);
            var accessToken = await tokenService.GenerateAccessTokenAsync(user, roles, cancellationToken);
            var refreshToken = tokenService.GenerateRefreshToken();

            // Update user's last login
            user.LastLoginAt = DateTime.UtcNow;
            user.LastLoginIp = request.IpAddress;
            await userManager.UpdateAsync(user);

            var response = new LoginResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60), // Should match JWT expiry
                User = new UserInfo
                {
                    Id = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName ?? string.Empty,
                    LastName = user.LastName ?? string.Empty,
                    Roles = roles.ToList(),
                    EmailConfirmed = user.EmailConfirmed
                }
            };

            logger.LogInformation("Login successful for user {UserId}", user.Id);
            return BaseResponse<LoginResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during login for user: {EmailOrUsername}", request.EmailOrUsername);
            return BaseResponse<LoginResponse>.Failure("An error occurred during login. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }

    /// <summary>
    /// Finds user by email or username
    /// </summary>
    /// <param name="emailOrUsername">Email or username</param>
    /// <returns>User if found, null otherwise</returns>
    private async Task<User?> FindUserAsync(string emailOrUsername)
    {
        // Try to find by email first
        var user = await userManager.FindByEmailAsync(emailOrUsername);
        if (user != null)
            return user;

        // Try to find by username
        return await userManager.FindByNameAsync(emailOrUsername);
    }

    /// <summary>
    /// Gets failure reason for logging
    /// </summary>
    /// <param name="result">Sign-in result</param>
    /// <returns>Failure reason</returns>
    private static string GetFailureReason(SignInResult result)
    {
        if (result.IsLockedOut) return "LockedOut";
        if (result.IsNotAllowed) return "NotAllowed";
        if (result.RequiresTwoFactor) return "RequiresTwoFactor";
        return "InvalidCredentials";
    }

    /// <summary>
    /// Gets user-friendly failure message
    /// </summary>
    /// <param name="result">Sign-in result</param>
    /// <returns>Failure message</returns>
    private static string GetFailureMessage(SignInResult result)
    {
        if (result.IsLockedOut)
            return "Account is locked due to multiple failed login attempts. Please try again later.";

        if (result.IsNotAllowed)
            return "Login is not allowed. Please confirm your email address.";

        if (result.RequiresTwoFactor)
            return "Two-factor authentication is required.";

        return "Invalid email/username or password.";
    }
}