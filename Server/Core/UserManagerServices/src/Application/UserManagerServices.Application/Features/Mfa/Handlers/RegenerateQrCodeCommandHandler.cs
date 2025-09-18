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
/// Handler for regenerating QR code command when expired
/// </summary>
public class RegenerateQrCodeCommandHandler(
    IMfaService mfaService,
    ITotpService totpService,
    ILogger<RegenerateQrCodeCommandHandler> logger)
    : IRequestHandler<RegenerateQrCodeCommand, BaseResponse<MfaSetupResponse>>
{
    private readonly IMfaService _mfaService = mfaService ?? throw new ArgumentNullException(nameof(mfaService));
    private readonly ITotpService _totpService = totpService ?? throw new ArgumentNullException(nameof(totpService));
    private readonly ILogger<RegenerateQrCodeCommandHandler> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    public async Task<BaseResponse<MfaSetupResponse>> Handle(RegenerateQrCodeCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Regenerating QR code for user {UserId} with session {SessionId}",
                request.UserId, request.SetupSessionId);

            // Check if MFA is already enabled
            var isEnabled = await _mfaService.IsMfaEnabledAsync(request.UserId, cancellationToken);
            if (isEnabled)
                return BaseResponse<MfaSetupResponse>.Failure("MFA is already enabled for this user");

            // Regenerate QR code
            var (secretKey, qrCodeUri, setupSessionId) = await _mfaService.RegenerateQrCodeAsync(
                request.UserId, request.SetupSessionId, cancellationToken);

            var expiresAt = DateTime.UtcNow.AddSeconds(60);
            var response = new MfaSetupResponse
            {
                SecretKey = secretKey,
                QrCodeUri = qrCodeUri,
                FormattedSecretKey = _totpService.FormatSecretKeyForBackup(secretKey),
                Instructions =
                    "Scan the QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, etc.) or manually enter the secret key. Then verify with a 6-digit code to complete setup. This QR code will expire in 60 seconds.",
                IsSuccess = true,
                NextStep = "Verify TOTP code to complete setup",
                ExpiresAt = expiresAt,
                SetupSessionId = setupSessionId,
                ExpiresInSeconds = 60
            };

            _logger.LogInformation("QR code regenerated successfully for user {UserId} with new session {SessionId}",
                request.UserId, setupSessionId);
            return BaseResponse<MfaSetupResponse>.Success(response, "QR code regenerated successfully");
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation while regenerating QR code for user {UserId}", request.UserId);
            return BaseResponse<MfaSetupResponse>.Failure(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error regenerating QR code for user {UserId}", request.UserId);
            return BaseResponse<MfaSetupResponse>.Failure("An error occurred while regenerating QR code");
        }
    }
}
