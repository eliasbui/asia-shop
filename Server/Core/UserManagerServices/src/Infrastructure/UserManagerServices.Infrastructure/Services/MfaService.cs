#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Application.Features.Mfa.Models;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Domain.Interfaces;

namespace UserManagerServices.Infrastructure.Services;

/// <summary>
/// Multi-Factor Authentication service implementation
/// Provides comprehensive MFA management including TOTP, backup codes, and email OTP
/// </summary>
public class MfaService(
    IUnitOfWork unitOfWork,
    ITotpService totpService,
    IPasswordHashingService passwordHashingService,
    IEmailService emailService,
    UserManager<User> userManager,
    ICacheService cacheService,
    ILogger<MfaService> logger)
    : IMfaService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    private readonly ITotpService _totpService = totpService ?? throw new ArgumentNullException(nameof(totpService));

    private readonly IPasswordHashingService _passwordHashingService =
        passwordHashingService ?? throw new ArgumentNullException(nameof(passwordHashingService));

    private readonly IEmailService
        _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));

    private readonly UserManager<User> _userManager =
        userManager ?? throw new ArgumentNullException(nameof(userManager));

    private readonly ICacheService
        _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));

    private readonly ILogger<MfaService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    #region MFA Setup and Configuration

    public async Task<(UserMfaSettings mfaSettings, List<string> backupCodes)> EnableMfaAsync(
        Guid userId, string totpCode, CancellationToken cancellationToken = default)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new InvalidOperationException("User not found");

            string secretKey;

            // First try to get from temporary cache (new flow)
            var tempData = await GetLatestTempSetupDataAsync(userId, cancellationToken);
            if (tempData != null)
            {
                // Verify TOTP code with temporary data
                if (!_totpService.ValidateTotpCode(tempData.SecretKey, totpCode))
                {
                    await LogMfaActivityAsync(userId, MfaActionEnum.TotpFailed, "TOTP", false,
                        "Invalid TOTP code during MFA enable", cancellationToken: cancellationToken);
                    throw new InvalidOperationException("Invalid TOTP code");
                }

                secretKey = tempData.SecretKey;

                // Clean up temporary cache data
                var cacheKey = $"mfa_setup_{userId}_{tempData.SetupSessionId}";
                await _cacheService.RemoveAsync(cacheKey, cancellationToken);
            }
            else
            {
                // Fallback to database (legacy flow)
                var mfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);
                if (mfaSettings?.TotpSecretKey == null)
                    throw new InvalidOperationException("MFA setup not initiated. Please setup TOTP first.");

                var decryptedSecret = _totpService.DecryptSecretKey(mfaSettings.TotpSecretKey);
                if (!_totpService.ValidateTotpCode(decryptedSecret, totpCode))
                {
                    await LogMfaActivityAsync(userId, MfaActionEnum.TotpFailed, "TOTP", false,
                        "Invalid TOTP code during MFA enable", cancellationToken: cancellationToken);
                    throw new InvalidOperationException("Invalid TOTP code");
                }

                secretKey = decryptedSecret;
            }

            // Create or update MFA settings with the verified secret
            var finalMfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);
            if (finalMfaSettings == null)
            {
                finalMfaSettings = new UserMfaSettings
                {
                    UserId = userId,
                    TotpSecretKey = _totpService.EncryptSecretKey(secretKey),
                    CreatedBy = userId
                };
                await _unitOfWork.UserMfaSettings.AddAsync(finalMfaSettings, cancellationToken);
            }
            else
            {
                finalMfaSettings.TotpSecretKey = _totpService.EncryptSecretKey(secretKey);
            }

            // Enable MFA
            finalMfaSettings.IsEnabled = true;
            finalMfaSettings.IsTotpEnabled = true;
            finalMfaSettings.IsBackupCodesEnabled = true;
            finalMfaSettings.EnabledAt = DateTime.UtcNow;
            finalMfaSettings.UpdatedAt = DateTime.UtcNow;

            // Generate backup codes
            var backupCodes = await GenerateBackupCodesAsync(userId, 10, cancellationToken);
            finalMfaSettings.BackupCodesRemaining = backupCodes.Count;

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await LogMfaActivityAsync(userId, MfaActionEnum.MfaEnabled, "TOTP", true,
                cancellationToken: cancellationToken);

            _logger.LogInformation("MFA enabled successfully for user {UserId}", userId);
            return (finalMfaSettings, backupCodes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error enabling MFA for user {UserId}", userId);
            throw;
        }
    }

    public async Task<bool> DisableMfaAsync(Guid userId, string? reason = null, Guid? disabledBy = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var mfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);
            if (mfaSettings == null || !mfaSettings.IsEnabled) return true; // Already disabled

            // Check if MFA is enforced
            if (mfaSettings.IsEnforced) throw new InvalidOperationException("MFA is enforced and cannot be disabled");

            // Disable MFA
            mfaSettings.IsEnabled = false;
            mfaSettings.IsTotpEnabled = false;
            mfaSettings.IsEmailOtpEnabled = false;
            mfaSettings.IsBackupCodesEnabled = false;
            mfaSettings.DisabledAt = DateTime.UtcNow;
            mfaSettings.DisabledReason = reason;
            mfaSettings.UpdatedAt = DateTime.UtcNow;
            mfaSettings.UpdatedBy = disabledBy;

            // Invalidate all backup codes
            var backupCodes = await _unitOfWork.UserMfaBackupCodes.GetByUserIdAsync(userId, cancellationToken);
            foreach (var code in backupCodes)
            {
                code.IsDeleted = true;
                code.UpdatedAt = DateTime.UtcNow;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await LogMfaActivityAsync(userId, MfaActionEnum.MfaDisabled, reason: reason,
                cancellationToken: cancellationToken);

            _logger.LogInformation("MFA disabled for user {UserId}. Reason: {Reason}", userId, reason);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error disabling MFA for user {UserId}", userId);
            throw;
        }
    }

    public async Task<(string secretKey, string qrCodeUri, string setupSessionId)> GenerateQrCodeAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new InvalidOperationException("User not found");

            // Generate secret key
            var secretKey = _totpService.GenerateSecretKey();
            var encryptedSecret = _totpService.EncryptSecretKey(secretKey);
            var qrCodeUri = _totpService.GenerateQrCodeUri(user, secretKey);
            var qrCodeBase64 = _totpService.GenerateQrCodeBase64(qrCodeUri);

            // Store temporarily in cache instead of database
            var setupSessionId = Guid.NewGuid().ToString();
            var tempSetupData = new TempMfaSetupData
            {
                UserId = userId,
                SecretKey = secretKey,
                QrCodeUri = qrCodeUri,
                FormattedSecretKey = _totpService.FormatSecretKeyForBackup(secretKey),
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddSeconds(60),
                SetupSessionId = setupSessionId
            };

            var cacheKey = $"mfa_setup_{userId}_{setupSessionId}";
            await _cacheService.SetAsync(cacheKey, tempSetupData, TimeSpan.FromSeconds(60), cancellationToken);

            // Also store the latest session ID for easier lookup
            var userSetupKey = $"mfa_latest_setup_{userId}";
            await _cacheService.SetAsync(userSetupKey, setupSessionId, TimeSpan.FromSeconds(60), cancellationToken);

            await LogMfaActivityAsync(userId, MfaActionEnum.TotpSetup, "TOTP", true,
                cancellationToken: cancellationToken);

            _logger.LogInformation("QR code generated for user {UserId} with session {SessionId}", userId,
                setupSessionId);
            return (secretKey, qrCodeUri, setupSessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating QR code for user {UserId}", userId);
            throw;
        }
    }

    public async Task<(string secretKey, string qrCodeUri, string setupSessionId)> RegenerateQrCodeAsync(Guid userId,
        string setupSessionId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Get existing setup data from cache
            var existingData = await GetTempSetupDataAsync(userId, setupSessionId, cancellationToken);
            if (existingData == null) throw new InvalidOperationException("Setup session not found");
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new InvalidOperationException("User not found");

            var qrCodeUri = _totpService.GenerateQrCodeUri(user, existingData.SecretKey);

            // Create new setup session
            var newSetupSessionId = Guid.NewGuid().ToString();
            var newTempSetupData = new TempMfaSetupData
            {
                UserId = userId,
                SecretKey = existingData.SecretKey,
                QrCodeUri = qrCodeUri,
                FormattedSecretKey = existingData.FormattedSecretKey,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddSeconds(60),
                SetupSessionId = newSetupSessionId
            };

            // Remove old cache entry
            var oldCacheKey = $"mfa_setup_{userId}_{setupSessionId}";
            await _cacheService.RemoveAsync(oldCacheKey, cancellationToken);

            // Store new cache entry
            var newCacheKey = $"mfa_setup_{userId}_{newSetupSessionId}";
            await _cacheService.SetAsync(newCacheKey, newTempSetupData, TimeSpan.FromSeconds(60), cancellationToken);

            // Update the latest session ID
            var userSetupKey = $"mfa_latest_setup_{userId}";
            await _cacheService.SetAsync(userSetupKey, newSetupSessionId, TimeSpan.FromSeconds(60), cancellationToken);

            await LogMfaActivityAsync(userId, MfaActionEnum.TotpSetup, "TOTP", true,
                "QR code regenerated", cancellationToken: cancellationToken);

            _logger.LogInformation("QR code regenerated for user {UserId} with new session {SessionId}", userId,
                newSetupSessionId);
            return (existingData.SecretKey, qrCodeUri, newSetupSessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error regenerating QR code for user {UserId}", userId);
            throw;
        }
    }

    public async Task<TempMfaSetupData?> GetTempSetupDataAsync(Guid userId, string setupSessionId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var cacheKey = $"mfa_setup_{userId}_{setupSessionId}";
            return await _cacheService.GetAsync<TempMfaSetupData>(cacheKey, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting temporary setup data for user {UserId}", userId);
            return null;
        }
    }

    public async Task<bool> VerifyTotpSetupAsync(Guid userId, string totpCode, string? setupSessionId = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // If setup session ID is provided, use it directly
            if (!string.IsNullOrEmpty(setupSessionId))
            {
                var tempData = await GetTempSetupDataAsync(userId, setupSessionId, cancellationToken);
                if (tempData != null)
                {
                    var isValid = _totpService.ValidateTotpCode(tempData.SecretKey, totpCode);

                    await LogMfaActivityAsync(userId, isValid ? MfaActionEnum.TotpVerified : MfaActionEnum.TotpFailed,
                        "TOTP", isValid, isValid ? null : "Invalid TOTP code during setup verification",
                        cancellationToken: cancellationToken);

                    return isValid;
                }
            }

            // Try to get latest temporary setup data
            var latestTempData = await GetLatestTempSetupDataAsync(userId, cancellationToken);
            if (latestTempData != null)
            {
                var isValid = _totpService.ValidateTotpCode(latestTempData.SecretKey, totpCode);

                await LogMfaActivityAsync(userId, isValid ? MfaActionEnum.TotpVerified : MfaActionEnum.TotpFailed,
                    "TOTP", isValid, isValid ? null : "Invalid TOTP code during setup verification",
                    cancellationToken: cancellationToken);

                return isValid;
            }

            // Fallback to database (legacy flow)
            var mfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);
            if (mfaSettings?.TotpSecretKey != null)
            {
                var decryptedSecret = _totpService.DecryptSecretKey(mfaSettings.TotpSecretKey);
                var isValid = _totpService.ValidateTotpCode(decryptedSecret, totpCode);

                await LogMfaActivityAsync(userId, isValid ? MfaActionEnum.TotpVerified : MfaActionEnum.TotpFailed,
                    "TOTP", isValid, isValid ? null : "Invalid TOTP code during setup verification",
                    cancellationToken: cancellationToken);

                return isValid;
            }

            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying TOTP setup for user {UserId}", userId);
            return false;
        }
    }

    private async Task<TempMfaSetupData?> GetLatestTempSetupDataAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // In production, you'd want to maintain a separate cache entry with active session IDs for a user
            // For this implementation, we'll use a simpler approach with a user-specific cache key
            var userSetupKey = $"mfa_latest_setup_{userId}";
            var latestSessionId = await _cacheService.GetAsync<string>(userSetupKey, cancellationToken);

            if (!string.IsNullOrEmpty(latestSessionId))
                return await GetTempSetupDataAsync(userId, latestSessionId, cancellationToken);

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting latest temporary setup data for user {UserId}", userId);
            return null;
        }
    }

    #endregion

    #region MFA Verification

    public async Task<bool> VerifyTotpAsync(Guid userId, string totpCode, string? ipAddress = null,
        string? userAgent = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var mfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);
            if (mfaSettings?.TotpSecretKey == null || !mfaSettings.IsTotpEnabled) return false;

            var decryptedSecret = _totpService.DecryptSecretKey(mfaSettings.TotpSecretKey);
            var isValid = _totpService.ValidateTotpCode(decryptedSecret, totpCode);

            if (isValid)
            {
                mfaSettings.LastUsedAt = DateTime.UtcNow;
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            await LogMfaActivityAsync(userId, isValid ? MfaActionEnum.TotpVerified : MfaActionEnum.TotpFailed,
                "TOTP", isValid, isValid ? null : "Invalid TOTP code", ipAddress, userAgent,
                cancellationToken: cancellationToken);

            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying TOTP for user {UserId}", userId);
            return false;
        }
    }

    public async Task<bool> VerifyBackupCodeAsync(Guid userId, string backupCode, string? ipAddress = null,
        string? userAgent = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var mfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);
            if (mfaSettings == null || !mfaSettings.IsBackupCodesEnabled) return false;

            var backupCodes = await _unitOfWork.UserMfaBackupCodes.GetActiveByUserIdAsync(userId, cancellationToken);

            foreach (var code in backupCodes)
                if (_passwordHashingService.VerifyPassword(backupCode, code.CodeHash))
                {
                    // Mark code as used
                    code.IsUsed = true;
                    code.UsedAt = DateTime.UtcNow;
                    code.UsedFromIp = ipAddress;
                    code.UsedFromUserAgent = userAgent;
                    code.UpdatedAt = DateTime.UtcNow;

                    // Update remaining count
                    mfaSettings.BackupCodesRemaining = Math.Max(0, mfaSettings.BackupCodesRemaining - 1);
                    mfaSettings.LastUsedAt = DateTime.UtcNow;

                    await _unitOfWork.SaveChangesAsync(cancellationToken);

                    await LogMfaActivityAsync(userId, MfaActionEnum.BackupCodeUsed, "BackupCode", true,
                        ipAddress: ipAddress, userAgent: userAgent, cancellationToken: cancellationToken);

                    return true;
                }

            await LogMfaActivityAsync(userId, MfaActionEnum.BackupCodeFailed, "BackupCode", false,
                "Invalid backup code", ipAddress, userAgent, cancellationToken: cancellationToken);

            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying backup code for user {UserId}", userId);
            return false;
        }
    }

    public async Task<bool> VerifyEmailOtpAsync(Guid userId, string emailOtp, string? ipAddress = null,
        string? userAgent = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var activeOtps = await _unitOfWork.UserEmailOtps.GetActiveByUserIdAsync(userId, "MFA", cancellationToken);
            var otp = activeOtps.FirstOrDefault(o => !o.IsUsed && !o.IsBlocked && o.ExpiresAt > DateTime.UtcNow);

            if (otp == null) return false;

            // Check attempt count
            otp.AttemptCount++;
            if (otp.AttemptCount > otp.MaxAttempts)
            {
                otp.IsBlocked = true;
                otp.BlockedAt = DateTime.UtcNow;
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return false;
            }

            var isValid = _passwordHashingService.VerifyPassword(emailOtp, otp.OtpHash);

            if (isValid)
            {
                otp.IsUsed = true;
                otp.UsedAt = DateTime.UtcNow;
                otp.UsedFromIp = ipAddress;
                otp.UsedFromUserAgent = userAgent;

                var mfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);
                if (mfaSettings != null) mfaSettings.LastUsedAt = DateTime.UtcNow;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await LogMfaActivityAsync(userId, isValid ? MfaActionEnum.EmailOtpVerified : MfaActionEnum.EmailOtpFailed,
                "EmailOTP", isValid, isValid ? null : "Invalid email OTP", ipAddress, userAgent,
                cancellationToken: cancellationToken);

            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying email OTP for user {UserId}", userId);
            return false;
        }
    }

    #endregion

    #region Backup Codes

    public async Task<List<string>> GenerateBackupCodesAsync(Guid userId, int count = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var mfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);
            if (mfaSettings == null) throw new InvalidOperationException("MFA not set up for user");

            // Invalidate existing backup codes
            var existingCodes = await _unitOfWork.UserMfaBackupCodes.GetByUserIdAsync(userId, cancellationToken);
            foreach (var code in existingCodes) code.IsDeleted = true;

            // Generate new backup codes
            var backupCodes = new List<string>();
            var batchId = Guid.NewGuid();

            for (var i = 0; i < count; i++)
            {
                var code = GenerateBackupCode();
                var hashedCode = _passwordHashingService.HashPassword(code);

                var backupCodeEntity = new UserMfaBackupCode
                {
                    UserId = userId,
                    MfaSettingsId = mfaSettings.Id,
                    CodeHash = hashedCode,
                    GenerationBatchId = batchId,
                    CreatedBy = userId
                };

                await _unitOfWork.UserMfaBackupCodes.AddAsync(backupCodeEntity, cancellationToken);
                backupCodes.Add(code);
            }

            mfaSettings.BackupCodesRemaining = count;
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await LogMfaActivityAsync(userId, MfaActionEnum.BackupCodesGenerated, "BackupCode", true,
                additionalDetails: new Dictionary<string, object> { ["Count"] = count },
                cancellationToken: cancellationToken);

            return backupCodes;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating backup codes for user {UserId}", userId);
            throw;
        }
    }

    public async Task<int> GetRemainingBackupCodesCountAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var mfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);
            return mfaSettings?.BackupCodesRemaining ?? 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting remaining backup codes count for user {UserId}", userId);
            return 0;
        }
    }

    #endregion

    #region Email OTP

    public async Task<bool> SendEmailOtpAsync(Guid userId, string purpose = "MFA",
        CancellationToken cancellationToken = default)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user?.Email == null) return false;

            // Generate OTP
            var otp = GenerateEmailOtp();
            var hashedOtp = _passwordHashingService.HashPassword(otp);

            var emailOtpEntity = new UserEmailOtp
            {
                UserId = userId,
                OtpHash = hashedOtp,
                EmailAddress = user.Email,
                Purpose = purpose,
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                CreatedBy = userId
            };

            await _unitOfWork.UserEmailOtps.AddAsync(emailOtpEntity, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Send email
            var emailSent = await _emailService.SendTemplatedEmailAsync(
                user.Email,
                "mfa-otp",
                new Dictionary<string, object>
                {
                    { "FirstName", user.FirstName ?? "User" },
                    { "OtpCode", otp },
                    { "ExpiryMinutes", "10" },
                    { "Purpose", purpose }
                },
                cancellationToken);

            await LogMfaActivityAsync(userId, MfaActionEnum.EmailOtpSent, "EmailOTP", emailSent,
                emailSent ? null : "Failed to send email", cancellationToken: cancellationToken);

            return emailSent;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email OTP for user {UserId}", userId);
            return false;
        }
    }

    public async Task<int> GetRecentEmailOtpAttemptsAsync(Guid userId, string purpose, int withinMinutes = 5,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return await _unitOfWork.UserEmailOtps.GetRecentOtpAttemptsAsync(userId, purpose, withinMinutes,
                cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting recent email OTP attempts for user {UserId}", userId);
            return 0;
        }
    }

    #endregion

    #region MFA Status and Information

    public async Task<UserMfaSettings?> GetMfaSettingsAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            return await _unitOfWork.UserMfaSettings.GetByUserIdAsync(userId, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting MFA settings for user {UserId}", userId);
            return null;
        }
    }

    public async Task<bool> IsMfaEnabledAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var settings = await GetMfaSettingsAsync(userId, cancellationToken);
        return settings?.IsEnabled ?? false;
    }

    public async Task<bool> IsMfaEnforcedAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var settings = await GetMfaSettingsAsync(userId, cancellationToken);
        return settings?.IsEnforced ?? false;
    }

    #endregion

    #region MFA Audit and Logging

    public async Task LogMfaActivityAsync(Guid userId, MfaActionEnum action,
        string? method = null,
        bool isSuccess = true, string? failureReason = null, string? ipAddress = null,
        string? userAgent = null, Dictionary<string, object>? additionalDetails = null, string? reason = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var mfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);

            var auditLog = new UserMfaAuditLog
            {
                UserId = userId,
                MfaSettingsId = mfaSettings?.Id,
                Action = action,
                Method = method,
                IsSuccess = isSuccess,
                FailureReason = failureReason,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                Details = additionalDetails != null ? JsonSerializer.Serialize(additionalDetails) : null,
                CreatedBy = userId,
                DisabledReason = reason ?? null
            };

            await _unitOfWork.UserMfaAuditLogs.AddAsync(auditLog, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging MFA activity for user {UserId}", userId);
            // Don't throw - logging failures shouldn't break the main flow
        }
    }

    public async Task<(List<UserMfaAuditLog> logs, int totalCount)> GetMfaAuditLogsAsync(Guid userId,
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _unitOfWork.UserMfaAuditLogs.GetPagedByUserIdAsync(userId, pageNumber, pageSize,
                cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting MFA audit logs for user {UserId}", userId);
            return (new List<UserMfaAuditLog>(), 0);
        }
    }

    #endregion

    #region MFA Recovery

    public async Task<string> InitiateMfaRecoveryAsync(Guid userId, string reason,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var recoveryToken = Guid.NewGuid().ToString("N");

            await LogMfaActivityAsync(userId, MfaActionEnum.MfaRecoveryInitiated, reason: reason,
                additionalDetails: new Dictionary<string, object> { ["RecoveryToken"] = recoveryToken },
                cancellationToken: cancellationToken);

            // In a real implementation, you'd store this token securely with expiration
            return recoveryToken;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initiating MFA recovery for user {UserId}", userId);
            throw;
        }
    }

    public async Task<List<string>> CompleteMfaRecoveryAsync(Guid userId, string recoveryToken,
        string newSecretKey, CancellationToken cancellationToken = default)
    {
        try
        {
            // In a real implementation, you'd validate the recovery token

            var mfaSettings = await GetMfaSettingsAsync(userId, cancellationToken);
            if (mfaSettings == null) throw new InvalidOperationException("MFA settings not found");

            // Update secret key
            var encryptedSecret = _totpService.EncryptSecretKey(newSecretKey);
            mfaSettings.TotpSecretKey = encryptedSecret;
            mfaSettings.UpdatedAt = DateTime.UtcNow;

            // Generate new backup codes
            var backupCodes = await GenerateBackupCodesAsync(userId, 10, cancellationToken);

            await LogMfaActivityAsync(userId, MfaActionEnum.MfaRecoveryCompleted,
                cancellationToken: cancellationToken);

            return backupCodes;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing MFA recovery for user {UserId}", userId);
            throw;
        }
    }

    #endregion

    #region Private Helper Methods

    private static string GenerateBackupCode()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString("D6");
    }

    private static string GenerateEmailOtp()
    {
        var random = new Random();
        return random.Next(100000, 999999).ToString("D6");
    }

    #endregion
}
