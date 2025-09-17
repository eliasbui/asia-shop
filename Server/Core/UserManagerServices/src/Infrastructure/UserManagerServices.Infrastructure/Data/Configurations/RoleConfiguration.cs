using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for Role entity
/// Configures table structure, relationships, and constraints for roles
/// </summary>
public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    /// <summary>
    /// Configures the Role entity
    /// </summary>
    /// <param name="builder">Entity type builder for Role</param>
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        // Table configuration
        builder.ToTable("Roles");

        // Primary key
        builder.HasKey(r => r.Id)
            .HasName("PK_Roles");

        // Identity properties
        builder.Property(r => r.Name)
            .HasMaxLength(256)
            .IsRequired();
            
        builder.Property(r => r.NormalizedName)
            .HasMaxLength(256);
            
        builder.Property(r => r.ConcurrencyStamp)
            .IsConcurrencyToken();

        // Business properties
        builder.Property(r => r.Description)
            .HasMaxLength(500)
            .IsRequired();
            
        builder.Property(r => r.IsActive)
            .IsRequired()
            .HasDefaultValue(true);
            
        builder.Property(r => r.IsSystemRole)
            .IsRequired()
            .HasDefaultValue(false);

        // Base entity properties
        builder.Property(r => r.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
            
        builder.Property(r => r.UpdatedAt);
        
        builder.Property(r => r.CreatedBy);
        
        builder.Property(r => r.UpdatedBy);
        
        builder.Property(r => r.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Indexes
        builder.HasIndex(r => r.NormalizedName)
            .HasDatabaseName("idx_roles_normalized_name")
            .IsUnique();
            
        builder.HasIndex(r => r.Name)
            .HasDatabaseName("idx_roles_name")
            .IsUnique();
            
        builder.HasIndex(r => r.IsActive)
            .HasDatabaseName("idx_roles_is_active");
            
        builder.HasIndex(r => r.IsSystemRole)
            .HasDatabaseName("idx_roles_is_system_role");
            
        builder.HasIndex(r => r.CreatedAt)
            .HasDatabaseName("idx_roles_created_at");
            
        builder.HasIndex(r => r.IsDeleted)
            .HasDatabaseName("idx_roles_is_deleted");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(r => r.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_Roles_CreatedBy_Users_Id");
            
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(r => r.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_Roles_UpdatedBy_Users_Id");

        // Query filters
        builder.HasQueryFilter(r => !r.IsDeleted);
    }
}
