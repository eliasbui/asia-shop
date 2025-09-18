#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserMfaAuditLog entity
/// Configures MFA audit logging for security monitoring
/// </summary>
public class UserMfaAuditLogConfiguration : IEntityTypeConfiguration<UserMfaAuditLog>
{
    /// <summary>
    /// Configures the UserMfaAuditLog entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserMfaAuditLog</param>
    public void Configure(EntityTypeBuilder<UserMfaAuditLog> builder)
    {
        // Table configuration
        builder.ToTable("UserMfaAuditLogs");

        // Primary key
        builder.HasKey(al => al.Id)
            .HasName("PK_UserMfaAuditLogs");

        // Business properties
        builder.Property(al => al.Action)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(al => al.Method)
            .HasMaxLength(50);

        builder.Property(al => al.IsSuccess)
            .IsRequired();

        builder.Property(al => al.FailureReason)
            .HasMaxLength(500);

        builder.Property(al => al.IpAddress)
            .HasMaxLength(45);

        builder.Property(al => al.UserAgent)
            .HasMaxLength(1024);

        builder.Property(al => al.LocationInfo)
            .HasColumnType("jsonb");

        builder.Property(al => al.Details)
            .HasColumnType("jsonb");

        builder.Property(al => al.SessionId);

        builder.Property(al => al.RiskScore)
            .HasPrecision(5, 2);

        builder.Property(al => al.TriggeredAlert)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(al => al.Timestamp)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(al => al.DisabledReason)
            .HasMaxLength(500);

        // Base entity properties
        builder.Property(al => al.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(al => al.UpdatedAt);

        builder.Property(al => al.CreatedBy);

        builder.Property(al => al.UpdatedBy);

        builder.Property(al => al.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(al => al.User)
            .WithMany(u => u.UserMfaAuditLogs)
            .HasForeignKey(al => al.UserId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserMfaAuditLogs_Users_UserId");

        builder.HasOne(al => al.MfaSettings)
            .WithMany(ms => ms.AuditLogs)
            .HasForeignKey(al => al.MfaSettingsId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserMfaAuditLogs_UserMfaSettings_MfaSettingsId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(al => al.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserMfaAuditLogs_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(al => al.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserMfaAuditLogs_UpdatedBy_Users_Id");

        // Indexes for performance
        builder.HasIndex(al => al.UserId)
            .HasDatabaseName("idx_user_mfa_audit_logs_user_id");

        builder.HasIndex(al => al.MfaSettingsId)
            .HasDatabaseName("idx_user_mfa_audit_logs_mfa_settings_id");

        builder.HasIndex(al => al.Action)
            .HasDatabaseName("idx_user_mfa_audit_logs_action");

        builder.HasIndex(al => al.IsSuccess)
            .HasDatabaseName("idx_user_mfa_audit_logs_is_success");

        builder.HasIndex(al => al.Timestamp)
            .HasDatabaseName("idx_user_mfa_audit_logs_timestamp");

        builder.HasIndex(al => al.TriggeredAlert)
            .HasDatabaseName("idx_user_mfa_audit_logs_triggered_alert");

        builder.HasIndex(al => al.SessionId)
            .HasDatabaseName("idx_user_mfa_audit_logs_session_id");

        // Composite indexes for common queries
        builder.HasIndex(al => new { al.UserId, al.Timestamp })
            .HasDatabaseName("idx_user_mfa_audit_logs_user_timestamp");

        builder.HasIndex(al => new { al.Action, al.IsSuccess, al.Timestamp })
            .HasDatabaseName("idx_user_mfa_audit_logs_action_success_timestamp");

        // Query filters
        builder.HasQueryFilter(al => !al.IsDeleted);
    }
}