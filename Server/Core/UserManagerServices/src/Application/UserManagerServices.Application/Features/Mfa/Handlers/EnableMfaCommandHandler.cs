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
public class EnableMfaCommandHandler : IRequestHandler<EnableMfaCommand, BaseResponse<MfaEnableResponse>>
{
    private readonly IMfaService _mfaService;
    private readonly ILogger<EnableMfaCommandHandler> _logger;

    public EnableMfaCommandHandler(
        IMfaService mfaService,
        ILogger<EnableMfaCommandHandler> logger)
    {
        _mfaService = mfaService ?? throw new ArgumentNullException(nameof(mfaService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BaseResponse<MfaEnableResponse>> Handle(EnableMfaCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Enabling MFA for user {UserId}", request.UserId);

            // Verify TOTP setup first
            var isValidSetup =
                await _mfaService.VerifyTotpSetupAsync(request.UserId, request.TotpCode, cancellationToken);
            if (!isValidSetup)
                return BaseResponse<MfaEnableResponse>.Failure(
                    "Invalid TOTP code. Please check your authenticator app and try again.");

            // Enable MFA and generate backup codes
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