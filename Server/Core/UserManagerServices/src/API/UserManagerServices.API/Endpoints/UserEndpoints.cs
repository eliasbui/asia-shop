using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using UserManagerServices.API.Common;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Features.Admin.Queries;
using UserManagerServices.Application.Features.Users.Commands;
using UserManagerServices.Application.Features.Users.Queries;
using UserManagerServices.Application.Features.Users.Responses;

namespace UserManagerServices.API.Endpoints;

/// <summary>
/// User profile and preferences endpoints
/// Provides endpoints for user profile management, preferences, and personal settings
/// </summary>
public static class UserEndpoints
{
    /// <summary>
    /// Maps user endpoints to the application
    /// </summary>
    /// <param name="app">Web application</param>
    /// <returns>Web application for chaining</returns>
    [ApiVersion("1.0")]
    public static void MapUserEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("api/v1/users")
            .WithTags("User Profile & Preferences")
            .WithOpenApi()
            .RequireAuthorization();

        // GET /api/v1/users/profile
        userGroup.MapGet("/profile", GetUserProfileAsync)
            .WithName("GetUserProfile")
            .WithSummary("Get user profile")
            .WithDescription("Gets the current user's profile information")
            .Produces<UserProfileResponse>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Get user profile",
                Description = "Gets the current user's profile information",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "User profile retrieved successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["404"] = new OpenApiResponse { Description = "User profile not found" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // PUT /api/v1/users/profile
        userGroup.MapPut("/profile", UpdateUserProfileAsync)
            .WithName("UpdateUserProfile")
            .WithSummary("Update user profile")
            .WithDescription("Updates the current user's profile information")
            .Accepts<UpdateUserProfileCommand>("application/json")
            .Produces<UserProfileResponse>(200, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Update user profile",
                Description = "Updates the current user's profile information",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "User profile updated successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid input or validation errors" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["404"] = new OpenApiResponse { Description = "User not found" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // GET /api/v1/users/preferences
        userGroup.MapGet("/preferences", GetUserPreferencesAsync)
            .WithName("GetUserPreferences")
            .WithSummary("Get user preferences")
            .WithDescription("Gets the current user's preferences and settings")
            .Produces<UserPreferencesResponse>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Get user preferences",
                Description = "Gets the current user's preferences and settings",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "User preferences retrieved successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // PUT /api/v1/users/preferences
        userGroup.MapPut("/preferences", UpdateUserPreferencesAsync)
            .WithName("UpdateUserPreferences")
            .WithSummary("Update user preferences")
            .WithDescription("Updates the current user's preferences and settings")
            .Accepts<UpdateUserPreferencesCommand>("application/json")
            .Produces<UserPreferencesResponse>(200, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Update user preferences",
                Description = "Updates the current user's preferences and settings",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "User preferences updated successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid input or validation errors" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // GET /api/v1/users/notifications/settings
        userGroup.MapGet("/notifications/settings", GetNotificationSettingsAsync)
            .WithName("GetNotificationSettings")
            .WithSummary("Get notification settings")
            .WithDescription("Gets the current user's notification preferences and settings")
            .Produces<NotificationSettingsResponse>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Get notification settings",
                Description = "Gets the current user's notification preferences and settings",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "Notification settings retrieved successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // PUT /api/v1/users/notifications/settings
        userGroup.MapPut("/notifications/settings", UpdateNotificationSettingsAsync)
            .WithName("UpdateNotificationSettings")
            .WithSummary("Update notification settings")
            .WithDescription("Updates the current user's notification preferences and settings")
            .Accepts<UpdateNotificationSettingsCommand>("application/json")
            .Produces<NotificationSettingsResponse>(200, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Update notification settings",
                Description = "Updates the current user's notification preferences and settings",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "Notification settings updated successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid input or validation errors" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // GET /api/v1/users/sessions
        userGroup.MapGet("/sessions", GetUserSessionsAsync)
            .WithName("GetUserSessions")
            .WithSummary("Get user sessions")
            .WithDescription("Gets the current user's active sessions")
            .Produces<UserSessionsResponse>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Get user sessions",
                Description = "Gets the current user's active sessions",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "User sessions retrieved successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // DELETE /api/v1/users/sessions/{sessionId}
        userGroup.MapDelete("/sessions/{sessionId:guid}", DeleteUserSessionAsync)
            .WithName("DeleteUserSession")
            .WithSummary("Delete user session")
            .WithDescription("Deletes a specific user session")
            .Produces(204)
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Delete user session",
                Description = "Deletes a specific user session",
                Responses = new OpenApiResponses
                {
                    ["204"] = new OpenApiResponse { Description = "Session deleted successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["404"] = new OpenApiResponse { Description = "Session not found" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // GET /api/v1/users/api-keys
        userGroup.MapGet("/api-keys", GetUserApiKeysAsync)
            .WithName("GetUserApiKeys")
            .WithSummary("Get user API keys")
            .WithDescription("Gets the current user's API keys")
            .Produces<UserApiKeysResponse>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Get user API keys",
                Description = "Gets the current user's API keys",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "User API keys retrieved successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // POST /api/v1/users/api-keys
        userGroup.MapPost("/api-keys", CreateApiKeyAsync)
            .WithName("CreateApiKey")
            .WithSummary("Create API key")
            .WithDescription("Creates a new API key for the current user")
            .Accepts<CreateApiKeyCommand>("application/json")
            .Produces<ApiKeyResponse>(201, "application/json")
            .Produces(400, contentType: "application/json", responseType: typeof(ValidationProblemDetails))
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Create API key",
                Description = "Creates a new API key for the current user",
                Responses = new OpenApiResponses
                {
                    ["201"] = new OpenApiResponse { Description = "API key created successfully" },
                    ["400"] = new OpenApiResponse { Description = "Invalid input or validation errors" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // DELETE /api/v1/users/api-keys/{keyId}
        userGroup.MapDelete("/api-keys/{keyId:guid}", DeleteApiKeyAsync)
            .WithName("DeleteApiKey")
            .WithSummary("Delete API key")
            .WithDescription("Deletes a specific API key")
            .Produces(204)
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(404, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Delete API key",
                Description = "Deletes a specific API key",
                Responses = new OpenApiResponses
                {
                    ["204"] = new OpenApiResponse { Description = "API key deleted successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["404"] = new OpenApiResponse { Description = "API key not found" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });

        // GET /api/v1/users/activity
        userGroup.MapGet("/activity", GetUserActivityAsync)
            .WithName("GetUserActivity")
            .WithSummary("Get user activity logs")
            .WithDescription("Gets the current user's activity logs with pagination")
            .Produces<UserActivityResponse>(200, "application/json")
            .Produces(401, contentType: "application/json", responseType: typeof(ProblemDetails))
            .Produces(500, contentType: "application/json", responseType: typeof(ProblemDetails))
            .WithOpenApi(operation => new OpenApiOperation(operation)
            {
                Summary = "Get user activity logs",
                Description = "Gets the current user's activity logs with pagination",
                Responses = new OpenApiResponses
                {
                    ["200"] = new OpenApiResponse { Description = "User activity logs retrieved successfully" },
                    ["401"] = new OpenApiResponse { Description = "User not authenticated" },
                    ["500"] = new OpenApiResponse { Description = "Internal server error" }
                }
            });
    }

    /// <summary>
    /// Gets current user's profile information
    /// </summary>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User profile information</returns>
    private static async Task<IResult> GetUserProfileAsync(
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var userId = ApiHelpers.GetCurrentUserId(user);
        if (userId == null) return Results.Unauthorized();

        var query = new GetUserProfileQuery { UserId = userId.Value };
        var result = await mediator.Send(query, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Updates current user's profile information
    /// </summary>
    /// <param name="command">Update profile command</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated user profile information</returns>
    private static async Task<IResult> UpdateUserProfileAsync(
        [FromBody] UpdateUserProfileCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var userId = ApiHelpers.GetCurrentUserId(user);
        if (userId == null) return Results.Unauthorized();

        command.UserId = userId.Value;
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Gets current user's preferences
    /// </summary>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User preferences</returns>
    private static async Task<IResult> GetUserPreferencesAsync(
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var userId = ApiHelpers.GetCurrentUserId(user);
        if (userId == null) return Results.Unauthorized();

        var query = new GetUserPreferencesQuery { UserId = userId.Value };
        var result = await mediator.Send(query, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Updates current user's preferences
    /// </summary>
    /// <param name="command">Update preferences command</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated user preferences</returns>
    private static async Task<IResult> UpdateUserPreferencesAsync(
        [FromBody] UpdateUserPreferencesCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var userId = ApiHelpers.GetCurrentUserId(user);
        if (userId == null) return Results.Unauthorized();

        command.UserId = userId.Value;
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Gets current user's notification settings
    /// </summary>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Notification settings</returns>
    private static async Task<IResult> GetNotificationSettingsAsync(
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var userId = ApiHelpers.GetCurrentUserId(user);
        if (userId == null) return Results.Unauthorized();

        var query = new GetNotificationSettingsQuery { UserId = userId.Value };
        var result = await mediator.Send(query, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Updates current user's notification settings
    /// </summary>
    /// <param name="command">Update notification settings command</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated notification settings</returns>
    private static async Task<IResult> UpdateNotificationSettingsAsync(
        [FromBody] UpdateNotificationSettingsCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var userId = ApiHelpers.GetCurrentUserId(user);
        if (userId == null) return Results.Unauthorized();

        command.UserId = userId.Value;
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Gets current user's active sessions with enhanced information
    /// </summary>
    /// <param name="user">Claims principal</param>
    /// <param name="sessionManagementService">Session management service</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User sessions</returns>
    private static async Task<IResult> GetUserSessionsAsync(
        ClaimsPrincipal user,
        [FromServices] ISessionManagementService sessionManagementService,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var userId = ApiHelpers.GetCurrentUserId(user);
            if (userId == null) return Results.Unauthorized();

            var currentSessionId = user.FindFirst("session_id")?.Value;

            var sessions = await sessionManagementService.GetActiveSessionsAsync(
                userId.Value,
                string.IsNullOrEmpty(currentSessionId) ? null : Guid.Parse(currentSessionId),
                cancellationToken);

            var response = new UserSessionsResponse
            {
                UserId = userId.Value,
                Sessions = sessions.Select(s => new Application.Features.Users.Responses.SessionInfo
                {
                    SessionId = s.SessionId,
                    Device = s.Device,
                    OperatingSystem = s.OperatingSystem,
                    Browser = s.Browser,
                    IpAddress = s.IpAddress,
                    Location = s.Location,
                    CreatedAt = s.CreatedAt,
                    LastActivity = s.LastActivity,
                    ExpiresAt = s.ExpiresAt,
                    IsCurrent = s.IsCurrent,
                    IsActive = s.IsActive
                }).ToList(),
                TotalSessions = sessions.Count,
                CurrentSessionId = string.IsNullOrEmpty(currentSessionId) ? null : Guid.Parse(currentSessionId)
            };

            return Results.Ok(response);
        }
        catch (Exception ex)
        {
            return Results.Problem(
                title: "Error retrieving user sessions",
                detail: ex.Message,
                statusCode: 500);
        }
    }

    /// <summary>
    /// Deletes a specific user session using enhanced session management
    /// </summary>
    /// <param name="sessionId">Session ID to delete</param>
    /// <param name="user">Claims principal</param>
    /// <param name="sessionManagementService">Session management service</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content if successful</returns>
    private static async Task<IResult> DeleteUserSessionAsync(
        Guid sessionId,
        ClaimsPrincipal user,
        [FromServices] ISessionManagementService sessionManagementService,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var userId = ApiHelpers.GetCurrentUserId(user);
            if (userId == null) return Results.Unauthorized();

            var success = await sessionManagementService.TerminateSessionAsync(
                userId.Value,
                sessionId,
                "User requested termination",
                cancellationToken);

            if (!success)
                return Results.NotFound("Session not found or already terminated");

            return Results.NoContent();
        }
        catch (Exception ex)
        {
            return Results.Problem(
                title: "Error terminating session",
                detail: ex.Message,
                statusCode: 500);
        }
    }

    /// <summary>
    /// Gets current user's API keys
    /// </summary>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User API keys</returns>
    private static async Task<IResult> GetUserApiKeysAsync(
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var userId = ApiHelpers.GetCurrentUserId(user);
        if (userId == null) return Results.Unauthorized();

        var query = new GetUserApiKeysQuery { UserId = userId.Value };
        var result = await mediator.Send(query, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Creates a new API key for the current user
    /// </summary>
    /// <param name="command">Create API key command</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created API key</returns>
    private static async Task<IResult> CreateApiKeyAsync(
        [FromBody] CreateApiKeyCommand command,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var userId = ApiHelpers.GetCurrentUserId(user);
        if (userId == null) return Results.Unauthorized();

        command.UserId = userId.Value;
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Deletes a specific API key
    /// </summary>
    /// <param name="keyId">API key ID to delete</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content if successful</returns>
    private static async Task<IResult> DeleteApiKeyAsync(
        Guid keyId,
        ClaimsPrincipal user,
        [FromServices] ISender mediator,
        CancellationToken cancellationToken = default)
    {
        var userId = ApiHelpers.GetCurrentUserId(user);
        if (userId == null) return Results.Unauthorized();

        var command = new DeleteApiKeyCommand
        {
            UserId = userId.Value,
            KeyId = keyId
        };
        var result = await mediator.Send(command, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }

    /// <summary>
    /// Gets current user's activity logs
    /// </summary>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="action">Filter by action type</param>
    /// <param name="startDate">Filter by start date</param>
    /// <param name="endDate">Filter by end date</param>
    /// <param name="user">Claims principal</param>
    /// <param name="mediator">MediatR sender</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User activity logs</returns>
    private static async Task<IResult> GetUserActivityAsync(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? action = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        ClaimsPrincipal user = default!,
        [FromServices] ISender mediator = default!,
        CancellationToken cancellationToken = default)
    {
        var userId = ApiHelpers.GetCurrentUserId(user);
        if (userId == null) return Results.Unauthorized();

        var query = new GetUserActivityQuery
        {
            UserId = userId.Value,
            RequestingUserId = userId.Value,
            IsAdminRequest = false,
            PageNumber = pageNumber,
            PageSize = pageSize,
            Action = action,
            StartDate = startDate,
            EndDate = endDate
        };

        var result = await mediator.Send(query, cancellationToken);
        return ApiHelpers.CreateResponse(result);
    }
}
