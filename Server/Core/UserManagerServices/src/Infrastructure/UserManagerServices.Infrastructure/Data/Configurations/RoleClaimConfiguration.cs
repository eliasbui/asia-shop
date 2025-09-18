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
/// Entity configuration for RoleClaim entity
/// Configures role-based claims for authorization
/// </summary>
public class RoleClaimConfiguration : IEntityTypeConfiguration<RoleClaim>
{
    /// <summary>
    /// Configures the RoleClaim entity
    /// </summary>
    /// <param name="builder">Entity type builder for RoleClaim</param>
    public void Configure(EntityTypeBuilder<RoleClaim> builder)
    {
        // Table configuration
        builder.ToTable("RoleClaims");

        // Primary key
        builder.HasKey(rc => rc.Id)
            .HasName("PK_RoleClaims");

        // Identity properties
        builder.Property(rc => rc.ClaimType)
            .HasMaxLength(256);

        builder.Property(rc => rc.ClaimValue)
            .HasMaxLength(1024);

        // Base entity properties
        builder.Property(rc => rc.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(rc => rc.UpdatedAt);

        builder.Property(rc => rc.CreatedBy);

        builder.Property(rc => rc.UpdatedBy);

        builder.Property(rc => rc.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne<Role>()
            .WithMany()
            .HasForeignKey(rc => rc.RoleId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_RoleClaims_Roles_RoleId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(rc => rc.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_RoleClaims_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(rc => rc.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_RoleClaims_UpdatedBy_Users_Id");

        // Indexes
        builder.HasIndex(rc => rc.RoleId)
            .HasDatabaseName("idx_role_claims_role_id");

        builder.HasIndex(rc => rc.ClaimType)
            .HasDatabaseName("idx_role_claims_claim_type");

        builder.HasIndex(rc => new { rc.RoleId, rc.ClaimType })
            .HasDatabaseName("idx_role_claims_role_claim_type");

        builder.HasIndex(rc => rc.CreatedAt)
            .HasDatabaseName("idx_role_claims_created_at");

        builder.HasIndex(rc => rc.IsDeleted)
            .HasDatabaseName("idx_role_claims_is_deleted");

        // Query filters
        builder.HasQueryFilter(rc => !rc.IsDeleted);
    }
}