#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Users.Queries;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Users.Handlers;

/// <summary>
/// Handler for getting user sessions
/// </summary>
public class GetUserSessionsQueryHandler(
    IUnitOfWork unitOfWork,
    IHttpContextAccessor httpContextAccessor,
    ILogger<GetUserSessionsQueryHandler> logger)
    : IRequestHandler<GetUserSessionsQuery, BaseResponse<UserSessionsResponse>>
{
    /// <summary>
    /// Handles the get user sessions query
    /// </summary>
    /// <param name="request">Get user sessions query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User sessions</returns>
    public async Task<BaseResponse<UserSessionsResponse>> Handle(GetUserSessionsQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Getting sessions for user: {UserId}", request.UserId);

            // Get all active sessions for the user
            var sessions =
                await unitOfWork.UserSessions.GetActiveSessionsByUserIdAsync(request.UserId, cancellationToken);

            // Get current session ID from JWT token
            var currentSessionId = GetCurrentSessionId();

            var sessionInfos = sessions.Select(session => new SessionInfo
            {
                SessionId = session.Id,
                Device = session.DeviceInfo ?? "Unknown Device",
                OperatingSystem = session.OperatingSystem ?? "Unknown OS",
                Browser = session.Browser ?? "Unknown Browser",
                IpAddress = session.IpAddress ?? "Unknown IP",
                Location = session.Location ?? "Unknown Location",
                CreatedAt = session.CreatedAt,
                LastActivity = session.LastAccessedAt ?? session.CreatedAt,
                ExpiresAt = session.ExpiresAt,
                IsCurrent = session.Id == currentSessionId,
                IsActive = session.IsActive && session.ExpiresAt > DateTime.UtcNow
            }).OrderByDescending(s => s.LastActivity).ToList();

            var response = new UserSessionsResponse
            {
                UserId = request.UserId,
                Sessions = sessionInfos,
                TotalSessions = sessionInfos.Count,
                CurrentSessionId = currentSessionId
            };

            logger.LogInformation("Successfully retrieved {Count} sessions for user: {UserId}",
                sessionInfos.Count, request.UserId);

            return BaseResponse<UserSessionsResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting sessions for user: {UserId}", request.UserId);
            return BaseResponse<UserSessionsResponse>.Failure(
                "An error occurred while retrieving user sessions. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }

    /// <summary>
    /// Gets the current session ID from JWT token claims
    /// </summary>
    /// <returns>Current session ID if found, null otherwise</returns>
    private Guid? GetCurrentSessionId()
    {
        try
        {
            var httpContext = httpContextAccessor.HttpContext;
            if (httpContext?.User?.Identity?.IsAuthenticated == true)
            {
                var sessionIdClaim = httpContext.User.FindFirst("session_id")?.Value;
                if (!string.IsNullOrEmpty(sessionIdClaim) && Guid.TryParse(sessionIdClaim, out var sessionId))
                    return sessionId;
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to get current session ID from JWT token");
        }

        return null;
    }
}