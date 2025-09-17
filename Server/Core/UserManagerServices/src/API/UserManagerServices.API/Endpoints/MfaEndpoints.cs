using MediatR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using UserManagerServices.Application.Features.Mfa.Commands;
using UserManagerServices.Application.Features.Mfa.Queries;
using UserManagerServices.Application.Features.Mfa.Responses;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.API.Common;

namespace UserManagerServices.API.Endpoints;

/// <summary>
/// Multi-Factor Authentication endpoints
/// </summary>
public static class MfaEndpoints
{
    /// <summary>
    /// Maps MFA endpoints to the application
    /// </summary>
    /// <param name="app">Web application</param>
    /// <returns>Web application with MFA endpoints mapped</returns>
    public static WebApplication MapMfaEndpoints(this WebApplication app)
    {
        var mfaGroup = app.MapGroup("/api/mfa")
            .WithTags("MFA")
            .WithOpenApi();

        // Setup MFA - Initiate TOTP setup
        mfaGroup.MapPost("/setup", SetupMfa)
            .RequireAuthorization()
            .WithName("SetupMfa")
            .WithSummary("Setup MFA for the current user")
            .WithDescription("Initiates MFA setup by generating TOTP secret and QR code")
            .Produces<BaseResponse<MfaSetupResponse>>(200)
            .Produces<BaseResponse<MfaSetupResponse>>(400)
            .Produces(401);

        // Enable MFA - Complete setup with TOTP verification
        mfaGroup.MapPost("/enable", EnableMfa)
            .RequireAuthorization()
            .WithName("EnableMfa")
            .WithSummary("Enable MFA for the current user")
            .WithDescription("Enables MFA after verifying TOTP code and returns backup codes")
            .Produces<BaseResponse<MfaEnableResponse>>(200)
            .Produces<BaseResponse<MfaEnableResponse>>(400)
            .Produces(401);

        // Verify MFA - Used during login process
        mfaGroup.MapPost("/verify", VerifyMfa)
            .AllowAnonymous()
            .WithName("VerifyMfa")
            .WithSummary("Verify MFA code during authentication")
            .WithDescription("Verifies MFA code (TOTP, backup code, or email OTP) during login")
            .Produces<BaseResponse<bool>>(200)
            .Produces<BaseResponse<bool>>(400);

        // Disable MFA
        mfaGroup.MapPost("/disable", DisableMfa)
            .RequireAuthorization()
            .WithName("DisableMfa")
            .WithSummary("Disable MFA for the current user")
            .WithDescription("Disables MFA after verifying current password and MFA code")
            .Produces<BaseResponse<bool>>(200)
            .Produces<BaseResponse<bool>>(400)
            .Produces(401);

        // Generate backup codes
        mfaGroup.MapPost("/backup-codes/generate", GenerateBackupCodes)
            .RequireAuthorization()
            .WithName("GenerateBackupCodes")
            .WithSummary("Generate new backup codes")
            .WithDescription("Generates new backup codes for the current user")
            .Produces<BaseResponse<List<string>>>(200)
            .Produces<BaseResponse<List<string>>>(400)
            .Produces(401);

        // Get MFA status
        mfaGroup.MapGet("/status", GetMfaStatus)
            .RequireAuthorization()
            .WithName("GetMfaStatus")
            .WithSummary("Get MFA status for the current user")
            .WithDescription("Returns current MFA configuration and status")
            .Produces<BaseResponse<MfaStatusResponse>>(200)
            .Produces(401);

        // Send email OTP
        mfaGroup.MapPost("/email-otp/send", SendEmailOtp)
            .AllowAnonymous()
            .WithName("SendEmailOtp")
            .WithSummary("Send email OTP for MFA verification")
            .WithDescription("Sends an OTP code to the user's email for MFA verification")
            .Produces<BaseResponse<bool>>(200)
            .Produces<BaseResponse<bool>>(400);

        return app;
    }

    #region Endpoint Handlers

