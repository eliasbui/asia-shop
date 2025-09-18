#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.OpenApi.Models;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Features.Sessions.Commands;
using UserManagerServices.Application.Features.Sessions.Queries;
using UserManagerServices.API.Common;

namespace UserManagerServices.API.Endpoints.v1;

/// <summary>
/// Enhanced session management endpoints for concurrent session limits, remote revocation, and configurable timeouts
/// Provides comprehensive session control and monitoring capabilities
/// </summary>
public static class SessionManagementEndpoints
{
    /// <summary>
    /// Maps session management endpoints to the application
    /// </summary>
    /// <param name="app">Web application</param>
    /// <returns>Web application for chaining</returns>
    public static void MapSessionManagementEndpoints(this WebApplication app)
    {
        var sessionGroup = app.MapGroup("api/v1/sessions")
            .WithTags("Session Management")
            .RequireAuthorization()
            .WithOpenApi();

        // POST /api/v1/sessions/terminate-others
        sessionGroup.MapPost("/terminate-others", TerminateAllOtherSessionsAsync)
            .WithName("TerminateAllOtherSessions")
            .WithSummary("Terminate all other sessions")
            .WithDescription("Terminates all other active sessions for the current user except the current session")
            .Produces<int>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Terminate all other sessions",
                Description = "Terminates all other active sessions for the current user except the current session",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "Sessions terminated successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // PUT /api/v1/sessions/timeout
        sessionGroup.MapPut("/timeout", UpdateSessionTimeoutAsync)
            .WithName("UpdateSessionTimeout")
            .WithSummary("Update session timeout settings")
            .WithDescription("Updates session timeout and concurrent session limit settings for the current user")
            .Accepts<UpdateSessionTimeoutCommand>("application/json")
            .Produces<bool>(200, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Update session timeout settings",
                Description = "Updates session timeout and concurrent session limit settings for the current user",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "Session settings updated successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid request data" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // GET /api/v1/sessions/statistics
        sessionGroup.MapGet("/statistics", GetSessionStatisticsAsync)
            .WithName("GetSessionStatistics")
            .WithSummary("Get session statistics")
            .WithDescription("Gets comprehensive session statistics for the current user")
            .Produces<SessionStatistics>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Get session statistics",
                Description = "Gets comprehensive session statistics for the current user",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "Session statistics retrieved successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // GET /api/v1/sessions/active
        sessionGroup.MapGet("/active", GetActiveSessionsAsync)
            .WithName("GetActiveSessions")
            .WithSummary("Get active sessions")
            .WithDescription("Gets all active sessions for the current user with enhanced information")
            .Produces<List<SessionInfo>>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Get active sessions",
                Description = "Gets all active sessions for the current user with enhanced information",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "Active sessions retrieved successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // POST /api/v1/sessions/{sessionId}/terminate
        sessionGroup.MapPost("/{sessionId:guid}/terminate", TerminateSpecificSessionAsync)
            .WithName("TerminateSpecificSession")
            .WithSummary("Terminate specific session")
            .WithDescription("Terminates a specific session by ID")
            .Produces<bool>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Terminate specific session",
                Description = "Terminates a specific session by ID",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "Session terminated successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["404"] = new OpenApiResponse { Description = "Session not found" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });
    }

    /// <summary>
    /// Terminates all other sessions for the current user
    /// </summary>
    private static async Task<IResult> TerminateAllOtherSessionsAsync(
        HttpContext context,
        IMediator mediator)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentSessionId = context.User.FindFirst("session_id")?.Value;

        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var command = new TerminateAllOtherSessionsCommand
        {
            UserId = Guid.Parse(userId),
            CurrentSessionId = string.IsNullOrEmpty(currentSessionId) ? null : Guid.Parse(currentSessionId),
            Reason = "User requested session cleanup"
        };

        var result = await mediator.Send(command);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Updates session timeout settings for the current user
    /// </summary>
    private static async Task<IResult> UpdateSessionTimeoutAsync(
        UpdateSessionTimeoutCommand command,
        HttpContext context,
        IMediator mediator)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        command.UserId = Guid.Parse(userId);

        var result = await mediator.Send(command);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Gets session statistics for the current user
    /// </summary>
    private static async Task<IResult> GetSessionStatisticsAsync(
        HttpContext context,
        IMediator mediator)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var query = new GetSessionStatisticsQuery
        {
            UserId = Guid.Parse(userId)
        };

        var result = await mediator.Send(query);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Gets active sessions for the current user
    /// </summary>
    private static async Task<IResult> GetActiveSessionsAsync(
        HttpContext context,
        ISessionManagementService sessionManagementService)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var currentSessionId = context.User.FindFirst("session_id")?.Value;

        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        try
        {
            var sessions = await sessionManagementService.GetActiveSessionsAsync(
                Guid.Parse(userId),
                string.IsNullOrEmpty(currentSessionId) ? null : Guid.Parse(currentSessionId));

            return Results.Ok(sessions);
        }
        catch (Exception ex)
        {
            return Results.Problem(
                title: "Error retrieving active sessions",
                detail: ex.Message,
                statusCode: 500);
        }
    }

    /// <summary>
    /// Terminates a specific session
    /// </summary>
    private static async Task<IResult> TerminateSpecificSessionAsync(
        Guid sessionId,
        HttpContext context,
        ISessionManagementService sessionManagementService)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        try
        {
            var success = await sessionManagementService.TerminateSessionAsync(
                Guid.Parse(userId),
                sessionId,
                "User requested termination");

            if (!success)
                return Results.NotFound("Session not found or already terminated");

            return Results.Ok(true);
        }
        catch (Exception ex)
        {
            return Results.Problem(
                title: "Error terminating session",
                detail: ex.Message,
                statusCode: 500);
        }
    }
}