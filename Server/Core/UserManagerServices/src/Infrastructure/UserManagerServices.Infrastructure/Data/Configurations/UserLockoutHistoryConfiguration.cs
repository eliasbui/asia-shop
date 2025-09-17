using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for UserLockoutHistory entity
/// </summary>
public class UserLockoutHistoryConfiguration : IEntityTypeConfiguration<UserLockoutHistory>
{
    public void Configure(EntityTypeBuilder<UserLockoutHistory> builder)
    {
        // Table configuration
        builder.ToTable("UserLockoutHistory");

        // Primary key
        builder.HasKey(lh => lh.Id)
            .HasName("PK_UserLockoutHistory");

        // Properties
        builder.Property(lh => lh.Id)
            .IsRequired()
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(lh => lh.UserId)
            .IsRequired();

        builder.Property(lh => lh.LockoutType)
            .IsRequired()
            .HasColumnType("int");

        builder.Property(lh => lh.LockoutReason)
            .IsRequired()
            .HasColumnType("int");

        builder.Property(lh => lh.LockoutStart)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(lh => lh.LockoutEnd)
            .HasColumnType("timestamp with time zone");

        builder.Property(lh => lh.DurationMinutes);

        builder.Property(lh => lh.FailedAttemptCount)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(lh => lh.LockoutLevel)
            .IsRequired()
            .HasDefaultValue(1);

        builder.Property(lh => lh.TriggeringIpAddress)
            .HasMaxLength(45);

        builder.Property(lh => lh.IsManualLockout)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(lh => lh.ReleasedAt)
            .HasColumnType("timestamp with time zone");

        builder.Property(lh => lh.ReleaseReason)
            .HasColumnType("int");

        builder.Property(lh => lh.Details)
            .HasColumnType("jsonb");

        builder.Property(lh => lh.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Base entity properties
        builder.Property(lh => lh.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(lh => lh.UpdatedAt)
            .HasColumnType("timestamp with time zone");

        builder.Property(lh => lh.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(lh => lh.User)
            .WithMany()
            .HasForeignKey(lh => lh.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(lh => lh.UserId)
            .HasDatabaseName("IX_UserLockoutHistory_UserId");

        builder.HasIndex(lh => lh.LockoutStart)
            .HasDatabaseName("IX_UserLockoutHistory_LockoutStart");

        builder.HasIndex(lh => lh.LockoutEnd)
            .HasDatabaseName("IX_UserLockoutHistory_LockoutEnd");

        builder.HasIndex(lh => lh.IsActive)
            .HasDatabaseName("IX_UserLockoutHistory_IsActive");

        builder.HasIndex(lh => lh.LockoutType)
            .HasDatabaseName("IX_UserLockoutHistory_LockoutType");

        builder.HasIndex(lh => lh.LockoutReason)
            .HasDatabaseName("IX_UserLockoutHistory_LockoutReason");

        builder.HasIndex(lh => new { lh.UserId, lh.IsActive })
            .HasDatabaseName("IX_UserLockoutHistory_UserId_IsActive");

        builder.HasIndex(lh => new { lh.UserId, lh.LockoutStart })
            .HasDatabaseName("IX_UserLockoutHistory_UserId_LockoutStart");

        // Query filter
        builder.HasQueryFilter(lh => !lh.IsDeleted);
    }
}
