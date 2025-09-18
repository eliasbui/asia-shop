#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using UserManagerServices.Application.Features.Mfa.Models;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Application.Common.Interfaces;

/// <summary>
/// Interface for Multi-Factor Authentication service
/// Provides comprehensive MFA management including TOTP, backup codes, and email OTP
/// </summary>
public interface IMfaService
{
    #region MFA Setup and Configuration

    /// <summary>
    /// Enables MFA for a user with TOTP
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="totpCode">TOTP code for verification</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>MFA settings and backup codes</returns>
    Task<(UserMfaSettings mfaSettings, List<string> backupCodes)> EnableMfaAsync(
        Guid userId, string totpCode, CancellationToken cancellationToken = default);

    /// <summary>
    /// Disables MFA for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="reason">Reason for disabling MFA</param>
    /// <param name="disabledBy">ID of user/admin disabling MFA</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success status</returns>
    Task<bool> DisableMfaAsync(Guid userId, string? reason = null, Guid? disabledBy = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Sets up TOTP for a user (generates secret and QR code)
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Secret key, QR code URI, and setup session ID</returns>
    Task<(string secretKey, string qrCodeUri, string setupSessionId)> SetupTotpAsync(Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Regenerates QR code for an existing setup session
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="setupSessionId">Setup session ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>New secret key, QR code URI, and setup session ID</returns>
    Task<(string secretKey, string qrCodeUri, string setupSessionId)> RegenerateQrCodeAsync(Guid userId,
        string setupSessionId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets temporary setup data from cache
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="setupSessionId">Setup session ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Temporary setup data if found</returns>
    Task<TempMfaSetupData?> GetTempSetupDataAsync(Guid userId, string setupSessionId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Verifies TOTP setup with a code using setup session ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="totpCode">TOTP code to verify</param>
    /// <param name="setupSessionId">Setup session ID (optional, will search all active sessions if not provided)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if verification successful</returns>
    Task<bool> VerifyTotpSetupAsync(Guid userId, string totpCode, string? setupSessionId = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region MFA Verification

    /// <summary>
    /// Verifies MFA using TOTP code
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="totpCode">TOTP code</param>
    /// <param name="ipAddress">Client IP address</param>
    /// <param name="userAgent">Client user agent</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Verification result</returns>
    Task<bool> VerifyTotpAsync(Guid userId, string totpCode, string? ipAddress = null,
        string? userAgent = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Verifies MFA using backup code
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="backupCode">Backup code</param>
    /// <param name="ipAddress">Client IP address</param>
    /// <param name="userAgent">Client user agent</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Verification result</returns>
    Task<bool> VerifyBackupCodeAsync(Guid userId, string backupCode, string? ipAddress = null,
        string? userAgent = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Verifies MFA using email OTP
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="emailOtp">Email OTP code</param>
    /// <param name="ipAddress">Client IP address</param>
    /// <param name="userAgent">Client user agent</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Verification result</returns>
    Task<bool> VerifyEmailOtpAsync(Guid userId, string emailOtp, string? ipAddress = null,
        string? userAgent = null, CancellationToken cancellationToken = default);

    #endregion

    #region Backup Codes

    /// <summary>
    /// Generates new backup codes for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="count">Number of backup codes to generate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of backup codes</returns>
    Task<List<string>> GenerateBackupCodesAsync(Guid userId, int count = 10,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the count of remaining backup codes for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of remaining backup codes</returns>
    Task<int> GetRemainingBackupCodesCountAsync(Guid userId,
        CancellationToken cancellationToken = default);

    #endregion

    #region Email OTP

    /// <summary>
    /// Sends email OTP to user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="purpose">Purpose of the OTP</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if OTP sent successfully</returns>
    Task<bool> SendEmailOtpAsync(Guid userId, string purpose = "MFA",
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets recent email OTP attempts for rate limiting
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="purpose">OTP purpose</param>
    /// <param name="withinMinutes">Time window in minutes</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of recent attempts</returns>
    Task<int> GetRecentEmailOtpAttemptsAsync(Guid userId, string purpose, int withinMinutes = 5,
        CancellationToken cancellationToken = default);

    #endregion

    #region MFA Status and Information

    /// <summary>
    /// Gets MFA settings for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>MFA settings or null if not found</returns>
    Task<UserMfaSettings?> GetMfaSettingsAsync(Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if MFA is enabled for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if MFA is enabled</returns>
    Task<bool> IsMfaEnabledAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if MFA is enforced for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if MFA is enforced</returns>
    Task<bool> IsMfaEnforcedAsync(Guid userId, CancellationToken cancellationToken = default);

    #endregion

    #region MFA Audit and Logging

    /// <summary>
    /// Logs MFA activity for audit purposes
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="action">MFA action</param>
    /// <param name="method">MFA method used</param>
    /// <param name="isSuccess">Whether the action was successful</param>
    /// <param name="failureReason">Failure reason if applicable</param>
    /// <param name="ipAddress">Client IP address</param>
    /// <param name="userAgent">Client user agent</param>
    /// <param name="additionalDetails">Additional details</param>
    /// <param name="reason"></param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task</returns>
    Task LogMfaActivityAsync(Guid userId, MfaActionEnum action, string? method = null,
        bool isSuccess = true, string? failureReason = null, string? ipAddress = null,
        string? userAgent = null, Dictionary<string, object>? additionalDetails = null,
        string? reason = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets MFA audit logs for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated MFA audit logs</returns>
    Task<(List<UserMfaAuditLog> logs, int totalCount)> GetMfaAuditLogsAsync(Guid userId,
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default);

    #endregion

    #region MFA Recovery

    /// <summary>
    /// Initiates MFA recovery process for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="reason">Reason for recovery</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Recovery token or process ID</returns>
    Task<string> InitiateMfaRecoveryAsync(Guid userId, string reason,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Completes MFA recovery process
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="recoveryToken">Recovery token</param>
    /// <param name="newSecretKey">New TOTP secret key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>New backup codes</returns>
    Task<List<string>> CompleteMfaRecoveryAsync(Guid userId, string recoveryToken,
        string newSecretKey, CancellationToken cancellationToken = default);

    #endregion
}