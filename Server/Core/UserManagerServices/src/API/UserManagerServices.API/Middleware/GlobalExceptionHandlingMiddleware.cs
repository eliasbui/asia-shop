using System.Net;
using System.Text.Json;
using FluentValidation;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Domain.Exceptions;

namespace UserManagerServices.API.Middleware;

/// <summary>
/// Global exception handling middleware for centralized error processing
/// Provides consistent error responses and comprehensive logging
/// </summary>
public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

    /// <summary>
    /// Initializes a new instance of the GlobalExceptionHandlingMiddleware
    /// </summary>
    /// <param name="next">Next middleware in the pipeline</param>
    /// <param name="logger">Logger instance</param>
    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Invokes the middleware
    /// </summary>
    /// <param name="context">HTTP context</param>
    /// <returns>Task representing the operation</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    /// <summary>
    /// Handles exceptions and creates appropriate responses
    /// </summary>
    /// <param name="context">HTTP context</param>
    /// <param name="exception">Exception to handle</param>
    /// <returns>Task representing the operation</returns>
    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var errorId = Guid.NewGuid();
        var response = CreateErrorResponse(exception, errorId);

        LogException(exception, errorId, context);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)response.StatusCode;

        var jsonResponse = JsonSerializer.Serialize(response.ErrorResponse, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        });

        await context.Response.WriteAsync(jsonResponse);
    }

    /// <summary>
    /// Creates an error response based on the exception type
    /// </summary>
    /// <param name="exception">Exception to process</param>
    /// <param name="errorId">Unique error identifier</param>
    /// <returns>Error response with appropriate status code</returns>
    private static (HttpStatusCode StatusCode, object ErrorResponse) CreateErrorResponse(Exception exception,
        Guid errorId)
    {
        return exception switch
        {
            // Domain exceptions
            EntityNotFoundException domainEx => (
                HttpStatusCode.NotFound,
                BaseResponse.Failure(domainEx.Message, new Dictionary<string, object>
                {
                    ["errorCode"] = domainEx.ErrorCode,
                    ["context"] = domainEx.Context
                })
            ),

            EntityAlreadyExistsException domainEx => (
                HttpStatusCode.Conflict,
                BaseResponse.Failure(domainEx.Message, new Dictionary<string, object>
                {
                    ["errorCode"] = domainEx.ErrorCode,
                    ["context"] = domainEx.Context
                })
            ),

            BusinessRuleViolationException domainEx => (
                HttpStatusCode.BadRequest,
                BaseResponse.Failure(domainEx.Message, new Dictionary<string, object>
                {
                    ["errorCode"] = domainEx.ErrorCode,
                    ["context"] = domainEx.Context
                })
            ),

            DomainValidationException domainEx => (
                HttpStatusCode.BadRequest,
                BaseResponse.Failure(new Dictionary<string, object>
                {
                    ["errorCode"] = domainEx.ErrorCode,
                    ["context"] = domainEx.Context
                })
            ),

            Domain.Exceptions.InvalidOperationException domainEx => (
                HttpStatusCode.BadRequest,
                BaseResponse.Failure(domainEx.Message, new Dictionary<string, object>
                {
                    ["errorCode"] = domainEx.ErrorCode,
                    ["context"] = domainEx.Context
                })
            ),

            // FluentValidation exceptions
            ValidationException validationEx => (
                HttpStatusCode.BadRequest,
                BaseResponse.Failure(new Dictionary<string, object>
                {
                    ["errorCode"] = "VALIDATION_ERROR",
                    ["errors"] = validationEx.Errors
                })
            ),

            ArgumentException => (
                HttpStatusCode.BadRequest,
                BaseResponse.Failure("Invalid request parameters.")
            ),


            UnauthorizedAccessException => (
                HttpStatusCode.Unauthorized,
                BaseResponse.Failure("Access denied. Authentication required.")
            ),

            KeyNotFoundException => (
                HttpStatusCode.NotFound,
                BaseResponse.Failure("The requested resource was not found.")
            ),
            System.InvalidOperationException => (
                HttpStatusCode.BadRequest,
                BaseResponse.Failure("Invalid operation. Please check your request.")
            ),

            TimeoutException => (
                HttpStatusCode.RequestTimeout,
                BaseResponse.Failure("The request timed out. Please try again.")
            ),

            NotSupportedException => (
                HttpStatusCode.NotImplemented,
                BaseResponse.Failure("The requested operation is not supported.")
            ),

            _ => (
                HttpStatusCode.InternalServerError,
                BaseResponse.Failure("An unexpected error occurred. Please try again later.",
                    new Dictionary<string, object>
                    {
                        ["errorId"] = errorId,
                        ["timestamp"] = DateTime.UtcNow
                    })
            )
        };
    }

    /// <summary>
    /// Logs exception details with context information
    /// </summary>
    /// <param name="exception">Exception to log</param>
    /// <param name="errorId">Unique error identifier</param>
    /// <param name="context">HTTP context</param>
    private void LogException(Exception exception, Guid errorId, HttpContext context)
    {
        var logLevel = GetLogLevel(exception);
        var requestInfo = new
        {
            ErrorId = errorId,
            RequestPath = context.Request.Path,
            RequestMethod = context.Request.Method,
            QueryString = context.Request.QueryString.ToString(),
            UserAgent = context.Request.Headers.UserAgent.ToString(),
            RemoteIpAddress = context.Connection.RemoteIpAddress?.ToString(),
            UserId = context.User.Identity?.Name,
            Timestamp = DateTime.UtcNow
        };

        using (_logger.BeginScope(requestInfo))
        {
            _logger.Log(logLevel, exception,
                "Unhandled exception occurred. ErrorId: {ErrorId}, Path: {RequestPath}, Method: {RequestMethod}",
                errorId, context.Request.Path, context.Request.Method);
        }
    }

    /// <summary>
    /// Determines the appropriate log level based on exception type
    /// </summary>
    /// <param name="exception">Exception to evaluate</param>
    /// <returns>Appropriate log level</returns>
    private static LogLevel GetLogLevel(Exception exception)
    {
        return exception switch
        {
            // Domain exceptions
            EntityNotFoundException => LogLevel.Information,
            EntityAlreadyExistsException => LogLevel.Warning,
            BusinessRuleViolationException => LogLevel.Warning,
            DomainValidationException => LogLevel.Warning,
            Domain.Exceptions.InvalidOperationException => LogLevel.Warning,

            // Framework exceptions
            ValidationException => LogLevel.Warning,
            ArgumentException => LogLevel.Warning,
            UnauthorizedAccessException => LogLevel.Warning,
            KeyNotFoundException => LogLevel.Information,
            System.InvalidOperationException => LogLevel.Warning,
            TimeoutException => LogLevel.Warning,
            NotSupportedException => LogLevel.Warning,
            _ => LogLevel.Error
        };
    }
}

/// <summary>
/// Extension methods for registering the global exception handling middleware
/// </summary>
public static class GlobalExceptionHandlingMiddlewareExtensions
{
    /// <summary>
    /// Adds the global exception handling middleware to the pipeline
    /// </summary>
    /// <param name="builder">Application builder</param>
    /// <returns>Application builder for chaining</returns>
    public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<GlobalExceptionHandlingMiddleware>();
    }
}