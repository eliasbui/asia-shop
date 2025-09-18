#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Mfa.Commands;
using UserManagerServices.Application.Features.Mfa.Responses;

namespace UserManagerServices.Application.Features.Mfa.Handlers;

/// <summary>
/// Handler for MFA enable command
/// </summary>
public class EnableMfaCommandHandler(
    IMfaService mfaService,
    ILogger<EnableMfaCommandHandler> logger)
    : IRequestHandler<EnableMfaCommand, BaseResponse<MfaEnableResponse>>
{
    private readonly IMfaService _mfaService = mfaService ?? throw new ArgumentNullException(nameof(mfaService));

    private readonly ILogger<EnableMfaCommandHandler> _logger =
        logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<BaseResponse<MfaEnableResponse>> Handle(EnableMfaCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Enabling MFA for user {UserId}", request.UserId);

            var isValidSetup =
                await _mfaService.VerifyTotpSetupAsync(request.UserId, request.TotpCode, null, cancellationToken);
            if (!isValidSetup)
                return BaseResponse<MfaEnableResponse>.Failure(
                    "Invalid TOTP code. Please check your authenticator app and try again.");

            var (mfaSettings, backupCodes) =
                await _mfaService.EnableMfaAsync(request.UserId, request.TotpCode, cancellationToken);

            var response = new MfaEnableResponse
            {
                IsEnabled = true,
                BackupCodes = backupCodes,
                BackupCodesCount = backupCodes.Count,
                EnabledAt = mfaSettings.EnabledAt ?? DateTime.UtcNow
            };

            _logger.LogInformation("MFA enabled successfully for user {UserId}", request.UserId);
            return BaseResponse<MfaEnableResponse>.Success(response,
                "MFA has been enabled successfully. Please save your backup codes in a secure location.");
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation while enabling MFA for user {UserId}", request.UserId);
            return BaseResponse<MfaEnableResponse>.Failure(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enabling MFA for user {UserId}", request.UserId);
            return BaseResponse<MfaEnableResponse>.Failure("An error occurred while enabling MFA");
        }
    }
}