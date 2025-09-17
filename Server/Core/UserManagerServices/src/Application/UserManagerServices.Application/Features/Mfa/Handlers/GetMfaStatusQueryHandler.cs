using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Mfa.Queries;

namespace UserManagerServices.Application.Features.Mfa.Handlers;

/// <summary>
/// Handler for getting MFA status query
/// </summary>
public class GetMfaStatusQueryHandler : IRequestHandler<GetMfaStatusQuery, BaseResponse<MfaStatusResponse>>
{
    private readonly IMfaService _mfaService;
    private readonly ILogger<GetMfaStatusQueryHandler> _logger;

    public GetMfaStatusQueryHandler(
        IMfaService mfaService,
        ILogger<GetMfaStatusQueryHandler> logger)
    {
        _mfaService = mfaService ?? throw new ArgumentNullException(nameof(mfaService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BaseResponse<MfaStatusResponse>> Handle(GetMfaStatusQuery request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Getting MFA status for user {UserId}", request.UserId);

            // Get MFA settings
            var mfaSettings = await _mfaService.GetMfaSettingsAsync(request.UserId, cancellationToken);
            
            var response = new MfaStatusResponse();

            if (mfaSettings != null)
            {
                response.IsEnabled = mfaSettings.IsEnabled;
                response.IsEnforced = mfaSettings.IsEnforced;
                response.IsTotpEnabled = mfaSettings.IsTotpEnabled;
                response.IsEmailOtpEnabled = mfaSettings.IsEmailOtpEnabled;
                response.IsBackupCodesEnabled = mfaSettings.IsBackupCodesEnabled;
                response.BackupCodesRemaining = mfaSettings.BackupCodesRemaining;
                response.EnabledAt = mfaSettings.EnabledAt;
                response.LastUsedAt = mfaSettings.LastUsedAt;
                response.EnforcementGracePeriodEnd = mfaSettings.EnforcementGracePeriodEnd;

                // Build available methods list
                if (mfaSettings.IsTotpEnabled)
                    response.AvailableMethods.Add("TOTP");
                if (mfaSettings.IsEmailOtpEnabled)
                    response.AvailableMethods.Add("EmailOTP");
                if (mfaSettings.IsBackupCodesEnabled && mfaSettings.BackupCodesRemaining > 0)
                    response.AvailableMethods.Add("BackupCode");
            }
            else
            {
                // No MFA settings found - all disabled
                response.IsEnabled = false;
                response.IsEnforced = false;
                response.IsTotpEnabled = false;
                response.IsEmailOtpEnabled = false;
                response.IsBackupCodesEnabled = false;
                response.BackupCodesRemaining = 0;
                response.AvailableMethods = new List<string>();
            }

            _logger.LogInformation("Retrieved MFA status for user {UserId}: Enabled={IsEnabled}, Enforced={IsEnforced}", 
                request.UserId, response.IsEnabled, response.IsEnforced);

            return BaseResponse<MfaStatusResponse>.Success(response, "MFA status retrieved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting MFA status for user {UserId}", request.UserId);
            return BaseResponse<MfaStatusResponse>.Failure("An error occurred while retrieving MFA status");
        }
    }
}
