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

namespace UserManagerServices.Application.Features.Mfa.Handlers;

/// <summary>
/// Handler for MFA verification command
/// </summary>
public class VerifyMfaCommandHandler : IRequestHandler<VerifyMfaCommand, BaseResponse<bool>>
{
    private readonly IMfaService _mfaService;
    private readonly ILogger<VerifyMfaCommandHandler> _logger;

    public VerifyMfaCommandHandler(
        IMfaService mfaService,
        ILogger<VerifyMfaCommandHandler> logger)
    {
        _mfaService = mfaService ?? throw new ArgumentNullException(nameof(mfaService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BaseResponse<bool>> Handle(VerifyMfaCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Verifying MFA for user {UserId} using method {MfaType}",
                request.UserId, request.MfaType);

            var isValid = false;
            var method = request.MfaType.ToUpper();

            switch (method)
            {
                case "TOTP":
                    isValid = await _mfaService.VerifyTotpAsync(request.UserId, request.MfaCode,
                        request.IpAddress, request.UserAgent, cancellationToken);
                    break;

                case "BACKUPCODE":
                    isValid = await _mfaService.VerifyBackupCodeAsync(request.UserId, request.MfaCode,
                        request.IpAddress, request.UserAgent, cancellationToken);
                    break;

                case "EMAILOTP":
                    isValid = await _mfaService.VerifyEmailOtpAsync(request.UserId, request.MfaCode,
                        request.IpAddress, request.UserAgent, cancellationToken);
                    break;

                default:
                    _logger.LogWarning("Invalid MFA type {MfaType} for user {UserId}", request.MfaType, request.UserId);
                    return BaseResponse<bool>.Failure("Invalid MFA verification method");
            }

            if (isValid)
            {
                _logger.LogInformation("MFA verification successful for user {UserId} using {MfaType}",
                    request.UserId, request.MfaType);
                return BaseResponse<bool>.Success(true, "MFA verification successful");
            }
            else
            {
                _logger.LogWarning("MFA verification failed for user {UserId} using {MfaType}",
                    request.UserId, request.MfaType);
                return BaseResponse<bool>.Failure("Invalid MFA code");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying MFA for user {UserId}", request.UserId);
            return BaseResponse<bool>.Failure("An error occurred during MFA verification");
        }
    }
}