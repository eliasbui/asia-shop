using MediatR;
using Microsoft.Extensions.Logging;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Application.Common.Behaviors;

/// <summary>
/// Pipeline behavior for handling database transactions in MediatR requests
/// Automatically wraps commands in transactions for data consistency
/// </summary>
/// <typeparam name="TRequest">Request type</typeparam>
/// <typeparam name="TResponse">Response type</typeparam>
public class TransactionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<TransactionBehavior<TRequest, TResponse>> _logger;

    /// <summary>
    /// Initializes a new instance of the TransactionBehavior
    /// </summary>
    /// <param name="unitOfWork">Unit of work instance</param>
    /// <param name="logger">Logger instance</param>
    public TransactionBehavior(IUnitOfWork unitOfWork, ILogger<TransactionBehavior<TRequest, TResponse>> logger)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Handles the request with transaction management
    /// </summary>
    /// <param name="request">The request</param>
    /// <param name="next">The next handler in the pipeline</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The response</returns>
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;

        // Only wrap commands in transactions, not queries
        if (IsQuery(requestName))
        {
            return await next();
        }

        _logger.LogInformation("Starting transaction for {RequestName}", requestName);

        try
        {
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var response = await next();

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            _logger.LogInformation("Transaction committed successfully for {RequestName}", requestName);

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Transaction failed for {RequestName}. Rolling back.", requestName);

            await _unitOfWork.RollbackTransactionAsync(cancellationToken);

            throw;
        }
    }

    /// <summary>
    /// Determines if the request is a query (read-only operation)
    /// </summary>
    /// <param name="requestName">Request name</param>
    /// <returns>True if it's a query, false if it's a command</returns>
    private static bool IsQuery(string requestName)
    {
        return requestName.Contains("Query", StringComparison.OrdinalIgnoreCase) ||
               requestName.Contains("Get", StringComparison.OrdinalIgnoreCase) ||
               requestName.Contains("List", StringComparison.OrdinalIgnoreCase) ||
               requestName.Contains("Search", StringComparison.OrdinalIgnoreCase) ||
               requestName.Contains("Find", StringComparison.OrdinalIgnoreCase);
    }
}
