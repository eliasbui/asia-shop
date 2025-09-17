using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserManagerServices.API.Common;
using UserManagerServices.API.Models;
using UserManagerServices.Application.Features.Authentication.Commands;

namespace UserManagerServices.API.Endpoints;

/// <summary>
/// Authentication endpoints for user login, logout, and token management
/// Provides secure authentication endpoints with comprehensive logging and validation
/// </summary>
public static class AuthEndpoints
{
    /// <summary>
    /// Maps authentication endpoints to the application
    /// </summary>
    /// <param name="app">Web application</param>
    /// <returns>Web application for chaining</returns>
    [ApiVersion("1.0")]
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var authGroup = app.MapGroup("api/{version:apiVersion}/auth")
            .WithTags("Authentication")
            .WithOpenApi();

        // POST /api/v1/auth/login
        authGroup.MapPost("/login", LoginAsync)
            .WithName("Login")
            .WithSummary("User login")
            .WithDescription(
                "Authenticates a user with email/username and password, returns JWT access token and refresh token")
            .AllowAnonymous()
            .Accepts<LoginCommand>("application/json")
            .Produces<LoginResponse>(200, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(423, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "User login",
                Description =
                    "Authenticates a user with email/username and password, returns JWT access token and refresh token",
                Responses = new()
                {
                    ["200"] = new() { Description = "Login successful" },
                    ["400"] = new() { Description = "Invalid credentials or validation errors" },
                    ["401"] = new() { Description = "Authentication failed" },
                    ["423"] = new() { Description = "Account locked due to multiple failed attempts" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // POST /api/v1/auth/logout
        authGroup.MapPost("/logout", LogoutAsync)
            .WithName("Logout")
            .WithSummary("User logout")
            .WithDescription("Logs out the current user by blacklisting their JWT token")
            .RequireAuthorization()
            .Produces(200, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(400, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "User logout",
                Description = "Logs out the current user by blacklisting their JWT token",
                Responses = new()
                {
                    ["200"] = new() { Description = "Logout successful" },
                    ["400"] = new() { Description = "Invalid token or validation errors" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // POST /api/v1/auth/refresh
        authGroup.MapPost("/refresh", RefreshTokenAsync)
            .WithName("RefreshToken")
            .WithSummary("Refresh JWT token")
            .WithDescription("Generates new JWT access token using a valid refresh token")
            .AllowAnonymous()
            .Accepts<RefreshTokenCommand>("application/json")
            .Produces<LoginResponse>(200, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Refresh JWT token",
                Description = "Generates new JWT access token using a valid refresh token",
                Responses = new()
                {
                    ["200"] = new() { Description = "Token refresh successful" },
                    ["400"] = new() { Description = "Invalid refresh token" },
                    ["401"] = new() { Description = "Refresh token expired or invalid" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // POST /api/v1/auth/change-password
        authGroup.MapPost("/change-password", ChangePasswordAsync)
            .WithName("ChangePassword")
            .WithSummary("Change password")
            .WithDescription("Changes the current user's password")
            .RequireAuthorization()
            .Accepts<ChangePasswordCommand>("application/json")
            .Produces(200, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(400, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Change password",
                Description = "Changes the current user's password",
                Responses = new()
                {
                    ["200"] = new() { Description = "Password changed successfully" },
                    ["400"] = new() { Description = "Invalid current password or validation errors" },
                    ["401"] = new() { Description = "User not authenticated" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // POST /api/v1/auth/forgot-password
        authGroup.MapPost("/forgot-password", ForgotPasswordAsync)
            .WithName("ForgotPassword")
            .WithSummary("Forgot password")
            .WithDescription("Initiates password reset process by sending reset email to the user")
            .AllowAnonymous()
            .Accepts<ForgotPasswordCommand>("application/json")
            .Produces(200, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(400, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Forgot password",
                Description = "Initiates password reset process by sending reset email to the user",
                Responses = new()
                {
                    ["200"] = new() { Description = "Password reset email sent" },
                    ["400"] = new() { Description = "Invalid email or validation errors" },
                    ["404"] = new() { Description = "User not found" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });

        // POST /api/v1/auth/reset-password
        authGroup.MapPost("/reset-password", ResetPasswordAsync)
            .WithName("ResetPassword")
            .WithSummary("Reset password")
            .WithDescription("Resets user password using a valid reset token")
            .AllowAnonymous()
            .Accepts<ResetPasswordCommand>("application/json")
            .Produces(200, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(400, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Reset password",
                Description = "Resets user password using a valid reset token",
                Responses = new()
                {
                    ["200"] = new() { Description = "Password reset successful" },
                    ["400"] = new() { Description = "Invalid reset token or validation errors" },
                    ["500"] = new() { Description = "Internal server error" }
                }
            });
    }

    /// <summary>
    /// Authenticates a user and returns JWT tokens
    /// </summary>
    /// <param name="command">Login credentials</param>
    /// <param name="context">HTTP context</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Authentication response with tokens and user information</returns>
    private static async Task<IResult> LoginAsync(
        [FromBody] LoginCommand command,
        HttpContext context,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        command.IpAddress = ApiHelpers.GetClientIpAddress(context);
        command.UserAgent = ApiHelpers.GetUserAgent(context);

        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Logs out the current user by blacklisting their JWT token
    /// </summary>
    /// <param name="context">HTTP context</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Logout confirmation</returns>
    private static async Task<IResult> LogoutAsync(
        HttpContext context,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var token = ApiHelpers.ExtractTokenFromHeader(context);
        if (string.IsNullOrEmpty(token))
        {
            return Results.BadRequest("No token provided");
        }

        var command = new LogoutCommand
        {
            Token = token,
            UserId = ApiHelpers.GetCurrentUserId(user)
        };

        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Refreshes an expired JWT token using a refresh token
    /// </summary>
    /// <param name="command">Refresh token request</param>
    /// <param name="context">HTTP context</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>New JWT tokens</returns>
    private static async Task<IResult> RefreshTokenAsync(
        [FromBody] RefreshTokenCommand command,
        HttpContext context,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        command.IpAddress = ApiHelpers.GetClientIpAddress(context);
        command.UserAgent = ApiHelpers.GetUserAgent(context);

        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Changes the current user's password
    /// </summary>
    /// <param name="command">Password change request</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Password change confirmation</returns>
    private static async Task<IResult> ChangePasswordAsync(
        [FromBody] ChangePasswordCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        command.UserId = ApiHelpers.GetCurrentUserId(user) ?? Guid.Empty;

        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Initiates password reset process by sending reset email
    /// </summary>
    /// <param name="command">Password reset request</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Password reset initiation confirmation</returns>
    private static async Task<IResult> ForgotPasswordAsync(
        [FromBody] ForgotPasswordCommand command,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Resets password using reset token
    /// </summary>
    /// <param name="command">Password reset request</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Password reset confirmation</returns>
    private static async Task<IResult> ResetPasswordAsync(
        [FromBody] ResetPasswordCommand command,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }
}