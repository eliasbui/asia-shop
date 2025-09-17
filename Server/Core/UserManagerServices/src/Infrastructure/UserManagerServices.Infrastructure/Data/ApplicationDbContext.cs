using System.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using UserManagerServices.Domain.Common;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Infrastructure.Data.Configurations;

namespace UserManagerServices.Infrastructure.Data;

/// <summary>
/// Application database context that extends IdentityDbContext for user management
/// Provides access to all entities and configures relationships according to Clean Architecture principles
/// </summary>
public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<User, Role, Guid, UserClaim, UserRole, UserLogin, RoleClaim, UserToken>(options)
{
    #region DbSets

    /// <summary>
    /// User profiles containing extended user information
    /// </summary>
    public DbSet<UserProfile> UserProfiles { get; set; } = null!;

    /// <summary>
    /// User sessions for tracking active user sessions and tokens
    /// </summary>
    public DbSet<UserSession> UserSessions { get; set; } = null!;

    /// <summary>
    /// User activity logs for audit trail and monitoring
    /// </summary>
    public DbSet<UserActivityLog> UserActivityLogs { get; set; } = null!;

    /// <summary>
    /// User API keys for API access management
    /// </summary>
    public DbSet<UserApiKey> UserApiKeys { get; set; } = null!;

    /// <summary>
    /// User preferences for personalization settings
    /// </summary>
    public DbSet<UserPreference> UserPreferences { get; set; } = null!;

    /// <summary>
    /// User notification settings for communication preferences (generic structure)
    /// </summary>
    public DbSet<UserNotificationSettings> UserNotificationSettings { get; set; } = null!;

    /// <summary>
    /// User MFA settings for multi-factor authentication configuration
    /// </summary>
    public DbSet<UserMfaSettings> UserMfaSettings { get; set; } = null!;

    /// <summary>
    /// User MFA backup codes for recovery purposes
    /// </summary>
    public DbSet<UserMfaBackupCode> UserMfaBackupCodes { get; set; } = null!;

    /// <summary>
    /// User MFA audit logs for security monitoring
    /// </summary>
    public DbSet<UserMfaAuditLog> UserMfaAuditLogs { get; set; } = null!;

    /// <summary>
    /// User email OTPs for MFA fallback authentication
    /// </summary>
    public DbSet<UserEmailOtp> UserEmailOtps { get; set; } = null!;

    /// <summary>
    /// User login attempts for security tracking and lockout management
    /// </summary>
    public DbSet<UserLoginAttempt> UserLoginAttempts { get; set; } = null!;

    /// <summary>
    /// User lockout history for progressive lockout and audit trail
    /// </summary>
    public DbSet<UserLockoutHistory> UserLockoutHistory { get; set; } = null!;

    /// <summary>
    /// User security settings for configurable security policies
    /// </summary>
    public DbSet<UserSecuritySettings> UserSecuritySettings { get; set; } = null!;

    #endregion

    /// <summary>
    /// Configures entity relationships, constraints, and database-specific settings
    /// </summary>
    /// <param name="modelBuilder">The model builder instance</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all entity configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Configure Identity table names to match our naming convention
        ConfigureIdentityTableNames(modelBuilder);

        // Configure global query filters for soft delete
        ConfigureGlobalQueryFilters(modelBuilder);
    }

    //function getConnectionAsync()
    public async Task<IDbConnection> GetConnectionAsync(CancellationToken cancellationToken = default)
    {
        var connection = new NpgsqlConnection(Database.GetConnectionString());
        await connection.OpenAsync(cancellationToken);
        return connection;
    }

    /// <summary>
    /// Configures Identity table names to follow our naming conventions
    /// </summary>
    /// <param name="modelBuilder">The model builder instance</param>
    private static void ConfigureIdentityTableNames(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().ToTable("Users");
        modelBuilder.Entity<Role>().ToTable("Roles");
        modelBuilder.Entity<UserRole>().ToTable("UserRoles");
        modelBuilder.Entity<UserClaim>().ToTable("UserClaims");
        modelBuilder.Entity<UserLogin>().ToTable("UserLogins");
        modelBuilder.Entity<UserToken>().ToTable("UserTokens");
        modelBuilder.Entity<RoleClaim>().ToTable("RoleClaims");
        modelBuilder.Entity<UserProfile>().ToTable("UserProfiles");
        modelBuilder.Entity<UserSession>().ToTable("UserSessions");
        modelBuilder.Entity<UserActivityLog>().ToTable("UserActivityLogs");
        modelBuilder.Entity<UserApiKey>().ToTable("UserApiKeys");
        modelBuilder.Entity<UserPreference>().ToTable("UserPreferences");
        modelBuilder.Entity<UserNotificationSettings>().ToTable("UserNotificationSettings");
    }

    /// <summary>
    /// Configures global query filters for soft delete functionality
    /// </summary>
    /// <param name="modelBuilder">The model builder instance</param>
    private static void ConfigureGlobalQueryFilters(ModelBuilder modelBuilder)
    {
        // Apply soft delete filter to all entities that implement IBaseEntity
        modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Role>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserRole>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserClaim>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserLogin>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserToken>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserProfile>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserSession>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserActivityLog>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserApiKey>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserPreference>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserNotificationSettings>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserMfaSettings>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserMfaBackupCode>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserMfaAuditLog>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserEmailOtp>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserLoginAttempt>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserLockoutHistory>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<UserSecuritySettings>().HasQueryFilter(e => !e.IsDeleted);
    }

    /// <summary>
    /// Override SaveChanges to automatically set audit fields
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of affected records</returns>
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditFields();
        return await base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Updates audit fields (CreatedAt, UpdatedAt) for tracked entities
    /// </summary>
    private void UpdateAuditFields()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is IBaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            var entity = (IBaseEntity)entry.Entity;

            if (entry.State == EntityState.Added)
            {
                // Use reflection to set CreatedAt since it's read-only
                var createdAtProperty = entry.Property(nameof(IBaseEntity.CreatedAt));
                createdAtProperty.CurrentValue = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                // Use reflection to set UpdatedAt since it's read-only
                var updatedAtProperty = entry.Property(nameof(IBaseEntity.UpdatedAt));
                updatedAtProperty.CurrentValue = DateTime.UtcNow;
            }
        }
    }
}