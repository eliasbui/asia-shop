namespace UserManagerServices.Domain.Enums;

/// <summary>
/// Enumeration for MFA-specific actions for audit logging
/// </summary>
public enum MfaActionEnum
{
    /// <summary>
    /// MFA was enabled for the user
    /// </summary>
    MfaEnabled = 0,

    /// <summary>
    /// MFA was disabled for the user
    /// </summary>
    MfaDisabled = 1,

    /// <summary>
    /// TOTP was set up
    /// </summary>
    TotpSetup = 2,

    /// <summary>
    /// TOTP was verified successfully
    /// </summary>
    TotpVerified = 3,

    /// <summary>
    /// TOTP verification failed
    /// </summary>
    TotpFailed = 4,

    /// <summary>
    /// TOTP was disabled
    /// </summary>
    TotpDisabled = 5,

    /// <summary>
    /// Email OTP was sent
    /// </summary>
    EmailOtpSent = 6,

    /// <summary>
    /// Email OTP was verified successfully
    /// </summary>
    EmailOtpVerified = 7,

    /// <summary>
    /// Email OTP verification failed
    /// </summary>
    EmailOtpFailed = 8,

    /// <summary>
    /// Email OTP expired
    /// </summary>
    EmailOtpExpired = 9,

    /// <summary>
    /// Backup codes were generated
    /// </summary>
    BackupCodesGenerated = 10,

    /// <summary>
    /// A backup code was used successfully
    /// </summary>
    BackupCodeUsed = 11,

    /// <summary>
    /// Backup code usage failed
    /// </summary>
    BackupCodeFailed = 12,

    /// <summary>
    /// Backup codes were regenerated
    /// </summary>
    BackupCodesRegenerated = 13,

    /// <summary>
    /// MFA was bypassed by admin
    /// </summary>
    MfaBypassed = 14,

    /// <summary>
    /// MFA enforcement was enabled
    /// </summary>
    MfaEnforced = 15,

    /// <summary>
    /// MFA enforcement was disabled
    /// </summary>
    MfaEnforcementDisabled = 16,

    /// <summary>
    /// Suspicious MFA activity detected
    /// </summary>
    SuspiciousActivity = 17,

    /// <summary>
    /// MFA recovery was initiated
    /// </summary>
    MfaRecoveryInitiated = 18,

    /// <summary>
    /// MFA recovery was completed
    /// </summary>
    MfaRecoveryCompleted = 19
}