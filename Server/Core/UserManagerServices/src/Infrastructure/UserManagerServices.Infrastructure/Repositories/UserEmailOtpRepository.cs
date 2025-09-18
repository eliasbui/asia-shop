#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserEmailOtp entity
/// </summary>
public class UserEmailOtpRepository : GenericRepository<UserEmailOtp>, IUserEmailOtpRepository
{
    /// <summary>
    /// Initializes a new instance of the UserEmailOtpRepository
    /// </summary>
    /// <param name="context">Database context</param>
    public UserEmailOtpRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    /// <summary>
    /// Gets active email OTPs for a user and purpose
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="purpose">OTP purpose</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of active email OTPs</returns>
    public async Task<List<UserEmailOtp>> GetActiveByUserIdAsync(Guid userId, string purpose,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(otp => otp.UserId == userId &&
                          otp.Purpose == purpose &&
                          !otp.IsUsed &&
                          !otp.IsBlocked &&
                          otp.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(otp => otp.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets email OTPs by email address
    /// </summary>
    /// <param name="emailAddress">Email address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of email OTPs</returns>
    public async Task<List<UserEmailOtp>> GetByEmailAddressAsync(string emailAddress,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(otp => otp.EmailAddress == emailAddress)
            .OrderByDescending(otp => otp.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets expired email OTPs for cleanup
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of expired email OTPs</returns>
    public async Task<List<UserEmailOtp>> GetExpiredOtpsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(otp => otp.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Cleans up expired and used email OTPs
    /// </summary>
    /// <param name="olderThanDays">Delete OTPs older than specified days</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of OTPs cleaned up</returns>
    public async Task<int> CleanupExpiredOtpsAsync(int olderThanDays = 7, CancellationToken cancellationToken = default)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-olderThanDays);

        var otpsToDelete = await _dbSet
            .Where(otp => (otp.IsUsed || otp.ExpiresAt <= DateTime.UtcNow) &&
                          otp.CreatedAt <= cutoffDate)
            .ToListAsync(cancellationToken);

        foreach (var otp in otpsToDelete)
        {
            otp.IsDeleted = true;
            otp.UpdatedAt = DateTime.UtcNow;
        }

        return otpsToDelete.Count;
    }

    /// <summary>
    /// Gets recent OTP attempts for rate limiting
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="purpose">OTP purpose</param>
    /// <param name="withinMinutes">Time window in minutes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of recent OTP attempts</returns>
    public async Task<int> GetRecentOtpAttemptsAsync(Guid userId, string purpose, int withinMinutes = 5,
        CancellationToken cancellationToken = default)
    {
        var cutoffTime = DateTime.UtcNow.AddMinutes(-withinMinutes);

        return await _dbSet
            .CountAsync(otp => otp.UserId == userId &&
                               otp.Purpose == purpose &&
                               otp.CreatedAt >= cutoffTime,
                cancellationToken);
    }
}