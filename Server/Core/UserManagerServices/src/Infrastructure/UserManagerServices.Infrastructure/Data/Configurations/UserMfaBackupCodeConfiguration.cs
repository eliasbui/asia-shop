using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserMfaBackupCode entity
/// Configures backup codes for MFA recovery
/// </summary>
public class UserMfaBackupCodeConfiguration : IEntityTypeConfiguration<UserMfaBackupCode>
{
    /// <summary>
    /// Configures the UserMfaBackupCode entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserMfaBackupCode</param>
    public void Configure(EntityTypeBuilder<UserMfaBackupCode> builder)
    {
        // Table configuration
        builder.ToTable("UserMfaBackupCodes");

        // Primary key
        builder.HasKey(bc => bc.Id)
            .HasName("PK_UserMfaBackupCodes");

        // Business properties
        builder.Property(bc => bc.CodeHash)
            .HasMaxLength(512)
            .IsRequired();

        builder.Property(bc => bc.IsUsed)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(bc => bc.UsedAt);

        builder.Property(bc => bc.UsedFromIp)
            .HasMaxLength(45);

        builder.Property(bc => bc.UsedFromUserAgent)
            .HasMaxLength(1024);

        builder.Property(bc => bc.ExpiresAt)
            .IsRequired();

        builder.Property(bc => bc.GenerationBatchId)
            .IsRequired();

        // Base entity properties
        builder.Property(bc => bc.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(bc => bc.UpdatedAt);

        builder.Property(bc => bc.CreatedBy);

        builder.Property(bc => bc.UpdatedBy);

        builder.Property(bc => bc.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(bc => bc.User)
            .WithMany(u => u.UserMfaBackupCodes)
            .HasForeignKey(bc => bc.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserMfaBackupCodes_Users_UserId");

        builder.HasOne(bc => bc.MfaSettings)
            .WithMany(ms => ms.BackupCodes)
            .HasForeignKey(bc => bc.MfaSettingsId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserMfaBackupCodes_UserMfaSettings_MfaSettingsId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(bc => bc.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserMfaBackupCodes_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(bc => bc.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserMfaBackupCodes_UpdatedBy_Users_Id");

        // Indexes for performance
        builder.HasIndex(bc => bc.UserId)
            .HasDatabaseName("idx_user_mfa_backup_codes_user_id");

        builder.HasIndex(bc => bc.MfaSettingsId)
            .HasDatabaseName("idx_user_mfa_backup_codes_mfa_settings_id");

        builder.HasIndex(bc => bc.IsUsed)
            .HasDatabaseName("idx_user_mfa_backup_codes_is_used");

        builder.HasIndex(bc => bc.ExpiresAt)
            .HasDatabaseName("idx_user_mfa_backup_codes_expires_at");

        builder.HasIndex(bc => bc.GenerationBatchId)
            .HasDatabaseName("idx_user_mfa_backup_codes_generation_batch_id");

        // Query filters
        builder.HasQueryFilter(bc => !bc.IsDeleted);
    }
}