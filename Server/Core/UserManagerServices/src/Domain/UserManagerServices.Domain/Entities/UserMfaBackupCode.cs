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
/// User MFA backup codes entity
/// Stores one-time use backup codes for MFA recovery
/// </summary>
[Table("UserMfaBackupCodes")]
public class UserMfaBackupCode : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();

    /// <summary>
    /// User ID this backup code belongs to
    /// </summary>
    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;

    /// <summary>
    /// MFA Settings ID this backup code belongs to
    /// </summary>
    public Guid MfaSettingsId { get; set; }

    public virtual UserMfaSettings MfaSettings { get; set; } = null!;

    /// <summary>
    /// Hashed backup code value
    /// </summary>
    public string CodeHash { get; set; } = null!;

    /// <summary>
    /// Whether this backup code has been used
    /// </summary>
    public bool IsUsed { get; set; } = false;

    /// <summary>
    /// When this backup code was used
    /// </summary>
    public DateTime? UsedAt { get; set; }

    /// <summary>
    /// IP address from which the code was used
    /// </summary>
    public string? UsedFromIp { get; set; }

    /// <summary>
    /// User agent from which the code was used
    /// </summary>
    public string? UsedFromUserAgent { get; set; }

    /// <summary>
    /// When this backup code expires
    /// </summary>
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddYears(1);

    /// <summary>
    /// Generation batch ID for tracking code sets
    /// </summary>
    public Guid GenerationBatchId { get; set; }

    // Base entity properties
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
}