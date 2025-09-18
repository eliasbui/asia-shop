#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Repository interface for UserEmailOtp entity
/// </summary>
public interface IUserEmailOtpRepository : IGenericRepository<UserEmailOtp>
{
    /// <summary>
    /// Gets active email OTPs for a user and purpose
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="purpose">OTP purpose</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of active email OTPs</returns>
    Task<List<UserEmailOtp>> GetActiveByUserIdAsync(Guid userId, string purpose,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets email OTPs by email address
    /// </summary>
    /// <param name="emailAddress">Email address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of email OTPs</returns>
    Task<List<UserEmailOtp>> GetByEmailAddressAsync(string emailAddress,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets expired email OTPs for cleanup
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of expired email OTPs</returns>
    Task<List<UserEmailOtp>> GetExpiredOtpsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Cleans up expired and used email OTPs
    /// </summary>
    /// <param name="olderThanDays">Delete OTPs older than specified days</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of OTPs cleaned up</returns>
    Task<int> CleanupExpiredOtpsAsync(int olderThanDays = 7, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets recent OTP attempts for rate limiting
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="purpose">OTP purpose</param>
    /// <param name="withinMinutes">Time window in minutes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of recent OTP attempts</returns>
    Task<int> GetRecentOtpAttemptsAsync(Guid userId, string purpose, int withinMinutes = 5,
        CancellationToken cancellationToken = default);
}