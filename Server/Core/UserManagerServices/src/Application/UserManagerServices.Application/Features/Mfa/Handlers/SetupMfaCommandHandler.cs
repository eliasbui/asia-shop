using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Mfa.Commands;
using UserManagerServices.Application.Features.Mfa.Responses;

namespace UserManagerServices.Application.Features.Mfa.Handlers;

/// <summary>
/// Handler for MFA setup command
/// </summary>
public class SetupMfaCommandHandler : IRequestHandler<SetupMfaCommand, BaseResponse<MfaSetupResponse>>
{
    private readonly IMfaService _mfaService;
    private readonly ITotpService _totpService;
    private readonly ILogger<SetupMfaCommandHandler> _logger;

    public SetupMfaCommandHandler(
        IMfaService mfaService,
        ITotpService totpService,
        ILogger<SetupMfaCommandHandler> logger)
    {
        _mfaService = mfaService ?? throw new ArgumentNullException(nameof(mfaService));
        _totpService = totpService ?? throw new ArgumentNullException(nameof(totpService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BaseResponse<MfaSetupResponse>> Handle(SetupMfaCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Setting up MFA for user {UserId}", request.UserId);

            // Check if MFA is already enabled
            var isEnabled = await _mfaService.IsMfaEnabledAsync(request.UserId, cancellationToken);
            if (isEnabled)
            {
                return BaseResponse<MfaSetupResponse>.Failure("MFA is already enabled for this user");
            }

            // Setup TOTP
            var (secretKey, qrCodeUri) = await _mfaService.SetupTotpAsync(request.UserId, cancellationToken);

            var response = new MfaSetupResponse
            {
                SecretKey = secretKey,
                QrCodeUri = qrCodeUri,
                FormattedSecretKey = _totpService.FormatSecretKeyForBackup(secretKey),
                Instructions = "Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.) or manually enter the secret key. Then verify with a 6-digit code to complete setup.",
                IsSuccess = true,
                NextStep = "Verify TOTP code to complete setup"
            };

            _logger.LogInformation("MFA setup initiated successfully for user {UserId}", request.UserId);
            return BaseResponse<MfaSetupResponse>.Success(response, "MFA setup initiated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting up MFA for user {UserId}", request.UserId);
            return BaseResponse<MfaSetupResponse>.Failure("An error occurred while setting up MFA");
        }
    }
}
