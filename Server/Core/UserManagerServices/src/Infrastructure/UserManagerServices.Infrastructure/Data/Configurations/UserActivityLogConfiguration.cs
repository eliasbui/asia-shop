using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserActivityLog entity
/// Configures audit trail and activity monitoring
/// </summary>
public class UserActivityLogConfiguration : IEntityTypeConfiguration<UserActivityLog>
{
    /// <summary>
    /// Configures the UserActivityLog entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserActivityLog</param>
    public void Configure(EntityTypeBuilder<UserActivityLog> builder)
    {
        // Table configuration
        builder.ToTable("UserActivityLogs");

        // Primary key
        builder.HasKey(ual => ual.Id)
            .HasName("PK_UserActivityLogs");

        // Business properties
        builder.Property(ual => ual.Action)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(ual => ual.Entity)
            .HasMaxLength(100);

        builder.Property(ual => ual.EntityId);

        builder.Property(ual => ual.IpAddress)
            .HasMaxLength(45);

        builder.Property(ual => ual.UserAgent)
            .HasMaxLength(1024);

        builder.Property(ual => ual.Timestamp)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // JSONB properties for PostgreSQL
        builder.Property(ual => ual.Details)
            .HasColumnType("jsonb")
            .IsRequired();

        // Base entity properties
        builder.Property(ual => ual.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ual => ual.UpdatedAt);

        builder.Property(ual => ual.CreatedBy);

        builder.Property(ual => ual.UpdatedBy);

        builder.Property(ual => ual.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships - SET NULL for audit history preservation
        builder.HasOne(ual => ual.User)
            .WithMany(u => u.UserActivityLogs)
            .HasForeignKey(ual => ual.UserId)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserActivityLogs_Users_UserId");

        // Self-referencing relationships for audit
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ual => ual.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserActivityLogs_CreatedBy_Users_Id");

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ual => ual.UpdatedBy)
            .OnDelete(DeleteBehavior.SetNull)
            .HasConstraintName("FK_UserActivityLogs_UpdatedBy_Users_Id");

        // Indexes for performance
        builder.HasIndex(ual => ual.UserId)
            .HasDatabaseName("idx_user_activity_logs_user_id");

        builder.HasIndex(ual => ual.Action)
            .HasDatabaseName("idx_user_activity_logs_action");

        builder.HasIndex(ual => ual.Entity)
            .HasDatabaseName("idx_user_activity_logs_entity");

        builder.HasIndex(ual => ual.EntityId)
            .HasDatabaseName("idx_user_activity_logs_entity_id");

        builder.HasIndex(ual => ual.Timestamp)
            .HasDatabaseName("idx_user_activity_logs_timestamp");

        builder.HasIndex(ual => ual.IpAddress)
            .HasDatabaseName("idx_user_activity_logs_ip_address");

        builder.HasIndex(ual => new { ual.UserId, ual.Action, ual.Timestamp })
            .HasDatabaseName("idx_user_activity_logs_user_action_time");

        builder.HasIndex(ual => ual.CreatedAt)
            .HasDatabaseName("idx_user_activity_logs_created_at");

        builder.HasIndex(ual => ual.IsDeleted)
            .HasDatabaseName("idx_user_activity_logs_is_deleted");

        // Query filters
        builder.HasQueryFilter(ual => !ual.IsDeleted);
    }
}