using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserNotificationSetting entity
/// Configures user notification preferences and channels
/// </summary>
public class UserNotificationSettingConfiguration : IEntityTypeConfiguration<UserNotificationSetting>
{
    /// <summary>
    /// Configures the UserNotificationSetting entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserNotificationSetting</param>
    public void Configure(EntityTypeBuilder<UserNotificationSetting> builder)
    {
        // Table configuration
        builder.ToTable("UserNotificationSettings");

        // Primary key
        builder.HasKey(uns => uns.Id)
            .HasName("PK_UserNotificationSettings");

        // Business properties
        builder.Property(uns => uns.NotificationType)
            .HasMaxLength(100)
            .IsRequired();
            
        builder.Property(uns => uns.Channel)
            .HasMaxLength(50)
            .IsRequired();
            
        builder.Property(uns => uns.IsEnabled)
            .IsRequired()
            .HasDefaultValue(true);

        // JSONB properties for PostgreSQL
        builder.Property(uns => uns.Settings)
            .HasColumnType("jsonb")
            .IsRequired();

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
            .WithMany(u => u.UserNotificationSettings)
            .HasForeignKey(uns => uns.UserId)
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
            .HasDatabaseName("idx_user_notification_settings_user_id");
            
        builder.HasIndex(uns => uns.NotificationType)
            .HasDatabaseName("idx_user_notification_settings_type");
            
        builder.HasIndex(uns => uns.Channel)
            .HasDatabaseName("idx_user_notification_settings_channel");
            
        builder.HasIndex(uns => new { uns.UserId, uns.NotificationType, uns.Channel })
            .HasDatabaseName("idx_user_notification_settings_user_type_channel")
            .IsUnique();
            
        builder.HasIndex(uns => uns.IsEnabled)
            .HasDatabaseName("idx_user_notification_settings_is_enabled");
            
        builder.HasIndex(uns => uns.CreatedAt)
            .HasDatabaseName("idx_user_notification_settings_created_at");
            
        builder.HasIndex(uns => uns.IsDeleted)
            .HasDatabaseName("idx_user_notification_settings_is_deleted");

        // Query filters
        builder.HasQueryFilter(uns => !uns.IsDeleted);
    }
}
