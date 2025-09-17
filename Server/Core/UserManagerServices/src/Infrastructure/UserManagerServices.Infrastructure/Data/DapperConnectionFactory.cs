using System.Data;
using Microsoft.Extensions.Configuration;
using Npgsql;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Infrastructure.Data;

/// <summary>
/// Factory for creating PostgreSQL database connections for Dapper operations
/// Implements connection management and configuration
/// </summary>
public class DapperConnectionFactory : IDapperConnectionFactory
{
    private readonly string _connectionString;

    /// <summary>
    /// Initializes a new instance of the DapperConnectionFactory
    /// </summary>
    /// <param name="configuration">Application configuration</param>
    public DapperConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("DefaultConnection connection string is not configured.");
    }

    /// <summary>
    /// Creates a new PostgreSQL database connection
    /// </summary>
    /// <returns>Database connection instance</returns>
    public IDbConnection CreateConnection()
    {
        return new NpgsqlConnection(_connectionString);
    }

    /// <summary>
    /// Creates a new PostgreSQL database connection asynchronously
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Database connection instance</returns>
    public async Task<IDbConnection> CreateConnectionAsync(CancellationToken cancellationToken = default)
    {
        var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);
        return connection;
    }

    /// <summary>
    /// Gets the connection string
    /// </summary>
    /// <returns>Connection string</returns>
    public string GetConnectionString()
    {
        return _connectionString;
    }
}
