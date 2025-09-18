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
/// Entity configuration for UserToken entity
/// Configures authentication tokens for users
/// </summary>
public class UserTokenConfiguration : IEntityTypeConfiguration<UserToken>
{
    /// <summary>
    /// Configures the UserToken entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserToken</param>
    public void Configure(EntityTypeBuilder<UserToken> builder)
    {
        // Table configuration
        builder.ToTable("UserTokens");

        // Primary key - Use composite key for ASP.NET Identity compatibility
        builder.HasKey(ut => new { ut.UserId, ut.LoginProvider, ut.Name })
            .HasName("PK_UserTokens");

        // Add index for the Id field instead
        builder.HasIndex(ut => ut.Id)
            .HasDatabaseName("idx_user_tokens_id")
            .IsUnique();

        // Identity properties
        builder.Property(ut => ut.LoginProvider)
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(ut => ut.Name)
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(ut => ut.Value)
            .HasMaxLength(2048);

        // Base entity properties
        builder.Property(ut => ut.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ut => ut.UpdatedAt);

        builder.Property(ut => ut.CreatedBy);

        builder.Property(ut => ut.UpdatedBy);

        builder.Property(ut => ut.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne<User>()
            .WithMany(u => u.UserTokens)
            .HasForeignKey(ut => ut.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserTokens_Users_UserId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ut => ut.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserTokens_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ut => ut.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserTokens_UpdatedBy_Users_Id");

        // Indexes
        builder.HasIndex(ut => ut.UserId)
            .HasDatabaseName("idx_user_tokens_user_id");

        builder.HasIndex(ut => ut.LoginProvider)
            .HasDatabaseName("idx_user_tokens_provider");

        builder.HasIndex(ut => ut.Name)
            .HasDatabaseName("idx_user_tokens_name");

        builder.HasIndex(ut => ut.CreatedAt)
            .HasDatabaseName("idx_user_tokens_created_at");

        builder.HasIndex(ut => ut.IsDeleted)
            .HasDatabaseName("idx_user_tokens_is_deleted");

        // Query filters
        builder.HasQueryFilter(ut => !ut.IsDeleted);
    }
}