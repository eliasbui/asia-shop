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
/// Entity configuration for UserApiKey entity
/// Configures API key management for users
/// </summary>
public class UserApiKeyConfiguration : IEntityTypeConfiguration<UserApiKey>
{
    /// <summary>
    /// Configures the UserApiKey entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserApiKey</param>
    public void Configure(EntityTypeBuilder<UserApiKey> builder)
    {
        // Table configuration
        builder.ToTable("UserApiKeys");

        // Primary key
        builder.HasKey(uak => uak.Id)
            .HasName("PK_UserApiKeys");

        // Business properties
        builder.Property(uak => uak.KeyName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(uak => uak.KeyValue)
            .HasMaxLength(512)
            .IsRequired();

        builder.Property(uak => uak.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uak => uak.ExpiresAt)
            .IsRequired();

        builder.Property(uak => uak.LastUsedAt)
            .IsRequired();

        builder.Property(uak => uak.RequestLimit)
            .IsRequired()
            .HasDefaultValue(1000);

        builder.Property(uak => uak.RequestCount)
            .IsRequired()
            .HasDefaultValue(0);

        // JSONB properties for PostgreSQL
        builder.Property(uak => uak.Permissions)
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(uak => uak.IpWhitelist)
            .HasColumnType("jsonb");

        builder.Property(uak => uak.IpBlacklist)
            .HasColumnType("jsonb");

        // Base entity properties
        builder.Property(uak => uak.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(uak => uak.UpdatedAt);

        builder.Property(uak => uak.CreatedBy);

        builder.Property(uak => uak.UpdatedBy);

        builder.Property(uak => uak.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(uak => uak.User)
            .WithMany(u => u.UserApiKeys)
            .HasForeignKey(uak => uak.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserApiKeys_Users_UserId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(uak => uak.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserApiKeys_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(uak => uak.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserApiKeys_UpdatedBy_Users_Id");

        // Indexes
        builder.HasIndex(uak => uak.UserId)
            .HasDatabaseName("idx_user_api_keys_user_id");

        builder.HasIndex(uak => uak.KeyValue)
            .HasDatabaseName("idx_user_api_keys_key_value")
            .IsUnique();

        builder.HasIndex(uak => uak.KeyName)
            .HasDatabaseName("idx_user_api_keys_key_name");

        builder.HasIndex(uak => uak.IsActive)
            .HasDatabaseName("idx_user_api_keys_is_active");

        builder.HasIndex(uak => uak.ExpiresAt)
            .HasDatabaseName("idx_user_api_keys_expires_at");

        builder.HasIndex(uak => uak.LastUsedAt)
            .HasDatabaseName("idx_user_api_keys_last_used_at");

        builder.HasIndex(uak => new { uak.UserId, uak.KeyName })
            .HasDatabaseName("idx_user_api_keys_user_name")
            .IsUnique();

        builder.HasIndex(uak => uak.CreatedAt)
            .HasDatabaseName("idx_user_api_keys_created_at");

        builder.HasIndex(uak => uak.IsDeleted)
            .HasDatabaseName("idx_user_api_keys_is_deleted");

        // Query filters
        builder.HasQueryFilter(uak => !uak.IsDeleted);
    }
}