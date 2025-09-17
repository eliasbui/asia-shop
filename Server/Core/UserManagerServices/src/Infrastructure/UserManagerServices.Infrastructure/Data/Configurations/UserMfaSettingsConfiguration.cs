using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserMfaSettings entity
/// Configures MFA settings and relationships
/// </summary>
public class UserMfaSettingsConfiguration : IEntityTypeConfiguration<UserMfaSettings>
{
    /// <summary>
    /// Configures the UserMfaSettings entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserMfaSettings</param>
    public void Configure(EntityTypeBuilder<UserMfaSettings> builder)
    {
        // Table configuration
        builder.ToTable("UserMfaSettings");

        // Primary key
        builder.HasKey(ums => ums.Id)
            .HasName("PK_UserMfaSettings");

        // Business properties
        builder.Property(ums => ums.IsEnabled)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(ums => ums.IsTotpEnabled)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(ums => ums.IsEmailOtpEnabled)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(ums => ums.IsBackupCodesEnabled)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(ums => ums.TotpSecretKey)
            .HasMaxLength(512);

        builder.Property(ums => ums.BackupCodesRemaining)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(ums => ums.LastUsedAt);

        builder.Property(ums => ums.EnabledAt);

        builder.Property(ums => ums.DisabledAt);

        builder.Property(ums => ums.DisabledReason)
            .HasMaxLength(500);

        builder.Property(ums => ums.IsEnforced)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(ums => ums.EnforcementGracePeriodEnd);

        // Base entity properties
        builder.Property(ums => ums.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ums => ums.UpdatedAt);

        builder.Property(ums => ums.CreatedBy);

        builder.Property(ums => ums.UpdatedBy);

        builder.Property(ums => ums.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(ums => ums.User)
            .WithMany(u => u.UserMfaSettings)
            .HasForeignKey(ums => ums.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserMfaSettings_Users_UserId");

        builder.HasMany(ums => ums.BackupCodes)
            .WithOne(bc => bc.MfaSettings)
            .HasForeignKey(bc => bc.MfaSettingsId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(ums => ums.AuditLogs)
            .WithOne(al => al.MfaSettings)
            .HasForeignKey(al => al.MfaSettingsId)
            .OnDelete(DeleteBehavior.SetNull);

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ums => ums.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserMfaSettings_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ums => ums.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserMfaSettings_UpdatedBy_Users_Id");

        // Indexes for performance
        builder.HasIndex(ums => ums.UserId)
            .HasDatabaseName("idx_user_mfa_settings_user_id");

        builder.HasIndex(ums => ums.IsEnabled)
            .HasDatabaseName("idx_user_mfa_settings_is_enabled");

        builder.HasIndex(ums => ums.IsEnforced)
            .HasDatabaseName("idx_user_mfa_settings_is_enforced");

        // Unique constraint - one MFA settings per user
        builder.HasIndex(ums => ums.UserId)
            .IsUnique()
            .HasDatabaseName("uq_user_mfa_settings_user_id");

        // Query filters
        builder.HasQueryFilter(ums => !ums.IsDeleted);
    }
}