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

namespace UserManagerServices.Application.Features.Authentication.Handlers;

/// <summary>
/// Handler for reset password command
/// </summary>
public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, BaseResponse>
{
    private readonly UserManager<User> _userManager;
    private readonly ILogger<ResetPasswordCommandHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the ResetPasswordCommandHandler
    /// </summary>
    /// <param name="userManager">User manager</param>
    /// <param name="logger">Logger</param>
    public ResetPasswordCommandHandler(
        UserManager<User> userManager,
        ILogger<ResetPasswordCommandHandler> logger)
    {
        _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Handles the reset password command
    /// </summary>
    /// <param name="request">Reset password command</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Response indicating success or failure</returns>
    public async Task<BaseResponse> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Password reset attempt for email: {Email}", request.Email);

            // Find user by email
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                _logger.LogWarning("Password reset failed: User not found for email {Email}", request.Email);
                return BaseResponse.Failure("Invalid reset token or email address", new Dictionary<string, object>
                {
                    ["errorCode"] = "INVALID_RESET_TOKEN_OR_EMAIL"
                });
            }

            // Check if email is confirmed
            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                _logger.LogWarning("Password reset failed: Email not confirmed for {Email}", request.Email);
                return BaseResponse.Failure("Email address must be confirmed before resetting password",
                    new Dictionary<string, object>
                    {
                        ["errorCode"] = "EMAIL_NOT_CONFIRMED"
                    });
            }

            // Reset password using the token
            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogWarning("Password reset failed for user {UserId}: {Errors}", user.Id, errors);

                // Check if the error is related to invalid token
                if (result.Errors.Any(e => e.Code.Contains("InvalidToken")))
                    return BaseResponse.Failure("Invalid or expired reset token", new Dictionary<string, object>
                    {
                        ["errorCode"] = "INVALID_RESET_TOKEN"
                    });

                return BaseResponse.Failure("Password reset failed", new Dictionary<string, object>
                {
                    ["errorCode"] = "PASSWORD_RESET_FAILED"
                });
            }

            // Update security stamp to invalidate existing tokens
            await _userManager.UpdateSecurityStampAsync(user);

            _logger.LogInformation("Password reset successful for user: {UserId}", user.Id);
            return new BaseResponse
            {
                IsSuccess = true,
                StatusCode = 200,
                Message = "Password has been reset successfully"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset for email: {Email}", request.Email);
            return BaseResponse.Failure("An error occurred during password reset. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }
}