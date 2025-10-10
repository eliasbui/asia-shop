#region Author File

// /*
//  * Author: $Eliasbui
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
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Authentication.Handlers;

/// <summary>
/// Handler for user registration command
/// </summary>
public class RegisterCommandHandler(
    UserManager<User> userManager,
    RoleManager<Role> roleManager,
    ITokenService tokenService,
    IEmailService emailService,
    IRecaptchaService recaptchaService,
    ILogger<RegisterCommandHandler> logger) : IRequestHandler<RegisterCommand, BaseResponse<LoginResponse>>
{
    /// <summary>
    /// Handles the registration command
    /// </summary>
    /// <param name="request">Registration command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Registration response with tokens if successful</returns>
    public async Task<BaseResponse<LoginResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var isRecaptchaValid = await recaptchaService.ValidateRecaptchaAsync(request.RecaptchaToken);
            if (!isRecaptchaValid)
            {
                logger.LogWarning("Invalid reCAPTCHA token for email: {Email}", request.Email);
                return BaseResponse<LoginResponse>.Failure("reCAPTCHA validation failed.");
            }

            logger.LogInformation("Registration attempt for email: {Email} from IP: {IpAddress}",
                request.Email, request.IpAddress);

            // Check if user already exists
            var existingUser = await userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                logger.LogWarning("Registration failed - email already exists: {Email}", request.Email);
                return BaseResponse<LoginResponse>.Failure("A user with this email already exists",
                    new Dictionary<string, object>
                    {
                        ["errorCode"] = "EMAIL_ALREADY_EXISTS"
                    });
            }

            // Check if username is provided and already exists
            if (!string.IsNullOrEmpty(request.UserName))
            {
                var existingUserByUsername = await userManager.FindByNameAsync(request.UserName);
                if (existingUserByUsername != null)
                {
                    logger.LogWarning("Registration failed - username already exists: {UserName}", request.UserName);
                    return BaseResponse<LoginResponse>.Failure("A user with this username already exists",
                        new Dictionary<string, object>
                        {
                            ["errorCode"] = "USERNAME_ALREADY_EXISTS"
                        });
                }
            }

            // Validate requested role if provided
            var roleName = request.RequestedRole ?? "User";
            var roleExists = await roleManager.RoleExistsAsync(roleName);
            if (!roleExists)
            {
                logger.LogWarning("Registration failed - invalid role requested: {Role}", roleName);
                return BaseResponse<LoginResponse>.Failure("Invalid role requested", new Dictionary<string, object>
                {
                    ["errorCode"] = "INVALID_ROLE"
                });
            }

            // Create new user
            var user = new User
            {
                UserName = request.UserName ?? request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth,
                EmailConfirmed = request.AutoConfirmEmail,
                IsActive = true
            };

            var result = await userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                logger.LogWarning("Registration failed for email {Email}: {Errors}", request.Email, errors);

                return BaseResponse<LoginResponse>.Failure("Registration failed", new Dictionary<string, object>
                {
                    ["errorCode"] = "REGISTRATION_FAILED",
                    ["errors"] = result.Errors.Select(e => new { e.Code, e.Description }).ToList()
                });
            }

            // Assign role to user
            var roleResult = await userManager.AddToRoleAsync(user, roleName);
            if (!roleResult.Succeeded)
                logger.LogWarning("Failed to assign role {Role} to user {UserId}", roleName, user.Id);
            // Continue with registration even if role assignment fails
            logger.LogInformation("User registered successfully: {UserId} with email: {Email}", user.Id, request.Email);

            // Send email confirmation if not auto-confirmed
            if (!request.AutoConfirmEmail)
            {
                var emailToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationUrl = $"https://yourdomain.com/confirm-email?userId={user.Id}&token={emailToken}";

                await emailService.SendTemplatedEmailAsync(
                    request.Email,
                    "welcome",
                    new Dictionary<string, object>
                    {
                        { "FirstName", request.FirstName },
                        { "Email", request.Email },
                        { "CompanyName", "Asia Shop" },
                        { "ConfirmationUrl", confirmationUrl },
                        { "SupportEmail", "support@yourdomain.com" }
                    }, cancellationToken);

                logger.LogInformation("Email confirmation sent to: {Email}", request.Email);
            }

            // Generate tokens for immediate login (if email is confirmed)
            if (user.EmailConfirmed)
            {
                var roles = await userManager.GetRolesAsync(user);
                var accessToken = await tokenService.GenerateAccessTokenAsync(user, roles, cancellationToken);
                var refreshToken = tokenService.GenerateRefreshToken();

                var response = new LoginResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(60),
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

                return BaseResponse<LoginResponse>.Success(response, "Registration successful. You are now logged in.");
            }

            // Return success without tokens if email confirmation is required
            return BaseResponse<LoginResponse>.Success(null!,
                "Registration successful. Please check your email to confirm your account.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
            return BaseResponse<LoginResponse>.Failure("An error occurred during registration. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}