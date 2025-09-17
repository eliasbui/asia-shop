namespace UserManagerServices.Domain.Enums;

/// <summary>
/// Enumeration for login failure reasons
/// </summary>
public enum LoginFailureReasonEnum
{
    /// <summary>
    /// Invalid username or email
    /// </summary>
    InvalidUsername = 0,

    /// <summary>
    /// Invalid password
    /// </summary>
    InvalidPassword = 1,

    /// <summary>
    /// Account is locked out
    /// </summary>
    AccountLocked = 2,

    /// <summary>
    /// Account is not confirmed (email not verified)
    /// </summary>
    AccountNotConfirmed = 3,

    /// <summary>
    /// Account is disabled/inactive
    /// </summary>
    AccountDisabled = 4,

    /// <summary>
    /// Two-factor authentication required
    /// </summary>
    TwoFactorRequired = 5,

    /// <summary>
    /// Login not allowed (policy restriction)
    /// </summary>
    LoginNotAllowed = 6,

    /// <summary>
    /// Suspicious activity detected
    /// </summary>
    SuspiciousActivity = 7,

    /// <summary>
    /// Login from new location blocked
    /// </summary>
    NewLocationBlocked = 8,

    /// <summary>
    /// Maximum concurrent sessions exceeded
    /// </summary>
    MaxSessionsExceeded = 9,

    /// <summary>
    /// IP address is blocked
    /// </summary>
    IpAddressBlocked = 10,

    /// <summary>
    /// Device not recognized
    /// </summary>
    UnrecognizedDevice = 11,

    /// <summary>
    /// Rate limit exceeded
    /// </summary>
    RateLimitExceeded = 12,

    /// <summary>
    /// System maintenance mode
    /// </summary>
    SystemMaintenance = 13,

    /// <summary>
    /// Unknown or other error
    /// </summary>
    Unknown = 99
}
