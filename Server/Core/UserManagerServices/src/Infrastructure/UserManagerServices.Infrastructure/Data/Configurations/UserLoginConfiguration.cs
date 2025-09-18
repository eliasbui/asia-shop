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
/// Entity configuration for UserLogin entity
/// Configures external login providers for users
/// </summary>
public class UserLoginConfiguration : IEntityTypeConfiguration<UserLogin>
{
    /// <summary>
    /// Configures the UserLogin entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserLogin</param>
    public void Configure(EntityTypeBuilder<UserLogin> builder)
    {
        // Table configuration
        builder.ToTable("UserLogins");

        // Primary key
        builder.HasKey(ul => ul.Id)
            .HasName("PK_UserLogins");

        // Composite unique index for LoginProvider and ProviderKey
        builder.HasIndex(ul => new { ul.LoginProvider, ul.ProviderKey })
            .HasDatabaseName("idx_user_logins_provider_key")
            .IsUnique();

        // Identity properties
        builder.Property(ul => ul.LoginProvider)
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(ul => ul.ProviderKey)
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(ul => ul.ProviderDisplayName)
            .HasMaxLength(256);

        // Base entity properties
        builder.Property(ul => ul.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ul => ul.UpdatedAt);

        builder.Property(ul => ul.CreatedBy);

        builder.Property(ul => ul.UpdatedBy);

        builder.Property(ul => ul.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne<User>()
            .WithMany(u => u.UserLogins)
            .HasForeignKey(ul => ul.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserLogins_Users_UserId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ul => ul.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserLogins_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ul => ul.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserLogins_UpdatedBy_Users_Id");

        // Indexes
        builder.HasIndex(ul => ul.UserId)
            .HasDatabaseName("idx_user_logins_user_id");

        builder.HasIndex(ul => ul.LoginProvider)
            .HasDatabaseName("idx_user_logins_provider");

        builder.HasIndex(ul => ul.CreatedAt)
            .HasDatabaseName("idx_user_logins_created_at");

        builder.HasIndex(ul => ul.IsDeleted)
            .HasDatabaseName("idx_user_logins_is_deleted");

        // Query filters
        builder.HasQueryFilter(ul => !ul.IsDeleted);
    }
}