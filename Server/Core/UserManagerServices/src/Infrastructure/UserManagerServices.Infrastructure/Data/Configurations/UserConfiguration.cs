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
            
        builder.Property(u => u.Address)
            .HasMaxLength(200);
            
        builder.Property(u => u.PostalCode)
            .HasMaxLength(20);
            
        builder.Property(u => u.City)
            .HasMaxLength(100);
            
        builder.Property(u => u.Country)
            .HasMaxLength(100);
            
        builder.Property(u => u.Province)
            .HasMaxLength(100);
            
        builder.Property(u => u.Ward)
            .HasMaxLength(100);
        
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
            
        // Query filters
        builder.HasQueryFilter(u => !u.IsDeleted);
    }
}
