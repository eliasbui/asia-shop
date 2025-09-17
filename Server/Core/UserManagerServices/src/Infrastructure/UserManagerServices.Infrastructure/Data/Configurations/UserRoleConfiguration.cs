using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserRole entity
/// Configures many-to-many relationship between Users and Roles with additional properties
/// </summary>
public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    /// <summary>
    /// Configures the UserRole entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserRole</param>
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        // Table configuration
        builder.ToTable("UserRoles");

        // Primary key
        builder.HasKey(ur => ur.Id)
            .HasName("PK_UserRoles");

        // Composite unique index for UserId and RoleId
        builder.HasIndex(ur => new { ur.UserId, ur.RoleId })
            .HasDatabaseName("idx_user_roles_user_role")
            .IsUnique();

        // Business properties
        builder.Property(ur => ur.ExpiresAt);

        // Base entity properties
        builder.Property(ur => ur.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ur => ur.UpdatedAt);

        builder.Property(ur => ur.CreatedBy);

        builder.Property(ur => ur.UpdatedBy);

        builder.Property(ur => ur.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne<User>()
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserRoles_Users_UserId");

        builder.HasOne<Role>()
            .WithMany()
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_UserRoles_Roles_RoleId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ur => ur.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserRoles_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ur => ur.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserRoles_UpdatedBy_Users_Id");

        // Indexes
        builder.HasIndex(ur => ur.UserId)
            .HasDatabaseName("idx_user_roles_user_id");

        builder.HasIndex(ur => ur.RoleId)
            .HasDatabaseName("idx_user_roles_role_id");

        builder.HasIndex(ur => ur.ExpiresAt)
            .HasDatabaseName("idx_user_roles_expires_at");

        builder.HasIndex(ur => ur.CreatedAt)
            .HasDatabaseName("idx_user_roles_created_at");

        builder.HasIndex(ur => ur.IsDeleted)
            .HasDatabaseName("idx_user_roles_is_deleted");

        // Query filters
        builder.HasQueryFilter(ur => !ur.IsDeleted);
    }
}