    /// <summary>
    /// Setup MFA endpoint handler
    /// </summary>
    private static async Task<IResult> SetupMfa(
        HttpContext context,
        IMediator mediator,
        ILogger<Program> logger)
    {
        try
        {
            var userId = ApiHelpers.GetCurrentUserId(context);
            var command = new SetupMfaCommand { UserId = userId };

            var result = await mediator.Send(command);

            return result.IsSuccess
                ? Results.Ok(result)
                : Results.BadRequest(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Results.Unauthorized();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error setting up MFA");
            return Results.StatusCode(500);
        }
    }

    /// <summary>
    /// Enable MFA endpoint handler
    /// </summary>
    private static async Task<IResult> EnableMfa(
        EnableMfaRequest request,
        HttpContext context,
        IMediator mediator,
        ILogger<Program> logger)
    {
        try
        {
            var userId = ApiHelpers.GetCurrentUserId(context);
            var command = new EnableMfaCommand
            {
                UserId = userId,
                TotpCode = request.TotpCode
            };

            var result = await mediator.Send(command);

            return result.IsSuccess
                ? Results.Ok(result)
                : Results.BadRequest(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Results.Unauthorized();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error enabling MFA");
            return Results.StatusCode(500);
        }
    }

    /// <summary>
    /// Verify MFA endpoint handler
    /// </summary>
    private static async Task<IResult> VerifyMfa(
        VerifyMfaRequest request,
        HttpContext context,
        IMediator mediator,
        ILogger<Program> logger)
    {
        try
        {
            var command = new VerifyMfaCommand
            {
                UserId = request.UserId,
                MfaCode = request.MfaCode,
                MfaType = request.MfaType,
                IpAddress = ApiHelpers.GetClientIpAddress(context),
                UserAgent = context.Request.Headers["User-Agent"].ToString()
            };

            var result = await mediator.Send(command);

            return result.IsSuccess
                ? Results.Ok(result)
                : Results.BadRequest(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error verifying MFA");
            return Results.StatusCode(500);
        }
    }

    /// <summary>
    /// Disable MFA endpoint handler
    /// </summary>
    private static async Task<IResult> DisableMfa(
        DisableMfaRequest request,
        HttpContext context,
        IMediator mediator,
        ILogger<Program> logger)
    {
        try
        {
            var userId = ApiHelpers.GetCurrentUserId(context);
            var command = new DisableMfaCommand
            {
                UserId = userId,
                CurrentPassword = request.CurrentPassword,
                MfaCode = request.MfaCode,
                Reason = request.Reason,
                IpAddress = ApiHelpers.GetClientIpAddress(context),
                UserAgent = context.Request.Headers["User-Agent"].ToString()
            };

            var result = await mediator.Send(command);

            return result.IsSuccess
                ? Results.Ok(result)
                : Results.BadRequest(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Results.Unauthorized();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error disabling MFA");
            return Results.StatusCode(500);
        }
    }

    /// <summary>
    /// Generate backup codes endpoint handler
    /// </summary>
    private static async Task<IResult> GenerateBackupCodes(
        HttpContext context,
        IMediator mediator,
        ILogger<Program> logger)
    {
        try
        {
            var userId = ApiHelpers.GetCurrentUserId(context);
            var command = new GenerateBackupCodesCommand
            {
                UserId = userId,
                GeneratedBy = userId,
                Reason = "User requested new backup codes"
            };

            var result = await mediator.Send(command);

            return result.IsSuccess
                ? Results.Ok(result)
                : Results.BadRequest(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Results.Unauthorized();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating backup codes");
            return Results.StatusCode(500);
        }
    }

    /// <summary>
    /// Get MFA status endpoint handler
    /// </summary>
    private static async Task<IResult> GetMfaStatus(
        HttpContext context,
        IMediator mediator,
        ILogger<Program> logger)
    {
        try
        {
            var userId = ApiHelpers.GetCurrentUserId(context);
            var query = new GetMfaStatusQuery { UserId = userId };

            var result = await mediator.Send(query);

            return result.IsSuccess
                ? Results.Ok(result)
                : Results.BadRequest(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Results.Unauthorized();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting MFA status");
            return Results.StatusCode(500);
        }
    }

    /// <summary>
    /// Send email OTP endpoint handler
    /// </summary>
    private static async Task<IResult> SendEmailOtp(
        SendEmailOtpRequest request,
        HttpContext context,
        IMediator mediator,
        ILogger<Program> logger)
    {
        try
        {
            var command = new SendEmailOtpCommand
            {
                UserId = request.UserId,
                Purpose = request.Purpose ?? "MFA",
                IpAddress = ApiHelpers.GetClientIpAddress(context),
                UserAgent = context.Request.Headers["User-Agent"].ToString()
            };

            var result = await mediator.Send(command);

            return result.IsSuccess
                ? Results.Ok(result)
                : Results.BadRequest(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error sending email OTP");
            return Results.StatusCode(500);
        }
    }

    #endregion
}

#region Request Models

/// <summary>
/// Request model for enabling MFA
/// </summary>
public record EnableMfaRequest(string TotpCode);

/// <summary>
/// Request model for verifying MFA
/// </summary>
public record VerifyMfaRequest(Guid UserId, string MfaCode, string MfaType);

/// <summary>
/// Request model for disabling MFA
/// </summary>
public record DisableMfaRequest(string CurrentPassword, string MfaCode, string? Reason = null);

/// <summary>
/// Request model for sending email OTP
/// </summary>
public record SendEmailOtpRequest(Guid UserId, string? Purpose = "MFA");

#endregion