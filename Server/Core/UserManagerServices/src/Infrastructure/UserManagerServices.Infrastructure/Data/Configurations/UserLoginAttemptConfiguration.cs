using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for UserLoginAttempt entity
/// </summary>
public class UserLoginAttemptConfiguration : IEntityTypeConfiguration<UserLoginAttempt>
{
    public void Configure(EntityTypeBuilder<UserLoginAttempt> builder)
    {
        // Table configuration
        builder.ToTable("UserLoginAttempts");

        // Primary key
        builder.HasKey(la => la.Id)
            .HasName("PK_UserLoginAttempts");

        // Properties
        builder.Property(la => la.Id)
            .IsRequired()
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(la => la.EmailOrUsername)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(la => la.IsSuccessful)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(la => la.FailureReason)
            .HasColumnType("int");

        builder.Property(la => la.IpAddress)
            .IsRequired()
            .HasMaxLength(45); // IPv6 max length

        builder.Property(la => la.UserAgent)
            .HasMaxLength(500);

        builder.Property(la => la.LocationInfo)
            .HasColumnType("jsonb");

        builder.Property(la => la.DeviceFingerprint)
            .HasMaxLength(500);

        builder.Property(la => la.RiskScore)
            .HasColumnType("decimal(3,2)")
            .HasDefaultValue(0.0m);

        builder.Property(la => la.IsSuspicious)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(la => la.TriggeredLockout)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(la => la.Details)
            .HasColumnType("jsonb");

        builder.Property(la => la.AttemptedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Base entity properties
        builder.Property(la => la.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(la => la.UpdatedAt)
            .HasColumnType("timestamp with time zone");

        builder.Property(la => la.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(la => la.User)
            .WithMany(u => u.UserLoginAttempts)
            .HasForeignKey(la => la.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes
        builder.HasIndex(la => la.UserId)
            .HasDatabaseName("IX_UserLoginAttempts_UserId");

        builder.HasIndex(la => la.EmailOrUsername)
            .HasDatabaseName("IX_UserLoginAttempts_EmailOrUsername");

        builder.HasIndex(la => la.IpAddress)
            .HasDatabaseName("IX_UserLoginAttempts_IpAddress");

        builder.HasIndex(la => la.AttemptedAt)
            .HasDatabaseName("IX_UserLoginAttempts_AttemptedAt");

        builder.HasIndex(la => la.IsSuccessful)
            .HasDatabaseName("IX_UserLoginAttempts_IsSuccessful");

        builder.HasIndex(la => la.IsSuspicious)
            .HasDatabaseName("IX_UserLoginAttempts_IsSuspicious");

        builder.HasIndex(la => new { la.UserId, la.AttemptedAt })
            .HasDatabaseName("IX_UserLoginAttempts_UserId_AttemptedAt");

        builder.HasIndex(la => new { la.IpAddress, la.AttemptedAt })
            .HasDatabaseName("IX_UserLoginAttempts_IpAddress_AttemptedAt");

        // Query filter
        builder.HasQueryFilter(la => !la.IsDeleted);
    }
}