#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Features.Mfa.Commands;
using UserManagerServices.Application.Features.Mfa.Queries;
using UserManagerServices.Application.Features.Mfa.Responses;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.API.Common;
using Microsoft.OpenApi.Models;
using UserManagerServices.API.Records;

namespace UserManagerServices.API.Endpoints.v1;

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
        var mfaGroup = app.MapGroup("api/v1/mfa")
            .WithTags("MFA")
            .WithOpenApi();

        // Setup MFA - Initiate TOTP setup
        mfaGroup.MapPost("/setup", SetupMfa)
            .RequireAuthorization()
            .WithName("SetupMfa")
            .WithSummary("Setup MFA for the current user")
            .WithDescription("Initiates MFA setup by generating TOTP secret and QR code")
            .Produces<BaseResponse<MfaSetupResponse>>()
            .Produces<BaseResponse<MfaSetupResponse>>(400)
            .Produces(401)
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Setup MFA for the current user",
                Description = "Initiates MFA setup by generating TOTP secret and QR code",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "MFA setup successful" },
                    ["400"] = new OpenApiResponse { Description = "Invalid request or validation errors" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" }
                }
            });

        // Enable MFA - Complete setup with TOTP verification
        mfaGroup.MapPost("/enable", EnableMfa)
            .RequireAuthorization()
            .WithName("EnableMfa")
            .WithSummary("Enable MFA for the current user")
            .WithDescription("Enables MFA after verifying TOTP code and returns backup codes")
            .Produces<BaseResponse<MfaEnableResponse>>()
            .Produces<BaseResponse<MfaEnableResponse>>(400)
            .Produces(401)
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Enable MFA for the current user",
                Description = "Enables MFA after verifying TOTP code and returns backup codes",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "MFA enabled successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid request or validation errors" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" }
                }
            });

        // Verify MFA - Used during login process
        mfaGroup.MapPost("/verify", VerifyMfa)
            .AllowAnonymous()
            .WithName("VerifyMfa")
            .WithSummary("Verify MFA code during authentication")
            .WithDescription("Verifies MFA code (TOTP, backup code, or email OTP) during login")
            .Produces<BaseResponse<bool>>()
            .Produces<BaseResponse<bool>>(400)
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Verify MFA code during authentication",
                Description = "Verifies MFA code (TOTP, backup code, or email OTP) during login",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "MFA code verified successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid request or validation errors" }
                }
            });

        // Disable MFA
        mfaGroup.MapPost("/disable", DisableMfa)
            .RequireAuthorization()
            .WithName("DisableMfa")
            .WithSummary("Disable MFA for the current user")
            .WithDescription("Disables MFA after verifying current password and MFA code")
            .Produces<BaseResponse<bool>>()
            .Produces<BaseResponse<bool>>(400)
            .Produces(401)
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Disable MFA for the current user",
                Description = "Disables MFA after verifying current password and MFA code",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "MFA disabled successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid request or validation errors" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" }
                }
            });

        // Generate backup codes
        mfaGroup.MapPost("/backup-codes/generate", GenerateBackupCodes)
            .RequireAuthorization()
            .WithName("GenerateBackupCodes")
            .WithSummary("Generate new backup codes")
            .WithDescription("Generates new backup codes for the current user")
            .Produces<BaseResponse<List<string>>>()
            .Produces<BaseResponse<List<string>>>(400)
            .Produces(401)
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Generate new backup codes",
                Description = "Generates new backup codes for the current user",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "Backup codes generated successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid request or validation errors" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" }
                }
            });

        // Get MFA status
        mfaGroup.MapGet("/status", GetMfaStatus)
            .RequireAuthorization()
            .WithName("GetMfaStatus")
            .WithSummary("Get MFA status for the current user")
            .WithDescription("Returns current MFA configuration and status")
            .Produces<BaseResponse<MfaStatusResponse>>()
            .Produces(401)
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Get MFA status for the current user",
                Description = "Returns current MFA configuration and status",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "MFA status retrieved successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" }
                }
            });

        // Send email OTP
        mfaGroup.MapPost("/email-otp/send", SendEmailOtp)
            .AllowAnonymous()
            .WithName("SendEmailOtp")
            .WithSummary("Send email OTP for MFA verification")
            .WithDescription("Sends an OTP code to the user's email for MFA verification")
            .Produces<BaseResponse<bool>>()
            .Produces<BaseResponse<bool>>(400)
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Send email OTP for MFA verification",
                Description = "Sends an OTP code to the user's email for MFA verification",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "Email OTP sent successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid request or validation errors" }
                }
            });

        // Generate QR code (first time)
        mfaGroup.MapPost("/qr-code/generate", GenerateQrCode)
            .RequireAuthorization()
            .WithName("GenerateQrCode")
            .WithSummary("Generate QR code for MFA setup (first time)")
            .WithDescription("Generates new QR code for MFA setup with 60-second expiration")
            .Produces<BaseResponse<MfaSetupResponse>>()
            .Produces<BaseResponse<MfaSetupResponse>>(400)
            .Produces(401)
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Generate QR code for MFA setup (first time)",
                Description = "Generates new QR code for MFA setup with 60-second expiration",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "QR code generated successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid request or validation errors" },
                    ["401"] = new OpenApiResponse { Description = "Unauthorized" }
                }
            });

        // Regenerate QR code (when expired)
        mfaGroup.MapPost("/qr-code/regenerate", RegenerateQrCode)
            .RequireAuthorization()
            .WithName("RegenerateQrCode")
            .WithSummary("Regenerate QR code when expired")
            .WithDescription("Regenerates QR code with same secret but new 60-second expiration")
            .Produces<BaseResponse<MfaSetupResponse>>()
            .Produces<BaseResponse<MfaSetupResponse>>(400)
            .Produces(401)
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Regenerate QR code when expired",
                Description = "Regenerates QR code with same secret but new 60-second expiration",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "QR code regenerated successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid request or validation errors" },
                    ["401"] = new OpenApiResponse { Description = "Unauthorized" }
                }
            });

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

    /// <summary>
    /// Generate QR code endpoint handler (first time)
    /// </summary>
    private static async Task<IResult> GenerateQrCode(
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
            logger.LogError(ex, "Error generating QR code");
            return Results.StatusCode(500);
        }
    }

    /// <summary>
    /// Regenerate QR code endpoint handler (when expired)
    /// </summary>
    private static async Task<IResult> RegenerateQrCode(
        Records.RegenerateQrCodeRequest request,
        HttpContext context,
        IMediator mediator,
        ILogger<Program> logger)
    {
        try
        {
            var userId = ApiHelpers.GetCurrentUserId(context);
            var command = new RegenerateQrCodeCommand
            {
                UserId = userId,
                SetupSessionId = request.SetupSessionId
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
            logger.LogError(ex, "Error regenerating QR code");
            return Results.StatusCode(500);
        }
    }

    #endregion
}
