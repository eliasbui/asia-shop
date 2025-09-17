using Microsoft.Extensions.Logging;
using System.Text.Json;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Infrastructure.Services;

/// <summary>
/// Service implementation for enhanced account lockout management
/// Provides progressive lockout, suspicious activity detection, and geolocation tracking
/// </summary>
public class AccountLockoutService : IAccountLockoutService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AccountLockoutService> _logger;

    public AccountLockoutService(
        IUnitOfWork unitOfWork,
        ILogger<AccountLockoutService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <summary>
    /// Records a login attempt and evaluates lockout conditions
    /// </summary>
    public async Task<(UserLoginAttempt attempt, bool shouldLockout, UserLockoutHistory? lockout)> RecordLoginAttemptAsync(
        Guid? userId,
        string emailOrUsername,
        bool isSuccessful,
        LoginFailureReasonEnum? failureReason,
        string ipAddress,
        string? userAgent = null,
        string? locationInfo = null,
        string? deviceFingerprint = null,
        Guid? sessionId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Calculate risk score
            var riskScore = await CalculateRiskScoreAsync(userId, ipAddress, userAgent, locationInfo, deviceFingerprint, cancellationToken);

            // Create login attempt record
            var attempt = new UserLoginAttempt
            {
                UserId = userId,
                EmailOrUsername = emailOrUsername,
                IsSuccessful = isSuccessful,
                FailureReason = failureReason,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                LocationInfo = locationInfo,
                DeviceFingerprint = deviceFingerprint,
                RiskScore = riskScore,
                IsSuspicious = riskScore >= 0.7m, // Default threshold
                SessionId = sessionId,
                AttemptedAt = DateTime.UtcNow
            };

            await _unitOfWork.UserLoginAttempts.AddAsync(attempt, cancellationToken);

            UserLockoutHistory? lockout = null;
            bool shouldLockout = false;

            // Only evaluate lockout for failed attempts with valid user IDs
            if (!isSuccessful && userId.HasValue)
            {
                var securitySettings = await GetSecuritySettingsAsync(userId.Value, cancellationToken);
                var recentFailedAttempts = await GetRecentFailedAttemptsAsync(userId.Value, cancellationToken);

                // Check if lockout should be triggered
                if (recentFailedAttempts.Count >= securitySettings.MaxFailedLoginAttempts)
                {
                    shouldLockout = true;
                    attempt.TriggeredLockout = true;

                    // Calculate lockout duration based on progressive lockout
                    var lockoutLevel = await CalculateLockoutLevelAsync(userId.Value, cancellationToken);
                    var lockoutDuration = CalculateLockoutDuration(securitySettings, lockoutLevel);

                    // Create lockout record
                    lockout = new UserLockoutHistory
                    {
                        UserId = userId.Value,
                        LockoutType = securitySettings.EnableProgressiveLockout ? LockoutTypeEnum.Progressive : LockoutTypeEnum.Automatic,
                        LockoutReason = attempt.IsSuspicious ? LockoutReasonEnum.SuspiciousLoginPattern : LockoutReasonEnum.FailedLoginAttempts,
                        LockoutStart = DateTime.UtcNow,
                        LockoutEnd = lockoutDuration.HasValue ? DateTime.UtcNow.AddMinutes(lockoutDuration.Value) : null,
                        DurationMinutes = lockoutDuration,
                        FailedAttemptCount = recentFailedAttempts.Count + 1,
                        LockoutLevel = lockoutLevel,
                        TriggeringIpAddress = ipAddress,
                        IsActive = true,
                        Details = JsonSerializer.Serialize(new
                        {
                            RiskScore = riskScore,
                            SuspiciousActivity = attempt.IsSuspicious,
                            RecentFailedAttempts = recentFailedAttempts.Count,
                            UserAgent = userAgent,
                            LocationInfo = locationInfo
                        })
                    };

                    await _unitOfWork.UserLockoutHistory.AddAsync(lockout, cancellationToken);

                    _logger.LogWarning("User {UserId} locked out due to {FailedAttempts} failed attempts. Lockout level: {LockoutLevel}, Duration: {Duration} minutes",
                        userId.Value, recentFailedAttempts.Count + 1, lockoutLevel, lockoutDuration);
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Login attempt recorded for {EmailOrUsername}. Success: {IsSuccessful}, Risk Score: {RiskScore}, Suspicious: {IsSuspicious}",
                emailOrUsername, isSuccessful, riskScore, attempt.IsSuspicious);

            return (attempt, shouldLockout, lockout);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recording login attempt for {EmailOrUsername}", emailOrUsername);
            throw;
        }
    }

    /// <summary>
    /// Checks if a user is currently locked out
    /// </summary>
    public async Task<UserLockoutHistory?> GetActiveLockoutAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _unitOfWork.UserLockoutHistory.GetActiveLockoutAsync(userId, cancellationToken);
    }

    /// <summary>
    /// Manually locks out a user
    /// </summary>
    public async Task<UserLockoutHistory> ManualLockoutAsync(
        Guid userId,
        LockoutReasonEnum lockoutReason,
        int? durationMinutes = null,
        Guid? lockedByUserId = null,
        string? details = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Check if user is already locked out
            var existingLockout = await GetActiveLockoutAsync(userId, cancellationToken);
            if (existingLockout != null)
            {
                // Release existing lockout first
                await ReleaseLockoutAsync(userId, LockoutReleaseReasonEnum.ManualRelease, lockedByUserId, cancellationToken);
            }

            var lockout = new UserLockoutHistory
            {
                UserId = userId,
                LockoutType = LockoutTypeEnum.Manual,
                LockoutReason = lockoutReason,
                LockoutStart = DateTime.UtcNow,
                LockoutEnd = durationMinutes.HasValue ? DateTime.UtcNow.AddMinutes(durationMinutes.Value) : null,
                DurationMinutes = durationMinutes,
                FailedAttemptCount = 0,
                LockoutLevel = 1,
                IsManualLockout = true,
                LockedByUserId = lockedByUserId,
                IsActive = true,
                Details = details
            };

            await _unitOfWork.UserLockoutHistory.AddAsync(lockout, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogWarning("User {UserId} manually locked out by {LockedByUserId}. Reason: {LockoutReason}, Duration: {Duration} minutes",
                userId, lockedByUserId, lockoutReason, durationMinutes);

            return lockout;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error manually locking out user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Releases an active lockout
    /// </summary>
    public async Task<bool> ReleaseLockoutAsync(
        Guid userId,
        LockoutReleaseReasonEnum releaseReason,
        Guid? releasedByUserId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var activeLockout = await GetActiveLockoutAsync(userId, cancellationToken);
            if (activeLockout == null)
                return false;

            var success = await _unitOfWork.UserLockoutHistory.ReleaseLockoutAsync(
                activeLockout.Id, releaseReason, releasedByUserId, cancellationToken);

            if (success)
            {
                _logger.LogInformation("User {UserId} lockout released by {ReleasedByUserId}. Reason: {ReleaseReason}",
                    userId, releasedByUserId, releaseReason);
            }

            return success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error releasing lockout for user {UserId}", userId);
            throw;
        }
    }

    /// <summary>
    /// Calculates risk score for a login attempt
    /// </summary>
    public async Task<decimal> CalculateRiskScoreAsync(
        Guid? userId,
        string ipAddress,
        string? userAgent = null,
        string? locationInfo = null,
        string? deviceFingerprint = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            decimal riskScore = 0.0m;

            if (!userId.HasValue)
            {
                // Invalid user attempts get higher risk score
                riskScore += 0.3m;
            }
            else
            {
                // Check for unusual IP address
                var recentAttempts = await _unitOfWork.UserLoginAttempts.GetUserAttemptsAsync(
                    userId.Value, DateTime.UtcNow.AddDays(-30), DateTime.UtcNow, cancellationToken);

                var knownIpAddresses = recentAttempts
                    .Where(a => a.IsSuccessful)
                    .Select(a => a.IpAddress)
                    .Distinct()
                    .ToList();

                if (!knownIpAddresses.Contains(ipAddress))
                {
                    riskScore += 0.4m; // New IP address
                }

                // Check for unusual user agent
                if (!string.IsNullOrEmpty(userAgent))
                {
                    var knownUserAgents = recentAttempts
                        .Where(a => a.IsSuccessful && !string.IsNullOrEmpty(a.UserAgent))
                        .Select(a => a.UserAgent)
                        .Distinct()
                        .ToList();

                    if (!knownUserAgents.Any(ua => ua!.Contains(userAgent.Split(' ')[0]))) // Check browser family
                    {
                        riskScore += 0.2m; // New user agent
                    }
                }

                // Check for rapid successive attempts
                var recentFailedAttempts = await GetRecentFailedAttemptsAsync(userId.Value, cancellationToken);
                if (recentFailedAttempts.Count >= 3)
                {
                    riskScore += 0.3m; // Multiple recent failures
                }
            }

            // Check IP reputation (simplified - in real implementation, use external service)
            var ipAttempts = await _unitOfWork.UserLoginAttempts.GetIpAttemptsAsync(
                ipAddress, DateTime.UtcNow.AddHours(-1), DateTime.UtcNow, cancellationToken);

            if (ipAttempts.Count > 10)
            {
                riskScore += 0.4m; // High activity from IP
            }

            // Ensure risk score is between 0 and 1
            return Math.Min(1.0m, Math.Max(0.0m, riskScore));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating risk score for user {UserId} from IP {IpAddress}", userId, ipAddress);
            return 0.5m; // Default moderate risk on error
        }
    }

    /// <summary>
    /// Gets failed login attempts for a user within the configured time window
    /// </summary>
    public async Task<List<UserLoginAttempt>> GetRecentFailedAttemptsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var securitySettings = await GetSecuritySettingsAsync(userId, cancellationToken);
        var fromDate = DateTime.UtcNow.AddMinutes(-securitySettings.FailedAttemptWindowMinutes);
        
        return await _unitOfWork.UserLoginAttempts.GetFailedAttemptsAsync(userId, fromDate, DateTime.UtcNow, cancellationToken);
    }

    /// <summary>
    /// Gets security settings for a user
    /// </summary>
    public async Task<UserSecuritySettings> GetSecuritySettingsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _unitOfWork.UserSecuritySettings.GetUserSecuritySettingsAsync(userId, cancellationToken);
    }

    /// <summary>
    /// Updates security settings for a user
    /// </summary>
    public async Task<UserSecuritySettings> UpdateSecuritySettingsAsync(Guid userId, UserSecuritySettings settings, 
        CancellationToken cancellationToken = default)
    {
        return await _unitOfWork.UserSecuritySettings.CreateOrUpdateUserSettingsAsync(userId, settings, cancellationToken);
    }

    /// <summary>
    /// Checks if an IP address should be blocked
    /// </summary>
    public async Task<bool> ShouldBlockIpAddressAsync(string ipAddress, CancellationToken cancellationToken = default)
    {
        // Check for excessive failed attempts from this IP in the last hour
        var recentAttempts = await _unitOfWork.UserLoginAttempts.GetIpAttemptsAsync(
            ipAddress, DateTime.UtcNow.AddHours(-1), DateTime.UtcNow, cancellationToken);

        var failedAttempts = recentAttempts.Count(a => !a.IsSuccessful);
        
        // Block if more than 20 failed attempts in the last hour
        return failedAttempts > 20;
    }

    /// <summary>
    /// Gets lockout statistics for a date range
    /// </summary>
    public async Task<Dictionary<string, int>> GetLockoutStatisticsAsync(DateTime fromDate, DateTime toDate, 
        CancellationToken cancellationToken = default)
    {
        return await _unitOfWork.UserLockoutHistory.GetLockoutStatisticsAsync(fromDate, toDate, cancellationToken);
    }

    /// <summary>
    /// Gets login attempt statistics for a date range
    /// </summary>
    public async Task<Dictionary<string, int>> GetLoginStatisticsAsync(DateTime fromDate, DateTime toDate, 
        CancellationToken cancellationToken = default)
    {
        return await _unitOfWork.UserLoginAttempts.GetLoginStatisticsAsync(fromDate, toDate, cancellationToken);
    }

    /// <summary>
    /// Performs automatic cleanup of old records
    /// </summary>
    public async Task<int> CleanupOldRecordsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var globalSettings = await _unitOfWork.UserSecuritySettings.GetGlobalDefaultSettingsAsync(cancellationToken);
            
            var attemptsCleanedUp = await _unitOfWork.UserLoginAttempts.CleanupOldAttemptsAsync(
                globalSettings.SecurityLogRetentionDays, cancellationToken);
            
            var historyCleanedUp = await _unitOfWork.UserLockoutHistory.CleanupOldHistoryAsync(
                globalSettings.SecurityLogRetentionDays * 4, cancellationToken); // Keep lockout history longer

            var totalCleanedUp = attemptsCleanedUp + historyCleanedUp;

            _logger.LogInformation("Cleaned up {TotalRecords} old security records ({Attempts} login attempts, {History} lockout history)",
                totalCleanedUp, attemptsCleanedUp, historyCleanedUp);

            return totalCleanedUp;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during security records cleanup");
            throw;
        }
    }

    /// <summary>
    /// Calculates the next lockout level for progressive lockout
    /// </summary>
    private async Task<int> CalculateLockoutLevelAsync(Guid userId, CancellationToken cancellationToken)
    {
        var securitySettings = await GetSecuritySettingsAsync(userId, cancellationToken);
        
        if (!securitySettings.EnableProgressiveLockout)
            return 1;

        // Get lockout count in the last 24 hours
        var recentLockouts = await _unitOfWork.UserLockoutHistory.GetLockoutCountAsync(
            userId, DateTime.UtcNow.AddDays(-1), DateTime.UtcNow, cancellationToken);

        return Math.Min(recentLockouts + 1, 5); // Cap at level 5
    }

    /// <summary>
    /// Calculates lockout duration based on security settings and lockout level
    /// </summary>
    private static int? CalculateLockoutDuration(UserSecuritySettings settings, int lockoutLevel)
    {
        if (!settings.EnableProgressiveLockout)
            return settings.InitialLockoutDurationMinutes;

        var duration = (int)(settings.InitialLockoutDurationMinutes * Math.Pow((double)settings.LockoutDurationMultiplier, lockoutLevel - 1));
        
        return Math.Min(duration, settings.MaxLockoutDurationMinutes);
    }
}
