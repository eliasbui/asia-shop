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
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Authentication.Commands;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Authentication.Handlers;

/// <summary>
/// Handler for forgot password command
/// </summary>
/// <param name="userManager">User manager</param>
/// <param name="logger">Logger</param>
public class ForgotPasswordCommandHandler(
    UserManager<User> userManager,
    ILogger<ForgotPasswordCommandHandler> logger,
    IEmailService emailService,
    IRecaptchaService recaptchaService) : IRequestHandler<ForgotPasswordCommand, BaseResponse>
{
    /// <summary>
    /// Handles the forgot password command
    /// </summary>
    /// <param name="request">Forgot password command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Response indicating the operation status</returns>
    public async Task<BaseResponse> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var isRecaptchaValid = await recaptchaService.ValidateRecaptchaAsync(request.RecaptchaToken);
            if (!isRecaptchaValid)
            {
                logger.LogWarning("Invalid reCAPTCHA token for email: {Email}", request.Email);
                // Return a generic success message to prevent user enumeration
                return new BaseResponse
                {
                    IsSuccess = true,
                    StatusCode = 200,
                    Message = "If an account with that email exists, a password reset link has been sent."
                };
            }
            logger.LogInformation("Password reset request for email: {Email}", request.Email);

            // Find user by email
            var user = await userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                logger.LogInformation("Password reset requested for non-existent email: {Email}", request.Email);
                return new BaseResponse
                {
                    IsSuccess = true,
                    StatusCode = 200,
                    Message = "If an account with that email exists, a password reset link has been sent."
                };
            }

            // Check if email is confirmed
            if (!await userManager.IsEmailConfirmedAsync(user))
            {
                logger.LogWarning("Password reset requested for unconfirmed email: {Email}", request.Email);
                return new BaseResponse
                {
                    IsSuccess = true,
                    StatusCode = 200,
                    Message = "If an account with that email exists, a password reset link has been sent."
                };
            }

            // Generate password reset token
            var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);

            // In a real application, you would:
            // 1. Store the reset token with expiration time (usually 1 hour)
            // 2. Send an email with a link containing the token
            // 3. The link would point to your frontend reset password page

            // For now, we'll just log the token (in production, never log tokens!)
            logger.LogInformation("Password reset token generated for user {UserId}. Token: {Token}",
                user.Id, resetToken);

            var resetUrl = $"https://yourdomain.com/reset-password?token={resetToken}";

            // Send email
            if (user.FirstName != null)
                await emailService.SendTemplatedEmailAsync(
                    request.Email,
                    "password-reset",
                    new Dictionary<string, object>
                    {
                        { "FirstName", user.FirstName },
                        { "Email", request.Email },
                        { "CompanyName", "Asia Shop" },
                        { "ResetUrl", $"{resetUrl}" },
                        { "ExpiryHours", "24" },
                        { "SupportEmail", "support@yourdomain.com" }
                    }, cancellationToken);

            logger.LogInformation("Password reset email would be sent to: {Email}", request.Email);

            return new BaseResponse
            {
                IsSuccess = true,
                StatusCode = 200,
                Message = "If an account with that email exists, a password reset link has been sent."
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during password reset request for email: {Email}", request.Email);
            return BaseResponse.Failure("An error occurred while processing your request. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}