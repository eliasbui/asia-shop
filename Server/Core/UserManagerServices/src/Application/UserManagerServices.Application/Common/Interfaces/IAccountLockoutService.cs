#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Application.Common.Interfaces;

/// <summary>
/// Service interface for enhanced account lockout management
/// Provides progressive lockout, suspicious activity detection, and geolocation tracking
/// </summary>
public interface IAccountLockoutService
{
    /// <summary>
    /// Records a login attempt and evaluates lockout conditions
    /// </summary>
    /// <param name="userId">User ID (null for invalid usernames)</param>
    /// <param name="emailOrUsername">Email or username used</param>
    /// <param name="isSuccessful">Whether the attempt was successful</param>
    /// <param name="failureReason">Reason for failure if unsuccessful</param>
    /// <param name="ipAddress">IP address of the attempt</param>
    /// <param name="userAgent">User agent string</param>
    /// <param name="locationInfo">Geolocation information</param>
    /// <param name="deviceFingerprint">Device fingerprint</param>
    /// <param name="sessionId">Session ID if successful</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Login attempt record and lockout information</returns>
    Task<(UserLoginAttempt attempt, bool shouldLockout, UserLockoutHistory? lockout)> RecordLoginAttemptAsync(
        Guid? userId,
        string emailOrUsername,
        bool isSuccessful,
        LoginFailureReasonEnum? failureReason,
        string ipAddress,
        string? userAgent = null,
        string? locationInfo = null,
        string? deviceFingerprint = null,
        Guid? sessionId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if a user is currently locked out
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Active lockout information or null</returns>
    Task<UserLockoutHistory?> GetActiveLockoutAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Manually locks out a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="lockoutReason">Reason for lockout</param>
    /// <param name="durationMinutes">Lockout duration in minutes (null for permanent)</param>
    /// <param name="lockedByUserId">Admin who applied the lockout</param>
    /// <param name="details">Additional details</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Lockout history record</returns>
    Task<UserLockoutHistory> ManualLockoutAsync(
        Guid userId,
        LockoutReasonEnum lockoutReason,
        int? durationMinutes = null,
        Guid? lockedByUserId = null,
        string? details = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Releases an active lockout
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="releaseReason">Reason for release</param>
    /// <param name="releasedByUserId">User who released the lockout</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if released successfully</returns>
    Task<bool> ReleaseLockoutAsync(
        Guid userId,
        LockoutReleaseReasonEnum releaseReason,
        Guid? releasedByUserId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Calculates risk score for a login attempt
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="ipAddress">IP address</param>
    /// <param name="userAgent">User agent</param>
    /// <param name="locationInfo">Location information</param>
    /// <param name="deviceFingerprint">Device fingerprint</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Risk score (0.0 to 1.0)</returns>
    Task<decimal> CalculateRiskScoreAsync(
        Guid? userId,
        string ipAddress,
        string? userAgent = null,
        string? locationInfo = null,
        string? deviceFingerprint = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets failed login attempts for a user within the configured time window
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Failed attempts within the time window</returns>
    Task<List<UserLoginAttempt>> GetRecentFailedAttemptsAsync(Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets security settings for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User security settings</returns>
    Task<UserSecuritySettings> GetSecuritySettingsAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates security settings for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="settings">Security settings</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated security settings</returns>
    Task<UserSecuritySettings> UpdateSecuritySettingsAsync(Guid userId, UserSecuritySettings settings,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if an IP address should be blocked
    /// </summary>
    /// <param name="ipAddress">IP address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if IP should be blocked</returns>
    Task<bool> ShouldBlockIpAddressAsync(string ipAddress, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets lockout statistics for a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Lockout statistics</returns>
    Task<Dictionary<string, int>> GetLockoutStatisticsAsync(DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets login attempt statistics for a date range
    /// </summary>
    /// <param name="fromDate">Start date</param>
    /// <param name="toDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Login attempt statistics</returns>
    Task<Dictionary<string, int>> GetLoginStatisticsAsync(DateTime fromDate, DateTime toDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Performs automatic cleanup of old records
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of records cleaned up</returns>
    Task<int> CleanupOldRecordsAsync(CancellationToken cancellationToken = default);
}