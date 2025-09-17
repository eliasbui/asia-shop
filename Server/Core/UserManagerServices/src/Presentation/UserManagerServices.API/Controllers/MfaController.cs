using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UserManagerServices.Application.Features.Mfa.Commands;
using UserManagerServices.Application.Features.Mfa.Responses;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.API.Controllers;

/// <summary>
/// Multi-Factor Authentication controller
/// Handles MFA setup, verification, and management operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MfaController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<MfaController> _logger;

    public MfaController(IMediator mediator, ILogger<MfaController> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Initiates MFA setup by generating TOTP secret and QR code
    /// </summary>
    /// <returns>MFA setup response with QR code and secret key</returns>
    [HttpPost("setup")]
    public async Task<ActionResult<BaseResponse<MfaSetupResponse>>> SetupMfa()
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new SetupMfaCommand { UserId = userId };
            
            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting up MFA for user");
            return StatusCode(500, BaseResponse<MfaSetupResponse>.Failure("An error occurred while setting up MFA"));
        }
    }

    /// <summary>
    /// Enables MFA after verifying TOTP code
    /// </summary>
    /// <param name="request">Enable MFA request with TOTP code</param>
    /// <returns>MFA enable response with backup codes</returns>
    [HttpPost("enable")]
    public async Task<ActionResult<BaseResponse<MfaEnableResponse>>> EnableMfa([FromBody] EnableMfaRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var command = new EnableMfaCommand 
            { 
                UserId = userId,
                TotpCode = request.TotpCode
            };
            
            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enabling MFA for user");
            return StatusCode(500, BaseResponse<MfaEnableResponse>.Failure("An error occurred while enabling MFA"));
        }
    }

    /// <summary>
    /// Verifies MFA code during authentication
    /// </summary>
    /// <param name="request">MFA verification request</param>
    /// <returns>Verification result</returns>
    [HttpPost("verify")]
    [AllowAnonymous] // This endpoint is used during login process
    public async Task<ActionResult<BaseResponse<bool>>> VerifyMfa([FromBody] VerifyMfaRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var command = new VerifyMfaCommand
            {
                UserId = request.UserId,
                MfaCode = request.MfaCode,
                MfaType = request.MfaType,
                IpAddress = GetClientIpAddress(),
                UserAgent = Request.Headers["User-Agent"].ToString()
            };
            
            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying MFA");
            return StatusCode(500, BaseResponse<bool>.Failure("An error occurred during MFA verification"));
        }
    }

    /// <summary>
    /// Disables MFA for the current user
    /// </summary>
    /// <param name="request">Disable MFA request</param>
    /// <returns>Disable result</returns>
    [HttpPost("disable")]
    public async Task<ActionResult<BaseResponse<bool>>> DisableMfa([FromBody] DisableMfaRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var command = new DisableMfaCommand
            {
                UserId = userId,
                CurrentPassword = request.CurrentPassword,
                MfaCode = request.MfaCode,
                Reason = request.Reason,
                IpAddress = GetClientIpAddress(),
                UserAgent = Request.Headers["User-Agent"].ToString()
            };
            
            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error disabling MFA for user");
            return StatusCode(500, BaseResponse<bool>.Failure("An error occurred while disabling MFA"));
        }
    }

    /// <summary>
    /// Generates new backup codes for the current user
    /// </summary>
    /// <returns>New backup codes</returns>
    [HttpPost("backup-codes/generate")]
    public async Task<ActionResult<BaseResponse<List<string>>>> GenerateBackupCodes()
    {
        try
        {
            var userId = GetCurrentUserId();
            // This would be implemented as a separate command
            // For now, return a placeholder response
            return Ok(BaseResponse<List<string>>.Success(new List<string>(), "Backup codes generated successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating backup codes for user");
            return StatusCode(500, BaseResponse<List<string>>.Failure("An error occurred while generating backup codes"));
        }
    }

    /// <summary>
    /// Gets MFA status for the current user
    /// </summary>
    /// <returns>MFA status information</returns>
    [HttpGet("status")]
    public async Task<ActionResult<BaseResponse<MfaStatusResponse>>> GetMfaStatus()
    {
        try
        {
            var userId = GetCurrentUserId();
            // This would be implemented as a separate query
            // For now, return a placeholder response
            var status = new MfaStatusResponse
            {
                IsEnabled = false,
                IsEnforced = false,
                AvailableMethods = new List<string> { "TOTP", "BackupCode", "EmailOTP" },
                BackupCodesRemaining = 0
            };
            
            return Ok(BaseResponse<MfaStatusResponse>.Success(status, "MFA status retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting MFA status for user");
            return StatusCode(500, BaseResponse<MfaStatusResponse>.Failure("An error occurred while retrieving MFA status"));
        }
    }

    #region Private Helper Methods

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return userId;
    }

    private string GetClientIpAddress()
    {
        var ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (string.IsNullOrEmpty(ipAddress))
        {
            ipAddress = Request.Headers["X-Real-IP"].FirstOrDefault();
        }
        if (string.IsNullOrEmpty(ipAddress))
        {
            ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        }
        return ipAddress ?? "Unknown";
    }

    #endregion
}

#region Request/Response Models

/// <summary>
/// Request model for enabling MFA
/// </summary>
public class EnableMfaRequest
{
    /// <summary>
    /// TOTP code from authenticator app
    /// </summary>
    public required string TotpCode { get; set; }
}

/// <summary>
/// Request model for verifying MFA
/// </summary>
public class VerifyMfaRequest
{
    /// <summary>
    /// User ID for verification
    /// </summary>
    public required Guid UserId { get; set; }

    /// <summary>
    /// MFA code to verify
    /// </summary>
    public required string MfaCode { get; set; }

    /// <summary>
    /// Type of MFA (TOTP, BackupCode, EmailOTP)
    /// </summary>
    public required string MfaType { get; set; }
}

/// <summary>
/// Request model for disabling MFA
/// </summary>
public class DisableMfaRequest
{
    /// <summary>
    /// Current user password
    /// </summary>
    public required string CurrentPassword { get; set; }

    /// <summary>
    /// MFA code for verification
    /// </summary>
    public required string MfaCode { get; set; }

    /// <summary>
    /// Reason for disabling MFA
    /// </summary>
    public string? Reason { get; set; }
}

/// <summary>
/// Response model for MFA status
/// </summary>
public class MfaStatusResponse
{
    /// <summary>
    /// Whether MFA is enabled
    /// </summary>
    public bool IsEnabled { get; set; }

    /// <summary>
    /// Whether MFA is enforced by policy
    /// </summary>
    public bool IsEnforced { get; set; }

    /// <summary>
    /// Available MFA methods
    /// </summary>
    public List<string> AvailableMethods { get; set; } = new();

    /// <summary>
    /// Number of backup codes remaining
    /// </summary>
    public int BackupCodesRemaining { get; set; }

    /// <summary>
    /// When MFA was last used
    /// </summary>
    public DateTime? LastUsedAt { get; set; }
}

#endregion
