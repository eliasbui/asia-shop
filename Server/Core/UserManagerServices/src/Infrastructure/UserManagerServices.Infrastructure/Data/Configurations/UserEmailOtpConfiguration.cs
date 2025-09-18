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
/// Entity configuration for UserEmailOtp entity
/// Configures email-based OTP for MFA fallback
/// </summary>
public class UserEmailOtpConfiguration : IEntityTypeConfiguration<UserEmailOtp>
{
    /// <summary>
    /// Configures the UserEmailOtp entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserEmailOtp</param>
    public void Configure(EntityTypeBuilder<UserEmailOtp> builder)
    {
        // Table configuration
        builder.ToTable("UserEmailOtps");

        // Primary key
        builder.HasKey(otp => otp.Id)
            .HasName("PK_UserEmailOtps");

        // Business properties
        builder.Property(otp => otp.OtpHash)
            .HasMaxLength(512)
            .IsRequired();

        builder.Property(otp => otp.EmailAddress)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(otp => otp.Purpose)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(otp => otp.IsUsed)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(otp => otp.UsedAt);

        builder.Property(otp => otp.UsedFromIp)
            .HasMaxLength(45);

        builder.Property(otp => otp.UsedFromUserAgent)
            .HasMaxLength(1024);

        builder.Property(otp => otp.ExpiresAt)
            .IsRequired();

        builder.Property(otp => otp.AttemptCount)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(otp => otp.MaxAttempts)
            .IsRequired()
            .HasDefaultValue(3);

        builder.Property(otp => otp.IsBlocked)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(otp => otp.BlockedAt);

        builder.Property(otp => otp.SessionId);

        // Base entity properties
        builder.Property(otp => otp.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(otp => otp.UpdatedAt);

        builder.Property(otp => otp.CreatedBy);

        builder.Property(otp => otp.UpdatedBy);

        builder.Property(otp => otp.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(otp => otp.User)
            .WithMany(u => u.UserEmailOtps)
            .HasForeignKey(otp => otp.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserEmailOtps_Users_UserId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(otp => otp.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserEmailOtps_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(otp => otp.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserEmailOtps_UpdatedBy_Users_Id");

        // Indexes for performance
        builder.HasIndex(otp => otp.UserId)
            .HasDatabaseName("idx_user_email_otps_user_id");

        builder.HasIndex(otp => otp.EmailAddress)
            .HasDatabaseName("idx_user_email_otps_email_address");

        builder.HasIndex(otp => otp.Purpose)
            .HasDatabaseName("idx_user_email_otps_purpose");

        builder.HasIndex(otp => otp.IsUsed)
            .HasDatabaseName("idx_user_email_otps_is_used");

        builder.HasIndex(otp => otp.ExpiresAt)
            .HasDatabaseName("idx_user_email_otps_expires_at");

        builder.HasIndex(otp => otp.IsBlocked)
            .HasDatabaseName("idx_user_email_otps_is_blocked");

        builder.HasIndex(otp => otp.SessionId)
            .HasDatabaseName("idx_user_email_otps_session_id");

        // Composite indexes for common queries
        builder.HasIndex(otp => new { otp.UserId, otp.Purpose, otp.IsUsed })
            .HasDatabaseName("idx_user_email_otps_user_purpose_used");

        builder.HasIndex(otp => new { otp.ExpiresAt, otp.IsUsed })
            .HasDatabaseName("idx_user_email_otps_expires_used");

        // Query filters
        builder.HasQueryFilter(otp => !otp.IsDeleted);
    }
}