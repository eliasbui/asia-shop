using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Domain.Entities;

/// <summary>
/// User login attempt entity for tracking authentication attempts
/// Supports progressive lockout and suspicious activity detection
/// </summary>
[Table("UserLoginAttempts")]
public class UserLoginAttempt : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();

    /// <summary>
    /// User ID (nullable for failed attempts with invalid usernames)
    /// </summary>
    public Guid? UserId { get; set; }

    public virtual User? User { get; set; }

    /// <summary>
    /// Email or username used in the attempt
    /// </summary>
    public string EmailOrUsername { get; set; } = null!;

    /// <summary>
    /// Whether the login attempt was successful
    /// </summary>
    public bool IsSuccessful { get; set; }

    /// <summary>
    /// Type of failure if unsuccessful
    /// </summary>
    [Column(TypeName = "int")]
    public LoginFailureReasonEnum? FailureReason { get; set; }

    /// <summary>
    /// IP address of the attempt
    /// </summary>
    public string IpAddress { get; set; } = null!;

    /// <summary>
    /// User agent string
    /// </summary>
    public string? UserAgent { get; set; }

    /// <summary>
    /// Geolocation information
    /// </summary>
    [Column(TypeName = "jsonb")]
    public string? LocationInfo { get; set; }

    /// <summary>
    /// Device fingerprint for tracking
    /// </summary>
    public string? DeviceFingerprint { get; set; }

    /// <summary>
    /// Risk score calculated for this attempt
    /// </summary>
    public decimal RiskScore { get; set; } = 0.0m;

    /// <summary>
    /// Whether this attempt was flagged as suspicious
    /// </summary>
    public bool IsSuspicious { get; set; } = false;

    /// <summary>
    /// Whether this attempt triggered account lockout
    /// </summary>
    public bool TriggeredLockout { get; set; } = false;

    /// <summary>
    /// Session ID if login was successful
    /// </summary>
    public Guid? SessionId { get; set; }

    /// <summary>
    /// Additional details about the attempt
    /// </summary>
    [Column(TypeName = "jsonb")]
    public string? Details { get; set; }

    /// <summary>
    /// Timestamp of the attempt
    /// </summary>
    public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;

    // Base entity properties
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
}
