using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserSession entity
/// Configures user session tracking and token management
/// </summary>
public class UserSessionConfiguration : IEntityTypeConfiguration<UserSession>
{
    /// <summary>
    /// Configures the UserSession entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserSession</param>
    public void Configure(EntityTypeBuilder<UserSession> builder)
    {
        // Table configuration
        builder.ToTable("UserSessions");

        // Primary key
        builder.HasKey(us => us.Id)
            .HasName("PK_UserSessions");

        // Business properties
        builder.Property(us => us.SessionToken)
            .HasMaxLength(512)
            .IsRequired();

        builder.Property(us => us.RefreshToken)
            .HasMaxLength(512)
            .IsRequired();

        builder.Property(us => us.IpAddress)
            .HasMaxLength(45)
            .IsRequired();

        builder.Property(us => us.UserAgent)
            .HasMaxLength(1024)
            .IsRequired();

        builder.Property(us => us.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(us => us.ExpiresAt)
            .IsRequired();

        builder.Property(us => us.LastAccessedAt);

        builder.Property(us => us.OperatingSystem)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(us => us.Browser)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(us => us.Location)
            .HasMaxLength(100)
            .IsRequired();

        // JSONB properties for PostgreSQL
        builder.Property(us => us.DeviceInfo)
            .HasColumnType("jsonb")
            .IsRequired();

        // Base entity properties
        builder.Property(us => us.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(us => us.UpdatedAt);

        builder.Property(us => us.CreatedBy);

        builder.Property(us => us.UpdatedBy);

        builder.Property(us => us.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(us => us.User)
            .WithMany(u => u.UserSessions)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserSessions_Users_UserId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(us => us.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserSessions_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(us => us.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserSessions_UpdatedBy_Users_Id");

        // Indexes
        builder.HasIndex(us => us.UserId)
            .HasDatabaseName("idx_user_sessions_user_id");

        builder.HasIndex(us => us.SessionToken)
            .HasDatabaseName("idx_user_sessions_session_token")
            .IsUnique();

        builder.HasIndex(us => us.RefreshToken)
            .HasDatabaseName("idx_user_sessions_refresh_token")
            .IsUnique();

        builder.HasIndex(us => us.IsActive)
            .HasDatabaseName("idx_user_sessions_is_active");

        builder.HasIndex(us => us.ExpiresAt)
            .HasDatabaseName("idx_user_sessions_expires_at");

        builder.HasIndex(us => us.LastAccessedAt)
            .HasDatabaseName("idx_user_sessions_last_accessed_at");

        builder.HasIndex(us => us.IpAddress)
            .HasDatabaseName("idx_user_sessions_ip_address");

        builder.HasIndex(us => us.CreatedAt)
            .HasDatabaseName("idx_user_sessions_created_at");

        builder.HasIndex(us => us.IsDeleted)
            .HasDatabaseName("idx_user_sessions_is_deleted");

        // Query filters
        builder.HasQueryFilter(us => !us.IsDeleted);
    }
}