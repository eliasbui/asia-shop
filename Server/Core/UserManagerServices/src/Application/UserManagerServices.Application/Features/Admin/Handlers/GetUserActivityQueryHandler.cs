using MediatR;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Application.Features.Admin.Queries;
using UserManagerServices.Application.Features.Users.Responses;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Features.Admin.Handlers;

/// <summary>
/// Handler for getting user activity logs
/// </summary>
public class GetUserActivityQueryHandler(
    IUnitOfWork unitOfWork,
    ILogger<GetUserActivityQueryHandler> logger)
    : IRequestHandler<GetUserActivityQuery, BaseResponse<UserActivityResponse>>
{
    /// <summary>
    /// Handles the get user activity query
    /// </summary>
    /// <param name="request">Get user activity query</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User activity logs</returns>
    public async Task<BaseResponse<UserActivityResponse>> Handle(GetUserActivityQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            logger.LogInformation("Getting activity logs for user: {UserId} (requested by: {RequestingUserId})",
                request.UserId, request.RequestingUserId);

            // If not an admin request, ensure user can only access their own activity
            if (!request.IsAdminRequest && request.UserId != request.RequestingUserId)
            {
                logger.LogWarning(
                    "User {RequestingUserId} attempted to access activity logs for user {UserId} without admin privileges",
                    request.RequestingUserId, request.UserId);
                return BaseResponse<UserActivityResponse>.Failure("You can only access your own activity logs",
                    new Dictionary<string, object>
                    {
                        ["errorCode"] = "UNAUTHORIZED_ACCESS"
                    });
            }

            // Validate that the target user exists
            var user = await unitOfWork.Users.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                logger.LogWarning("User not found: {UserId}", request.UserId);
                return BaseResponse<UserActivityResponse>.Failure("User not found", new Dictionary<string, object>
                {
                    ["errorCode"] = "USER_NOT_FOUND"
                });
            }

            // Parse action enum if provided
            ActionEnum? actionEnum = null;
            if (!string.IsNullOrEmpty(request.Action))
            {
                if (Enum.TryParse<ActionEnum>(request.Action, true, out var parsedAction))
                {
                    actionEnum = parsedAction;
                }
                else
                {
                    logger.LogWarning("Invalid action filter: {Action}", request.Action);
                    return BaseResponse<UserActivityResponse>.Failure("Invalid action filter",
                        new Dictionary<string, object>
                        {
                            ["errorCode"] = "INVALID_ACTION_FILTER"
                        });
                }
            }

            // Get activity logs with pagination
            var (activityLogs, totalCount) = await unitOfWork.UserActivityLogs.SearchActivityLogsAsync(
                userId: request.UserId,
                action: actionEnum,
                entity: null,
                ipAddress: null,
                startDate: request.StartDate,
                endDate: request.EndDate,
                pageNumber: request.PageNumber,
                pageSize: request.PageSize,
                cancellationToken: cancellationToken);

            // Map to response model
            var activityInfos = activityLogs.Select(log => new ActivityLogInfo
            {
                Id = log.Id,
                Action = log.Action.ToString(),
                Description = GetActionDescription(log.Action),
                IpAddress = log.IpAddress ?? "Unknown",
                UserAgent = log.UserAgent ?? "Unknown",
                Metadata = ParseMetadata(log.Details),
                IsSuccess = IsSuccessfulAction(log),
                ErrorMessage = GetErrorMessage(log),
                CreatedAt = log.CreatedAt,
                Resource = log.Entity,
                ResourceId = log.EntityId?.ToString()
            }).ToList();

            // Calculate pagination info
            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);
            var paginationInfo = new PaginationInfo
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalItems = totalCount,
                TotalPages = totalPages,
                HasPreviousPage = request.PageNumber > 1,
                HasNextPage = request.PageNumber < totalPages
            };

            var response = new UserActivityResponse
            {
                UserId = request.UserId,
                Activities = activityInfos,
                Pagination = paginationInfo
            };

            logger.LogInformation(
                "Successfully retrieved {Count} activity logs for user: {UserId} (page {PageNumber}/{TotalPages})",
                activityInfos.Count, request.UserId, request.PageNumber, totalPages);

            return BaseResponse<UserActivityResponse>.Success(response);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting activity logs for user: {UserId}", request.UserId);
            return BaseResponse<UserActivityResponse>.Failure(
                "An error occurred while retrieving activity logs. Please try again.",
                new Dictionary<string, object>
                {
                    ["errorCode"] = "SERVER_ERROR"
                });
        }
    }

    /// <summary>
    /// Gets a human-readable description for an action
    /// </summary>
    /// <param name="action">Action enum</param>
    /// <returns>Action description</returns>
    private static string GetActionDescription(ActionEnum action)
    {
        return action switch
        {
            ActionEnum.Login => "User logged in",
            ActionEnum.Logout => "User logged out",
            ActionEnum.Register => "User registered",
            ActionEnum.PasswordChange => "Password changed",
            ActionEnum.PasswordReset => "Password reset",
            ActionEnum.EmailChange => "Email address changed",
            ActionEnum.ProfileUpdate => "Profile updated",
            ActionEnum.TwoFactorEnabled => "Two-factor authentication enabled",
            ActionEnum.TwoFactorDisabled => "Two-factor authentication disabled",
            ActionEnum.ApiKeyCreated => "API key created",
            ActionEnum.ApiKeyDeleted => "API key deleted",
            ActionEnum.SessionTerminated => "Session terminated",
            _ => action.ToString()
        };
    }

    /// <summary>
    /// Parses the metadata JSON string to a dictionary
    /// </summary>
    /// <param name="detailsJson">Details JSON string</param>
    /// <returns>Metadata dictionary</returns>
    private Dictionary<string, object> ParseMetadata(string detailsJson)
    {
        try
        {
            if (string.IsNullOrEmpty(detailsJson))
                return new Dictionary<string, object>();

            var metadata = JsonSerializer.Deserialize<Dictionary<string, object>>(detailsJson);
            return metadata ?? new Dictionary<string, object>();
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to parse activity log details JSON: {DetailsJson}", detailsJson);
            return new Dictionary<string, object>();
        }
    }

    /// <summary>
    /// Determines if an action was successful based on the log details
    /// </summary>
    /// <param name="log">Activity log</param>
    /// <returns>True if successful, false otherwise</returns>
    private bool IsSuccessfulAction(Domain.Entities.UserActivityLog log)
    {
        try
        {
            var metadata = ParseMetadata(log.Details);
            if (metadata.TryGetValue("success", out var successValue))
            {
                return successValue is bool success && success;
            }

            if (metadata.TryGetValue("error", out var errorValue))
            {
                return errorValue == null;
            }

            // Default to true if no explicit success/error indicators
            return true;
        }
        catch
        {
            return true;
        }
    }

    /// <summary>
    /// Gets error message from log details if available
    /// </summary>
    /// <param name="log">Activity log</param>
    /// <returns>Error message or null</returns>
    private string? GetErrorMessage(Domain.Entities.UserActivityLog log)
    {
        try
        {
            var metadata = ParseMetadata(log.Details);
            if (metadata.TryGetValue("error", out var errorValue))
            {
                return errorValue?.ToString();
            }

            if (metadata.TryGetValue("errorMessage", out var errorMessageValue))
            {
                return errorMessageValue?.ToString();
            }

            return null;
        }
        catch
        {
            return null;
        }
    }
}