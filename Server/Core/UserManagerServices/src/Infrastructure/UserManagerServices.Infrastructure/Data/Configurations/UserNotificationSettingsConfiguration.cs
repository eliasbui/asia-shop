using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserNotificationSettings entity
/// Configures comprehensive user notification preferences
/// </summary>
public class UserNotificationSettingsConfiguration : IEntityTypeConfiguration<UserNotificationSettings>
{
    /// <summary>
    /// Configures the UserNotificationSettings entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserNotificationSettings</param>
    public void Configure(EntityTypeBuilder<UserNotificationSettings> builder)
    {
        // Table configuration
        builder.ToTable("UserNotificationSettings");

        // Primary key
        builder.HasKey(uns => uns.Id)
            .HasName("PK_UserNotificationSettings");

        // Email notification properties
        builder.Property(uns => uns.EmailEnabled)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uns => uns.EmailSecurityAlerts)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uns => uns.EmailAccountUpdates)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uns => uns.EmailMarketing)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(uns => uns.EmailNewsletter)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(uns => uns.EmailSystemNotifications)
            .IsRequired()
            .HasDefaultValue(true);

        // SMS notification properties
        builder.Property(uns => uns.SmsEnabled)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(uns => uns.SmsSecurityAlerts)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(uns => uns.SmsAccountUpdates)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(uns => uns.SmsTwoFactorAuth)
            .IsRequired()
            .HasDefaultValue(false);

        // Push notification properties
        builder.Property(uns => uns.PushEnabled)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uns => uns.PushSecurityAlerts)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uns => uns.PushAccountUpdates)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uns => uns.PushSystemNotifications)
            .IsRequired()
            .HasDefaultValue(true);

        // In-app notification properties
        builder.Property(uns => uns.InAppEnabled)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uns => uns.InAppSecurityAlerts)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uns => uns.InAppAccountUpdates)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uns => uns.InAppSystemNotifications)
            .IsRequired()
            .HasDefaultValue(true);

        // Global notification properties
        builder.Property(uns => uns.DoNotDisturb)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(uns => uns.DoNotDisturbStart);

        builder.Property(uns => uns.DoNotDisturbEnd);

        builder.Property(uns => uns.TimeZone)
            .HasMaxLength(100)
            .HasDefaultValue("UTC");

        builder.Property(uns => uns.Frequency)
            .HasMaxLength(50)
            .HasDefaultValue("immediate");

        // Base entity properties
        builder.Property(uns => uns.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(uns => uns.UpdatedAt);

        builder.Property(uns => uns.CreatedBy);

        builder.Property(uns => uns.UpdatedBy);

        builder.Property(uns => uns.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(uns => uns.User)
            .WithOne()
            .HasForeignKey<UserNotificationSettings>(uns => uns.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserNotificationSettings_Users_UserId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(uns => uns.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserNotificationSettings_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(uns => uns.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserNotificationSettings_UpdatedBy_Users_Id");

        // Indexes
        builder.HasIndex(uns => uns.UserId)
            .HasDatabaseName("idx_user_notification_settings_user_id")
            .IsUnique(); // One notification settings per user

        builder.HasIndex(uns => uns.CreatedAt)
            .HasDatabaseName("idx_user_notification_settings_created_at");

        builder.HasIndex(uns => uns.IsDeleted)
            .HasDatabaseName("idx_user_notification_settings_is_deleted");

        builder.HasIndex(uns => uns.EmailEnabled)
            .HasDatabaseName("idx_user_notification_settings_email_enabled");

        builder.HasIndex(uns => uns.SmsEnabled)
            .HasDatabaseName("idx_user_notification_settings_sms_enabled");

        builder.HasIndex(uns => uns.PushEnabled)
            .HasDatabaseName("idx_user_notification_settings_push_enabled");

        builder.HasIndex(uns => uns.InAppEnabled)
            .HasDatabaseName("idx_user_notification_settings_inapp_enabled");

        // Query filters
        builder.HasQueryFilter(uns => !uns.IsDeleted);
    }
}