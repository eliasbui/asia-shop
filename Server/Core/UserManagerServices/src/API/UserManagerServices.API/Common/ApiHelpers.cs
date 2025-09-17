using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.API.Common;

/// <summary>
/// Static helper class providing common functionality for Minimal API endpoints
/// Replaces the functionality previously provided by BaseApiController
/// </summary>
public static class ApiHelpers
{
    /// <summary>
    /// Gets the MediatR sender instance from the service provider
    /// </summary>
    /// <param name="serviceProvider">Service provider</param>
    /// <returns>MediatR sender instance</returns>
    public static ISender GetMediator(IServiceProvider serviceProvider)
    {
        return serviceProvider.GetRequiredService<ISender>();
    }

    /// <summary>
    /// Creates an appropriate HTTP response based on the operation result
    /// </summary>
    /// <typeparam name="T">Response data type</typeparam>
    /// <param name="result">Operation result</param>
    /// <returns>HTTP result</returns>
    public static IResult CreateResponse<T>(BaseResponse<T> result)
    {
        if (result.IsSuccess)
        {
            return Results.Ok(result);
        }

        if (result.ValidationErrors.Any())
        {
            return Results.BadRequest(result);
        }

        return Results.BadRequest(result);
    }

    /// <summary>
    /// Creates an appropriate HTTP response for operations without return data
    /// </summary>
    /// <param name="result">Operation result</param>
    /// <returns>HTTP result</returns>
    public static IResult CreateResponse(BaseResponse result)
    {
        if (result.IsSuccess)
        {
            return Results.Ok(result);
        }

        if (result.ValidationErrors.Any())
        {
            return Results.BadRequest(result);
        }

        return Results.BadRequest(result);
    }

    /// <summary>
    /// Gets the current user ID from the JWT token
    /// </summary>
    /// <param name="user">Claims principal</param>
    /// <returns>User ID if authenticated, null otherwise</returns>
    public static Guid? GetCurrentUserId(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst("sub") ?? user.FindFirst("id");
        return userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId) ? userId : null;
    }

    /// <summary>
    /// Gets the current user's IP address
    /// </summary>
    /// <param name="context">HTTP context</param>
    /// <returns>IP address</returns>
    public static string GetClientIpAddress(HttpContext context)
    {
        return context.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
    }

    /// <summary>
    /// Gets the current user's user agent
    /// </summary>
    /// <param name="context">HTTP context</param>
    /// <returns>User agent string</returns>
    public static string GetUserAgent(HttpContext context)
    {
        return context.Request.Headers.UserAgent.ToString();
    }

    /// <summary>
    /// Extracts JWT token from Authorization header
    /// </summary>
    /// <param name="context">HTTP context</param>
    /// <returns>JWT token without Bearer prefix</returns>
    public static string? ExtractTokenFromHeader(HttpContext context)
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            return null;
        }

        return authHeader.Substring("Bearer ".Length).Trim();
    }

    /// <summary>
    /// Creates a standardized problem details response
    /// </summary>
    /// <param name="title">Problem title</param>
    /// <param name="detail">Problem detail</param>
    /// <param name="statusCode">HTTP status code</param>
    /// <returns>Problem details result</returns>
    public static IResult CreateProblemResponse(string title, string detail, int statusCode = 400)
    {
        return Results.Problem(
            title: title,
            detail: detail,
            statusCode: statusCode
        );
    }

    /// <summary>
    /// Creates a validation problem response
    /// </summary>
    /// <param name="errors">Validation errors</param>
    /// <returns>Validation problem result</returns>
    public static IResult CreateValidationProblemResponse(Dictionary<string, string[]> errors)
    {
        return Results.ValidationProblem(errors);
    }
}
