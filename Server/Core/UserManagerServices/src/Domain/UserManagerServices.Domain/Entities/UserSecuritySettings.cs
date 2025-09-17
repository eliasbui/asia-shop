using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

/// <summary>
/// User security settings entity for configurable security policies
/// Allows per-user or global security configuration
/// </summary>
[Table("UserSecuritySettings")]
public class UserSecuritySettings : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();

    /// <summary>
    /// User ID (null for global settings)
    /// </summary>
    public Guid? UserId { get; set; }

    public virtual User? User { get; set; }

    /// <summary>
    /// Whether these are global default settings
    /// </summary>
    public bool IsGlobalDefault { get; set; } = false;

    /// <summary>
    /// Maximum failed login attempts before lockout
    /// </summary>
    public int MaxFailedLoginAttempts { get; set; } = 5;

    /// <summary>
    /// Initial lockout duration in minutes
    /// </summary>
    public int InitialLockoutDurationMinutes { get; set; } = 15;

    /// <summary>
    /// Maximum lockout duration in minutes
    /// </summary>
    public int MaxLockoutDurationMinutes { get; set; } = 1440; // 24 hours

    /// <summary>
    /// Lockout duration multiplier for progressive lockout
    /// </summary>
    public decimal LockoutDurationMultiplier { get; set; } = 2.0m;

    /// <summary>
    /// Time window in minutes to count failed attempts
    /// </summary>
    public int FailedAttemptWindowMinutes { get; set; } = 60;

    /// <summary>
    /// Whether to enable progressive lockout (increasing duration)
    /// </summary>
    public bool EnableProgressiveLockout { get; set; } = true;

    /// <summary>
    /// Whether to enable suspicious activity detection
    /// </summary>
    public bool EnableSuspiciousActivityDetection { get; set; } = true;

    /// <summary>
    /// Risk score threshold for suspicious activity
    /// </summary>
    public decimal SuspiciousActivityThreshold { get; set; } = 0.7m;

    /// <summary>
    /// Whether to enable geolocation tracking
    /// </summary>
    public bool EnableGeolocationTracking { get; set; } = true;

    /// <summary>
    /// Whether to block logins from new locations
    /// </summary>
    public bool BlockNewLocationLogins { get; set; } = false;

    /// <summary>
    /// Whether to require email verification for new locations
    /// </summary>
    public bool RequireEmailVerificationForNewLocations { get; set; } = true;

    /// <summary>
    /// Maximum concurrent sessions allowed
    /// </summary>
    public int MaxConcurrentSessions { get; set; } = 5;

    /// <summary>
    /// Session timeout in minutes
    /// </summary>
    public int SessionTimeoutMinutes { get; set; } = 60;

    /// <summary>
    /// Whether to enable device fingerprinting
    /// </summary>
    public bool EnableDeviceFingerprinting { get; set; } = true;

    /// <summary>
    /// Whether to send security alerts via email
    /// </summary>
    public bool SendSecurityAlerts { get; set; } = true;

    /// <summary>
    /// Whether to log all security events
    /// </summary>
    public bool LogSecurityEvents { get; set; } = true;

    /// <summary>
    /// Time in days to retain security logs
    /// </summary>
    public int SecurityLogRetentionDays { get; set; } = 90;

    /// <summary>
    /// Whether to automatically unlock accounts after lockout period
    /// </summary>
    public bool AutoUnlockAfterLockoutPeriod { get; set; } = true;

    /// <summary>
    /// Additional security configuration as JSON
    /// </summary>
    [Column(TypeName = "jsonb")]
    public string? AdditionalSettings { get; set; }

    // Base entity properties
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
}
