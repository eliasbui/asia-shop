using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserProfile entity
/// Configures extended user profile information
/// </summary>
public class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    /// <summary>
    /// Configures the UserProfile entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserProfile</param>
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        // Table configuration
        builder.ToTable("UserProfiles");

        // Primary key
        builder.HasKey(up => up.Id)
            .HasName("PK_UserProfiles");

        // Business properties
        builder.Property(up => up.Address)
            .HasMaxLength(500);

        builder.Property(up => up.PostalCode)
            .HasMaxLength(20);

        builder.Property(up => up.City)
            .HasMaxLength(100);

        builder.Property(up => up.Country)
            .HasMaxLength(100);

        builder.Property(up => up.Province)
            .HasMaxLength(100);

        builder.Property(up => up.State)
            .HasMaxLength(100);

        builder.Property(up => up.District)
            .HasMaxLength(100);

        builder.Property(up => up.TimeZone)
            .HasMaxLength(50)
            .HasDefaultValue("UTC");

        builder.Property(up => up.Language)
            .HasMaxLength(10)
            .HasDefaultValue("en");

        // JSONB properties for PostgreSQL
        builder.Property(up => up.Preferences)
            .HasColumnType("jsonb");

        // Base entity properties
        builder.Property(up => up.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(up => up.UpdatedAt);

        builder.Property(up => up.CreatedBy);

        builder.Property(up => up.UpdatedBy);

        builder.Property(up => up.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(up => up.User)
            .WithMany(u => u.UserProfiles)
            .HasForeignKey(up => up.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserProfiles_Users_UserId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(up => up.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserProfiles_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(up => up.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserProfiles_UpdatedBy_Users_Id");

        // Indexes
        builder.HasIndex(up => up.UserId)
            .HasDatabaseName("idx_user_profiles_user_id");

        builder.HasIndex(up => up.Country)
            .HasDatabaseName("idx_user_profiles_country");

        builder.HasIndex(up => up.City)
            .HasDatabaseName("idx_user_profiles_city");

        builder.HasIndex(up => up.PostalCode)
            .HasDatabaseName("idx_user_profiles_postal_code");

        builder.HasIndex(up => up.TimeZone)
            .HasDatabaseName("idx_user_profiles_timezone");

        builder.HasIndex(up => up.Language)
            .HasDatabaseName("idx_user_profiles_language");

        builder.HasIndex(up => up.CreatedAt)
            .HasDatabaseName("idx_user_profiles_created_at");

        builder.HasIndex(up => up.IsDeleted)
            .HasDatabaseName("idx_user_profiles_is_deleted");

        // Query filters
        builder.HasQueryFilter(up => !up.IsDeleted);
    }
}