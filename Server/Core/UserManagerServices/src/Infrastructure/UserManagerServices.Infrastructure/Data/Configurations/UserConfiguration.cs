using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Table configuration
        builder.ToTable("Users");

        // Primary key gen_random_uuid
        builder.HasKey(u => u.Id)
            .HasName("PK_Users");

        // Identity properties
        builder.Property(u => u.UserName)
            .HasMaxLength(256)
            .IsRequired();
            
        builder.Property(u => u.NormalizedUserName)
            .HasMaxLength(256);
            
        builder.Property(u => u.Email)
            .HasMaxLength(256)
            .IsRequired();
        builder.Property(u => u.EmailConfirmed)
            .IsRequired()
            .HasDefaultValue(false);
            
        builder.Property(u => u.NormalizedEmail)
            .HasMaxLength(256);
            
        // Business properties
        builder.Property(u => u.FirstName)
            .HasMaxLength(100)
            .IsRequired();
            
        builder.Property(u => u.LastName)
            .HasMaxLength(100)
            .IsRequired();
            
        builder.Property(u => u.DateOfBirth);
        
        builder.Property(u => u.Gender);
        
        builder.Property(u => u.IsActive)
            .IsRequired()
            .HasDefaultValue(true);
        
        builder.Property(u => u.LastLoginAt)
            .HasColumnType("timestamp with time zone");
        builder.Property(u => u.LastLogoutAt)
            .HasColumnType("timestamp with time zone");
        builder.Property(u => u.LastLoginIp)
            .HasMaxLength(45);
        builder.Property(u => u.LastLogoutIp)
            .HasMaxLength(45);
        
        // Base entity properties
        builder.Property(u => u.CreatedAt)
            .IsRequired();
            
        builder.Property(u => u.UpdatedAt);
        
        builder.Property(u => u.CreatedBy);
        
        builder.Property(u => u.UpdatedBy);
        
        builder.Property(u => u.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);
            
        // Indexes
        builder.HasIndex(u => u.Email)
            .HasDatabaseName("idx_users_email")
            .IsUnique();
            
        builder.HasIndex(u => u.UserName)
            .HasDatabaseName("idx_users_username")
            .IsUnique();

        builder.HasIndex(u => u.PhoneNumber)
            .HasDatabaseName("idx_users_phone_number")
            .IsUnique();

        builder.HasIndex(u => u.CreatedAt)
            .HasDatabaseName("idx_users_created_at");

        builder.HasIndex(u => u.UpdatedAt)
            .HasDatabaseName("idx_users_updated_at");

        builder.HasIndex(u => u.IsDeleted)
            .HasDatabaseName("idx_users_is_deleted");
        
        builder.HasIndex(u => u.IsActive)
            .HasDatabaseName("idx_users_is_active");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(u => u.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_Users_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(u => u.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_Users_UpdatedBy_Users_Id");

        // Relationships with other entities
        builder.HasMany(u => u.UserProfiles)
            .WithOne(up => up.User)
            .HasForeignKey(up => up.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.UserSessions)
            .WithOne(us => us.User)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.UserActivityLogs)
            .WithOne(ual => ual.User)
            .HasForeignKey(ual => ual.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(u => u.UserApiKeys)
            .WithOne(uak => uak.User)
            .HasForeignKey(uak => uak.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.UserPreferences)
            .WithOne(up => up.User)
            .HasForeignKey(up => up.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.UserNotificationSettings)
            .WithOne(uns => uns.User)
            .HasForeignKey(uns => uns.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Query filters
        builder.HasQueryFilter(u => !u.IsDeleted);
    }
}
