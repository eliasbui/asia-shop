namespace UserManagerServices.Domain.Enums;

/// <summary>
/// Enumeration for lockout types
/// </summary>
public enum LockoutTypeEnum
{
    /// <summary>
    /// Automatic lockout due to failed login attempts
    /// </summary>
    Automatic = 0,

    /// <summary>
    /// Manual lockout by administrator
    /// </summary>
    Manual = 1,

    /// <summary>
    /// Lockout due to suspicious activity
    /// </summary>
    SuspiciousActivity = 2,

    /// <summary>
    /// Lockout due to security policy violation
    /// </summary>
    PolicyViolation = 3,

    /// <summary>
    /// Lockout due to compromised account
    /// </summary>
    CompromisedAccount = 4,

    /// <summary>
    /// Temporary lockout for maintenance
    /// </summary>
    Maintenance = 5,

    /// <summary>
    /// Progressive lockout (escalated duration)
    /// </summary>
    Progressive = 6
}

/// <summary>
/// Enumeration for lockout reasons
/// </summary>
public enum LockoutReasonEnum
{
    /// <summary>
    /// Too many failed login attempts
    /// </summary>
    FailedLoginAttempts = 0,

    /// <summary>
    /// Suspicious login pattern detected
    /// </summary>
    SuspiciousLoginPattern = 1,

    /// <summary>
    /// Multiple failed MFA attempts
    /// </summary>
    FailedMfaAttempts = 2,

    /// <summary>
    /// Login from suspicious location
    /// </summary>
    SuspiciousLocation = 3,

    /// <summary>
    /// Unusual device or browser
    /// </summary>
    UnusualDevice = 4,

    /// <summary>
    /// Rate limit exceeded
    /// </summary>
    RateLimitExceeded = 5,

    /// <summary>
    /// Manual lockout by administrator
    /// </summary>
    ManualLockout = 6,

    /// <summary>
    /// Account reported as compromised
    /// </summary>
    CompromisedAccount = 7,

    /// <summary>
    /// Policy violation
    /// </summary>
    PolicyViolation = 8,

    /// <summary>
    /// Brute force attack detected
    /// </summary>
    BruteForceAttack = 9,

    /// <summary>
    /// System security measure
    /// </summary>
    SecurityMeasure = 10
}

/// <summary>
/// Enumeration for lockout release reasons
/// </summary>
public enum LockoutReleaseReasonEnum
{
    /// <summary>
    /// Automatic release after timeout
    /// </summary>
    AutomaticTimeout = 0,

    /// <summary>
    /// Manual release by administrator
    /// </summary>
    ManualRelease = 1,

    /// <summary>
    /// Released after successful email verification
    /// </summary>
    EmailVerification = 2,

    /// <summary>
    /// Released after successful MFA verification
    /// </summary>
    MfaVerification = 3,

    /// <summary>
    /// Released after password reset
    /// </summary>
    PasswordReset = 4,

    /// <summary>
    /// Released by system policy
    /// </summary>
    SystemPolicy = 5,

    /// <summary>
    /// Released after security review
    /// </summary>
    SecurityReview = 6
}
