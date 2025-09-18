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
/// Handler for generating backup codes command
/// </summary>
public class GenerateBackupCodesCommandHandler : IRequestHandler<GenerateBackupCodesCommand, BaseResponse<List<string>>>
{
    private readonly IMfaService _mfaService;
    private readonly ILogger<GenerateBackupCodesCommandHandler> _logger;

    public GenerateBackupCodesCommandHandler(
        IMfaService mfaService,
        ILogger<GenerateBackupCodesCommandHandler> logger)
    {
        _mfaService = mfaService ?? throw new ArgumentNullException(nameof(mfaService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BaseResponse<List<string>>> Handle(GenerateBackupCodesCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Generating backup codes for user {UserId}", request.UserId);

            // Check if MFA is enabled
            var isEnabled = await _mfaService.IsMfaEnabledAsync(request.UserId, cancellationToken);
            if (!isEnabled)
                return BaseResponse<List<string>>.Failure("MFA must be enabled before generating backup codes");

            // Generate backup codes
            var backupCodes =
                await _mfaService.GenerateBackupCodesAsync(request.UserId, request.Count, cancellationToken);

            _logger.LogInformation("Generated {Count} backup codes for user {UserId}", backupCodes.Count,
                request.UserId);
            return BaseResponse<List<string>>.Success(backupCodes,
                $"Generated {backupCodes.Count} backup codes successfully");
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation while generating backup codes for user {UserId}", request.UserId);
            return BaseResponse<List<string>>.Failure(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating backup codes for user {UserId}", request.UserId);
            return BaseResponse<List<string>>.Failure("An error occurred while generating backup codes");
        }
    }
}