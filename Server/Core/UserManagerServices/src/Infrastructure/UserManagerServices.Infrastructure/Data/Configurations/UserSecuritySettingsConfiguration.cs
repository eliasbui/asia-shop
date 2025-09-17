using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for UserSecuritySettings entity
/// </summary>
public class UserSecuritySettingsConfiguration : IEntityTypeConfiguration<UserSecuritySettings>
{
    public void Configure(EntityTypeBuilder<UserSecuritySettings> builder)
    {
        // Table configuration
        builder.ToTable("UserSecuritySettings");

        // Primary key
        builder.HasKey(ss => ss.Id)
            .HasName("PK_UserSecuritySettings");

        // Properties
        builder.Property(ss => ss.Id)
            .IsRequired()
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(ss => ss.IsGlobalDefault)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(ss => ss.MaxFailedLoginAttempts)
            .IsRequired()
            .HasDefaultValue(5);

        builder.Property(ss => ss.InitialLockoutDurationMinutes)
            .IsRequired()
            .HasDefaultValue(15);

        builder.Property(ss => ss.MaxLockoutDurationMinutes)
            .IsRequired()
            .HasDefaultValue(1440); // 24 hours

        builder.Property(ss => ss.LockoutDurationMultiplier)
            .IsRequired()
            .HasColumnType("decimal(3,1)")
            .HasDefaultValue(2.0m);

        builder.Property(ss => ss.FailedAttemptWindowMinutes)
            .IsRequired()
            .HasDefaultValue(60);

        builder.Property(ss => ss.EnableProgressiveLockout)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(ss => ss.EnableSuspiciousActivityDetection)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(ss => ss.SuspiciousActivityThreshold)
            .IsRequired()
            .HasColumnType("decimal(3,2)")
            .HasDefaultValue(0.7m);

        builder.Property(ss => ss.EnableGeolocationTracking)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(ss => ss.BlockNewLocationLogins)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(ss => ss.RequireEmailVerificationForNewLocations)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(ss => ss.MaxConcurrentSessions)
            .IsRequired()
            .HasDefaultValue(5);

        builder.Property(ss => ss.SessionTimeoutMinutes)
            .IsRequired()
            .HasDefaultValue(60);

        builder.Property(ss => ss.EnableDeviceFingerprinting)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(ss => ss.SendSecurityAlerts)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(ss => ss.LogSecurityEvents)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(ss => ss.SecurityLogRetentionDays)
            .IsRequired()
            .HasDefaultValue(90);

        builder.Property(ss => ss.AutoUnlockAfterLockoutPeriod)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(ss => ss.AdditionalSettings)
            .HasColumnType("jsonb");

        // Base entity properties
        builder.Property(ss => ss.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ss => ss.UpdatedAt)
            .HasColumnType("timestamp with time zone");

        builder.Property(ss => ss.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(ss => ss.User)
            .WithOne(u => u.UserSecuritySettings)
            .HasForeignKey<UserSecuritySettings>(ss => ss.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(ss => ss.UserId)
            .IsUnique()
            .HasDatabaseName("IX_UserSecuritySettings_UserId");

        builder.HasIndex(ss => ss.IsGlobalDefault)
            .HasDatabaseName("IX_UserSecuritySettings_IsGlobalDefault");

        // Query filter
        builder.HasQueryFilter(ss => !ss.IsDeleted);

        // Constraints
        builder.HasCheckConstraint("CK_UserSecuritySettings_MaxFailedLoginAttempts",
            "\"MaxFailedLoginAttempts\" > 0");

        builder.HasCheckConstraint("CK_UserSecuritySettings_InitialLockoutDurationMinutes",
            "\"InitialLockoutDurationMinutes\" > 0");

        builder.HasCheckConstraint("CK_UserSecuritySettings_MaxLockoutDurationMinutes",
            "\"MaxLockoutDurationMinutes\" >= \"InitialLockoutDurationMinutes\"");

        builder.HasCheckConstraint("CK_UserSecuritySettings_LockoutDurationMultiplier",
            "\"LockoutDurationMultiplier\" >= 1.0");

        builder.HasCheckConstraint("CK_UserSecuritySettings_SuspiciousActivityThreshold",
            "\"SuspiciousActivityThreshold\" >= 0.0 AND \"SuspiciousActivityThreshold\" <= 1.0");

        builder.HasCheckConstraint("CK_UserSecuritySettings_MaxConcurrentSessions",
            "\"MaxConcurrentSessions\" > 0");

        builder.HasCheckConstraint("CK_UserSecuritySettings_SessionTimeoutMinutes",
            "\"SessionTimeoutMinutes\" > 0");
    }
}