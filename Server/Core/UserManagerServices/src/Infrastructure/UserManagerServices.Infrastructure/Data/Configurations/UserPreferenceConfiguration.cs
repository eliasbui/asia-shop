using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserPreference entity
/// Configures user personalization settings
/// </summary>
public class UserPreferenceConfiguration : IEntityTypeConfiguration<UserPreference>
{
    /// <summary>
    /// Configures the UserPreference entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserPreference</param>
    public void Configure(EntityTypeBuilder<UserPreference> builder)
    {
        // Table configuration
        builder.ToTable("UserPreferences");

        // Primary key
        builder.HasKey(up => up.Id)
            .HasName("PK_UserPreferences");

        // Business properties
        builder.Property(up => up.Key)
            .HasMaxLength(100)
            .IsRequired();
            
        builder.Property(up => up.Value)
            .HasMaxLength(2048)
            .IsRequired();
            
        builder.Property(up => up.Category)
            .HasMaxLength(50)
            .IsRequired();
            
        builder.Property(up => up.IsActive)
            .IsRequired()
            .HasDefaultValue(true);
        
        builder.Property(up => up.DataType)
            .HasMaxLength(50)
            .IsRequired();

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
            .WithMany(u => u.UserPreferences)
            .HasForeignKey(up => up.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserPreferences_Users_UserId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(up => up.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserPreferences_CreatedBy_Users_Id");
            
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(up => up.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserPreferences_UpdatedBy_Users_Id");

        // Indexes
        builder.HasIndex(up => up.UserId)
            .HasDatabaseName("idx_user_preferences_user_id");
            
        builder.HasIndex(up => up.Key)
            .HasDatabaseName("idx_user_preferences_key");
            
        builder.HasIndex(up => up.Category)
            .HasDatabaseName("idx_user_preferences_category");
            
        builder.HasIndex(up => new { up.UserId, up.Key })
            .HasDatabaseName("idx_user_preferences_user_key")
            .IsUnique();
            
        builder.HasIndex(up => new { up.UserId, up.Category })
            .HasDatabaseName("idx_user_preferences_user_category");
            
        builder.HasIndex(up => up.IsActive)
            .HasDatabaseName("idx_user_preferences_is_active");
            
        builder.HasIndex(up => up.CreatedAt)
            .HasDatabaseName("idx_user_preferences_created_at");
            
        builder.HasIndex(up => up.IsDeleted)
            .HasDatabaseName("idx_user_preferences_is_deleted");

        builder.HasQueryFilter(up => !up.IsDeleted);
    }
}
