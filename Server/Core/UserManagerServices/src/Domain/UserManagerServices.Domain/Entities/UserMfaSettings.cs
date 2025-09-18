#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Entities;

/// <summary>
/// User Multi-Factor Authentication settings entity
/// Manages MFA configuration and preferences for users
/// </summary>
[Table("UserMfaSettings")]
public class UserMfaSettings : IBaseEntity
{
    public Guid Id { get; init; } = Guid.CreateVersion7();

    /// <summary>
    /// User ID this MFA setting belongs to
    /// </summary>
    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;

    /// <summary>
    /// Whether MFA is enabled for this user
    /// </summary>
    public bool IsEnabled { get; set; } = false;

    /// <summary>
    /// Whether TOTP (Time-based One-Time Password) is enabled
    /// </summary>
    public bool IsTotpEnabled { get; set; } = false;

    /// <summary>
    /// Whether Email OTP is enabled as fallback
    /// </summary>
    public bool IsEmailOtpEnabled { get; set; } = false;

    /// <summary>
    /// Whether backup codes are enabled
    /// </summary>
    public bool IsBackupCodesEnabled { get; set; } = false;

    /// <summary>
    /// Encrypted TOTP secret key
    /// </summary>
    public string? TotpSecretKey { get; set; }

    /// <summary>
    /// Number of backup codes remaining
    /// </summary>
    public int BackupCodesRemaining { get; set; } = 0;

    /// <summary>
    /// Last time MFA was used successfully
    /// </summary>
    public DateTime? LastUsedAt { get; set; }

    /// <summary>
    /// Date when MFA was first enabled
    /// </summary>
    public DateTime? EnabledAt { get; set; }

    /// <summary>
    /// Date when MFA was disabled (if applicable)
    /// </summary>
    public DateTime? DisabledAt { get; set; }

    /// <summary>
    /// Reason for disabling MFA
    /// </summary>
    public string? DisabledReason { get; set; }

    /// <summary>
    /// Whether MFA is enforced by admin policy
    /// </summary>
    public bool IsEnforced { get; set; } = false;

    /// <summary>
    /// Grace period end date for MFA enforcement
    /// </summary>
    public DateTime? EnforcementGracePeriodEnd { get; set; }

    // Navigation properties
    public virtual List<UserMfaBackupCode> BackupCodes { get; set; } = null!;
    public virtual List<UserMfaAuditLog> AuditLogs { get; set; } = null!;

    // Base entity properties
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
}