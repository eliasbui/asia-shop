using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Domain.Entities;

/// <summary>
/// User lockout history entity for tracking account lockouts
/// Supports progressive lockout escalation and audit trail
/// </summary>
[Table("UserLockoutHistory")]
public class UserLockoutHistory : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();

    /// <summary>
    /// User ID who was locked out
    /// </summary>
    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;

    /// <summary>
    /// Type of lockout applied
    /// </summary>
    [Column(TypeName = "int")]
    public LockoutTypeEnum LockoutType { get; set; }

    /// <summary>
    /// Reason for the lockout
    /// </summary>
    [Column(TypeName = "int")]
    public LockoutReasonEnum LockoutReason { get; set; }

    /// <summary>
    /// When the lockout started
    /// </summary>
    public DateTime LockoutStart { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// When the lockout ends (null for permanent)
    /// </summary>
    public DateTime? LockoutEnd { get; set; }

    /// <summary>
    /// Duration of the lockout in minutes
    /// </summary>
    public int? DurationMinutes { get; set; }

    /// <summary>
    /// Number of failed attempts that triggered this lockout
    /// </summary>
    public int FailedAttemptCount { get; set; }

    /// <summary>
    /// Progressive lockout level (1st, 2nd, 3rd offense, etc.)
    /// </summary>
    public int LockoutLevel { get; set; } = 1;

    /// <summary>
    /// IP address that triggered the lockout
    /// </summary>
    public string? TriggeringIpAddress { get; set; }

    /// <summary>
    /// Whether the lockout was manually applied by an admin
    /// </summary>
    public bool IsManualLockout { get; set; } = false;

    /// <summary>
    /// Admin who applied manual lockout
    /// </summary>
    public Guid? LockedByUserId { get; set; }

    /// <summary>
    /// When the lockout was released (if applicable)
    /// </summary>
    public DateTime? ReleasedAt { get; set; }

    /// <summary>
    /// How the lockout was released
    /// </summary>
    [Column(TypeName = "int")]
    public LockoutReleaseReasonEnum? ReleaseReason { get; set; }

    /// <summary>
    /// User who released the lockout
    /// </summary>
    public Guid? ReleasedByUserId { get; set; }

    /// <summary>
    /// Additional details about the lockout
    /// </summary>
    [Column(TypeName = "jsonb")]
    public string? Details { get; set; }

    /// <summary>
    /// Whether this lockout is currently active
    /// </summary>
    public bool IsActive { get; set; } = true;

    // Base entity properties
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
}