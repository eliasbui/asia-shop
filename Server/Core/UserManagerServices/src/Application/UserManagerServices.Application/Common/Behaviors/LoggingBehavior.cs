#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace UserManagerServices.Application.Common.Behaviors;

/// <summary>
/// Pipeline behavior for logging MediatR requests and responses
/// Provides comprehensive logging for debugging and monitoring
/// </summary>
/// <typeparam name="TRequest">Request type</typeparam>
/// <typeparam name="TResponse">Response type</typeparam>
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    /// <summary>
    /// Initializes a new instance of the LoggingBehavior
    /// </summary>
    /// <param name="logger">Logger instance</param>
    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Handles the request with logging
    /// </summary>
    /// <param name="request">The request</param>
    /// <param name="next">The next handler in the pipeline</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The response</returns>
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var requestId = Guid.NewGuid();
        var stopwatch = Stopwatch.StartNew();

        _logger.LogInformation(
            "Starting request {RequestName} with ID {RequestId} at {Timestamp}",
            requestName,
            requestId,
            DateTime.UtcNow);

        try
        {
            var response = await next();

            stopwatch.Stop();

            _logger.LogInformation(
                "Completed request {RequestName} with ID {RequestId} in {ElapsedMilliseconds}ms at {Timestamp}",
                requestName,
                requestId,
                stopwatch.ElapsedMilliseconds,
                DateTime.UtcNow);

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            _logger.LogError(ex,
                "Request {RequestName} with ID {RequestId} failed after {ElapsedMilliseconds}ms at {Timestamp}. Error: {ErrorMessage}",
                requestName,
                requestId,
                stopwatch.ElapsedMilliseconds,
                DateTime.UtcNow,
                ex.Message);

            throw;
        }
    }
}