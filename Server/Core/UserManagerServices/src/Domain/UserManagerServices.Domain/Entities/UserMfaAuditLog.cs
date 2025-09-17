using System.ComponentModel.DataAnnotations.Schema;
using UserManagerServices.Domain.Common;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Domain.Entities;

/// <summary>
/// User MFA audit log entity
/// Tracks all MFA-related activities for security monitoring
/// </summary>
[Table("UserMfaAuditLogs")]
public class UserMfaAuditLog : IBaseEntity
{
    public Guid Id { get; } = Guid.CreateVersion7();

    /// <summary>
    /// User ID this audit log belongs to
    /// </summary>
    public Guid UserId { get; set; }

    public virtual User User { get; set; } = null!;

    /// <summary>
    /// MFA Settings ID this audit log belongs to
    /// </summary>
    public Guid? MfaSettingsId { get; set; }

    public virtual UserMfaSettings? MfaSettings { get; set; }

    /// <summary>
    /// Type of MFA action performed
    /// </summary>
    [Column(TypeName = "int")]
    public MfaActionEnum Action { get; set; }

    /// <summary>
    /// MFA method used (TOTP, Email, BackupCode)
    /// </summary>
    public string? Method { get; set; }

    /// <summary>
    /// Whether the MFA attempt was successful
    /// </summary>
    public bool IsSuccess { get; set; }

    /// <summary>
    /// Failure reason if applicable
    /// </summary>
    public string? FailureReason { get; set; }

    /// <summary>
    /// IP address from which the action was performed
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// User agent from which the action was performed
    /// </summary>
    public string? UserAgent { get; set; }

    /// <summary>
    /// Geolocation information if available
    /// </summary>
    [Column(TypeName = "jsonb")]
    public string? LocationInfo { get; set; }

    /// <summary>
    /// Additional details about the MFA action
    /// </summary>
    [Column(TypeName = "jsonb")]
    public string? Details { get; set; }

    /// <summary>
    /// Session ID if applicable
    /// </summary>
    public Guid? SessionId { get; set; }

    /// <summary>
    /// Risk score calculated for this action
    /// </summary>
    public decimal? RiskScore { get; set; }

    /// <summary>
    /// Whether this action triggered security alerts
    /// </summary>
    public bool TriggeredAlert { get; set; } = false;

    public string? DisabledReason { get; set; } = null!;

    /// <summary>
    /// Timestamp of the MFA action
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Base entity properties
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
}