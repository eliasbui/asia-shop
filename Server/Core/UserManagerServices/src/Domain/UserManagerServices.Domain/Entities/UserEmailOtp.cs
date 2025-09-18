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
/// User Email OTP entity
/// Stores email-based one-time passwords for MFA fallback
/// </summary>
[Table("UserEmailOtps")]
public class UserEmailOtp : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();

    /// <summary>
    /// User ID this OTP belongs to
    /// </summary>
    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;

    /// <summary>
    /// Hashed OTP code
    /// </summary>
    public string OtpHash { get; set; } = null!;

    /// <summary>
    /// Email address where OTP was sent
    /// </summary>
    public string EmailAddress { get; set; } = null!;

    /// <summary>
    /// Purpose of the OTP (MFA, PasswordReset, etc.)
    /// </summary>
    public string Purpose { get; set; } = null!;

    /// <summary>
    /// Whether this OTP has been used
    /// </summary>
    public bool IsUsed { get; set; } = false;

    /// <summary>
    /// When this OTP was used
    /// </summary>
    public DateTime? UsedAt { get; set; }

    /// <summary>
    /// IP address from which the OTP was used
    /// </summary>
    public string? UsedFromIp { get; set; }

    /// <summary>
    /// User agent from which the OTP was used
    /// </summary>
    public string? UsedFromUserAgent { get; set; }

    /// <summary>
    /// When this OTP expires
    /// </summary>
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddMinutes(10);

    /// <summary>
    /// Number of attempts made to use this OTP
    /// </summary>
    public int AttemptCount { get; set; } = 0;

    /// <summary>
    /// Maximum number of attempts allowed
    /// </summary>
    public int MaxAttempts { get; set; } = 3;

    /// <summary>
    /// Whether this OTP is blocked due to too many attempts
    /// </summary>
    public bool IsBlocked { get; set; } = false;

    /// <summary>
    /// When this OTP was blocked
    /// </summary>
    public DateTime? BlockedAt { get; set; }

    /// <summary>
    /// Session ID associated with this OTP request
    /// </summary>
    public Guid? SessionId { get; set; }

    // Base entity properties
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
}