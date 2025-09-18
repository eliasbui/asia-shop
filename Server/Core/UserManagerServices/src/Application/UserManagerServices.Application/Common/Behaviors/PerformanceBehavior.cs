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
/// Pipeline behavior for monitoring performance of MediatR requests
/// Logs warnings for slow-running requests
/// </summary>
/// <typeparam name="TRequest">Request type</typeparam>
/// <typeparam name="TResponse">Response type</typeparam>
public class PerformanceBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<PerformanceBehavior<TRequest, TResponse>> _logger;
    private readonly Stopwatch _timer;

    /// <summary>
    /// Initializes a new instance of the PerformanceBehavior
    /// </summary>
    /// <param name="logger">Logger instance</param>
    public PerformanceBehavior(ILogger<PerformanceBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _timer = new Stopwatch();
    }

    /// <summary>
    /// Handles the request with performance monitoring
    /// </summary>
    /// <param name="request">The request</param>
    /// <param name="next">The next handler in the pipeline</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The response</returns>
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        _timer.Start();

        var response = await next(cancellationToken);

        _timer.Stop();

        var elapsedMilliseconds = _timer.ElapsedMilliseconds;

        // Log warning for requests taking longer than 500ms
        if (elapsedMilliseconds > 500)
        {
            var requestName = typeof(TRequest).Name;

            _logger.LogWarning(
                "Long Running Request: {RequestName} ({ElapsedMilliseconds} milliseconds) {@Request}",
                requestName,
                elapsedMilliseconds,
                request);
        }

        return response;
    }
}