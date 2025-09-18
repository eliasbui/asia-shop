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
using UserManagerServices.Application.Features.Mfa.Commands;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Features.Mfa.Handlers;

/// <summary>
/// Handler for MFA disable command
/// </summary>
public class DisableMfaCommandHandler : IRequestHandler<DisableMfaCommand, BaseResponse<bool>>
{
    private readonly IMfaService _mfaService;
    private readonly UserManager<User> _userManager;
    private readonly ILogger<DisableMfaCommandHandler> _logger;

    public DisableMfaCommandHandler(
        IMfaService mfaService,
        UserManager<User> userManager,
        ILogger<DisableMfaCommandHandler> logger)
    {
        _mfaService = mfaService ?? throw new ArgumentNullException(nameof(mfaService));
        _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BaseResponse<bool>> Handle(DisableMfaCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Disabling MFA for user {UserId}", request.UserId);

            // Verify user exists
            var user = await _userManager.FindByIdAsync(request.UserId.ToString());
            if (user == null) return BaseResponse<bool>.Failure("User not found");

            // Check if MFA is enforced
            var isEnforced = await _mfaService.IsMfaEnforcedAsync(request.UserId, cancellationToken);
            if (isEnforced) return BaseResponse<bool>.Failure("MFA is enforced by policy and cannot be disabled");

            // Verify current password
            var passwordValid = await _userManager.CheckPasswordAsync(user, request.CurrentPassword);
            if (!passwordValid) return BaseResponse<bool>.Failure("Invalid current password");

            // Verify MFA code (either TOTP or backup code)
            var mfaValid = false;

            // Try TOTP first
            mfaValid = await _mfaService.VerifyTotpAsync(request.UserId, request.MfaCode,
                request.IpAddress, request.UserAgent, cancellationToken);

            // If TOTP fails, try backup code
            if (!mfaValid)
                mfaValid = await _mfaService.VerifyBackupCodeAsync(request.UserId, request.MfaCode,
                    request.IpAddress, request.UserAgent, cancellationToken);

            if (!mfaValid) return BaseResponse<bool>.Failure("Invalid MFA code");

            // Disable MFA
            var success = await _mfaService.DisableMfaAsync(request.UserId, request.Reason,
                request.DisabledBy, cancellationToken);

            if (success)
            {
                _logger.LogInformation("MFA disabled successfully for user {UserId}", request.UserId);
                return BaseResponse<bool>.Success(true, "MFA has been disabled successfully");
            }
            else
            {
                return BaseResponse<bool>.Failure("Failed to disable MFA");
            }
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation while disabling MFA for user {UserId}", request.UserId);
            return BaseResponse<bool>.Failure(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error disabling MFA for user {UserId}", request.UserId);
            return BaseResponse<bool>.Failure("An error occurred while disabling MFA");
        }
    }
}