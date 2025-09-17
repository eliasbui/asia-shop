using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserClaim entity
/// Configures user claims for identity and authorization
/// </summary>
public class UserClaimConfiguration : IEntityTypeConfiguration<UserClaim>
{
    /// <summary>
    /// Configures the UserClaim entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserClaim</param>
    public void Configure(EntityTypeBuilder<UserClaim> builder)
    {
        // Table configuration
        builder.ToTable("UserClaims");

        // Primary key
        builder.HasKey(uc => uc.Id)
            .HasName("PK_UserClaims");

        // Identity properties
        builder.Property(uc => uc.ClaimType)
            .HasMaxLength(256);

        builder.Property(uc => uc.ClaimValue)
            .HasMaxLength(1024);

        // Base entity properties
        builder.Property(uc => uc.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(uc => uc.UpdatedAt);

        builder.Property(uc => uc.CreatedBy);

        builder.Property(uc => uc.UpdatedBy);

        builder.Property(uc => uc.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne<User>()
            .WithMany(u => u.UserClaims)
            .HasForeignKey(uc => uc.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserClaims_Users_UserId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(uc => uc.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserClaims_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(uc => uc.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserClaims_UpdatedBy_Users_Id");

        // Indexes
        builder.HasIndex(uc => uc.UserId)
            .HasDatabaseName("idx_user_claims_user_id");

        builder.HasIndex(uc => uc.ClaimType)
            .HasDatabaseName("idx_user_claims_claim_type");

        builder.HasIndex(uc => new { uc.UserId, uc.ClaimType })
            .HasDatabaseName("idx_user_claims_user_claim_type");

        builder.HasIndex(uc => uc.CreatedAt)
            .HasDatabaseName("idx_user_claims_created_at");

        builder.HasIndex(uc => uc.IsDeleted)
            .HasDatabaseName("idx_user_claims_is_deleted");

        // Query filters
        builder.HasQueryFilter(uc => !uc.IsDeleted);
    }
}