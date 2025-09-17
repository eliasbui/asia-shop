using System.Data;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Factory interface for creating database connections for Dapper operations
/// Provides abstraction over database connection management
/// </summary>
public interface IDapperConnectionFactory
{
    /// <summary>
    /// Creates a new database connection
    /// </summary>
    /// <returns>Database connection instance</returns>
    IDbConnection CreateConnection();

    /// <summary>
    /// Creates a new database connection asynchronously
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Database connection instance</returns>
    Task<IDbConnection> CreateConnectionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the connection string
    /// </summary>
    /// <returns>Connection string</returns>
    string GetConnectionString();
}