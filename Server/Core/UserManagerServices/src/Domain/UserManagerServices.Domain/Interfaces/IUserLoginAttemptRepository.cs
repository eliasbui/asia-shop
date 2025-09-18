#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Repository interface for UserLoginAttempt entity
/// </summary>
public interface IUserLoginAttemptRepository : IGenericRepository<UserLoginAttempt>
{
    /// <summary>
    /// Gets login attempts for a user within a time window
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of login attempts</returns>
    Task<List<UserLoginAttempt>> GetUserAttemptsAsync(Guid userId, DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets failed login attempts for a user within a time window
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of failed login attempts</returns>
    Task<List<UserLoginAttempt>> GetFailedAttemptsAsync(Guid userId, DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets login attempts from a specific IP address within a time window
    /// </summary>
    /// <param name="ipAddress">IP address</param>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of login attempts</returns>
    Task<List<UserLoginAttempt>> GetIpAttemptsAsync(string ipAddress, DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets suspicious login attempts
    /// </summary>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated suspicious attempts and total count</returns>
    Task<(List<UserLoginAttempt> attempts, int totalCount)> GetSuspiciousAttemptsAsync(
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets recent login attempts for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="count">Number of attempts to retrieve</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of recent login attempts</returns>
    Task<List<UserLoginAttempt>> GetRecentAttemptsAsync(Guid userId, int count = 10,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets login attempts by email or username
    /// </summary>
    /// <param name="emailOrUsername">Email or username</param>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of login attempts</returns>
    Task<List<UserLoginAttempt>> GetAttemptsByEmailOrUsernameAsync(string emailOrUsername,
        DateTime fromDate, DateTime toDate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets login statistics for a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Login statistics</returns>
    Task<Dictionary<string, int>> GetLoginStatisticsAsync(DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Cleans up old login attempts
    /// </summary>
    /// <param name="olderThanDays">Delete attempts older than specified days</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of attempts cleaned up</returns>
    Task<int> CleanupOldAttemptsAsync(int olderThanDays = 90, CancellationToken cancellationToken = default);
}