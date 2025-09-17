using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for UserSecuritySettings entity
/// </summary>
public class UserSecuritySettingsRepository : GenericRepository<UserSecuritySettings>, IUserSecuritySettingsRepository
{
    public UserSecuritySettingsRepository(ApplicationDbContext context) : base(context)
    {
    }

    /// <summary>
    /// Gets security settings for a user (or global default if user-specific doesn't exist)
    /// </summary>
    public async Task<UserSecuritySettings> GetUserSecuritySettingsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        // First try to get user-specific settings
        var userSettings = await _context.UserSecuritySettings
            .FirstOrDefaultAsync(ss => ss.UserId == userId, cancellationToken);

        if (userSettings != null)
            return userSettings;

        // Fall back to global default settings
        return await GetGlobalDefaultSettingsAsync(cancellationToken);
    }

    /// <summary>
    /// Gets global default security settings
    /// </summary>
    public async Task<UserSecuritySettings> GetGlobalDefaultSettingsAsync(CancellationToken cancellationToken = default)
    {
        var globalSettings = await _context.UserSecuritySettings
            .FirstOrDefaultAsync(ss => ss.IsGlobalDefault, cancellationToken);

        if (globalSettings != null)
            return globalSettings;

        // Create default global settings if none exist
        globalSettings = new UserSecuritySettings
        {
            IsGlobalDefault = true,
            MaxFailedLoginAttempts = 5,
            InitialLockoutDurationMinutes = 15,
            MaxLockoutDurationMinutes = 1440, // 24 hours
            LockoutDurationMultiplier = 2.0m,
            FailedAttemptWindowMinutes = 60,
            EnableProgressiveLockout = true,
            EnableSuspiciousActivityDetection = true,
            SuspiciousActivityThreshold = 0.7m,
            EnableGeolocationTracking = true,
            BlockNewLocationLogins = false,
            RequireEmailVerificationForNewLocations = true,
            MaxConcurrentSessions = 5,
            SessionTimeoutMinutes = 60,
            EnableDeviceFingerprinting = true,
            SendSecurityAlerts = true,
            LogSecurityEvents = true,
            SecurityLogRetentionDays = 90,
            AutoUnlockAfterLockoutPeriod = true
        };

        _context.UserSecuritySettings.Add(globalSettings);
        await _context.SaveChangesAsync(cancellationToken);
        return globalSettings;
    }

    /// <summary>
    /// Creates or updates user-specific security settings
    /// </summary>
    public async Task<UserSecuritySettings> CreateOrUpdateUserSettingsAsync(Guid userId, UserSecuritySettings settings, 
        CancellationToken cancellationToken = default)
    {
        var existingSettings = await _context.UserSecuritySettings
            .FirstOrDefaultAsync(ss => ss.UserId == userId, cancellationToken);

        if (existingSettings != null)
        {
            // Update existing settings
            existingSettings.MaxFailedLoginAttempts = settings.MaxFailedLoginAttempts;
            existingSettings.InitialLockoutDurationMinutes = settings.InitialLockoutDurationMinutes;
            existingSettings.MaxLockoutDurationMinutes = settings.MaxLockoutDurationMinutes;
            existingSettings.LockoutDurationMultiplier = settings.LockoutDurationMultiplier;
            existingSettings.FailedAttemptWindowMinutes = settings.FailedAttemptWindowMinutes;
            existingSettings.EnableProgressiveLockout = settings.EnableProgressiveLockout;
            existingSettings.EnableSuspiciousActivityDetection = settings.EnableSuspiciousActivityDetection;
            existingSettings.SuspiciousActivityThreshold = settings.SuspiciousActivityThreshold;
            existingSettings.EnableGeolocationTracking = settings.EnableGeolocationTracking;
            existingSettings.BlockNewLocationLogins = settings.BlockNewLocationLogins;
            existingSettings.RequireEmailVerificationForNewLocations = settings.RequireEmailVerificationForNewLocations;
            existingSettings.MaxConcurrentSessions = settings.MaxConcurrentSessions;
            existingSettings.SessionTimeoutMinutes = settings.SessionTimeoutMinutes;
            existingSettings.EnableDeviceFingerprinting = settings.EnableDeviceFingerprinting;
            existingSettings.SendSecurityAlerts = settings.SendSecurityAlerts;
            existingSettings.LogSecurityEvents = settings.LogSecurityEvents;
            existingSettings.SecurityLogRetentionDays = settings.SecurityLogRetentionDays;
            existingSettings.AutoUnlockAfterLockoutPeriod = settings.AutoUnlockAfterLockoutPeriod;
            existingSettings.AdditionalSettings = settings.AdditionalSettings;
            existingSettings.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            return existingSettings;
        }
        else
        {
            // Create new user-specific settings
            settings.UserId = userId;
            settings.IsGlobalDefault = false;
            _context.UserSecuritySettings.Add(settings);
            await _context.SaveChangesAsync(cancellationToken);
            return settings;
        }
    }

    /// <summary>
    /// Updates global default security settings
    /// </summary>
    public async Task<UserSecuritySettings> UpdateGlobalDefaultSettingsAsync(UserSecuritySettings settings, 
        CancellationToken cancellationToken = default)
    {
        var globalSettings = await _context.UserSecuritySettings
            .FirstOrDefaultAsync(ss => ss.IsGlobalDefault, cancellationToken);

        if (globalSettings == null)
        {
            // Create new global settings
            settings.IsGlobalDefault = true;
            settings.UserId = null;
            _context.UserSecuritySettings.Add(settings);
        }
        else
        {
            // Update existing global settings
            globalSettings.MaxFailedLoginAttempts = settings.MaxFailedLoginAttempts;
            globalSettings.InitialLockoutDurationMinutes = settings.InitialLockoutDurationMinutes;
            globalSettings.MaxLockoutDurationMinutes = settings.MaxLockoutDurationMinutes;
            globalSettings.LockoutDurationMultiplier = settings.LockoutDurationMultiplier;
            globalSettings.FailedAttemptWindowMinutes = settings.FailedAttemptWindowMinutes;
            globalSettings.EnableProgressiveLockout = settings.EnableProgressiveLockout;
            globalSettings.EnableSuspiciousActivityDetection = settings.EnableSuspiciousActivityDetection;
            globalSettings.SuspiciousActivityThreshold = settings.SuspiciousActivityThreshold;
            globalSettings.EnableGeolocationTracking = settings.EnableGeolocationTracking;
            globalSettings.BlockNewLocationLogins = settings.BlockNewLocationLogins;
            globalSettings.RequireEmailVerificationForNewLocations = settings.RequireEmailVerificationForNewLocations;
            globalSettings.MaxConcurrentSessions = settings.MaxConcurrentSessions;
            globalSettings.SessionTimeoutMinutes = settings.SessionTimeoutMinutes;
            globalSettings.EnableDeviceFingerprinting = settings.EnableDeviceFingerprinting;
            globalSettings.SendSecurityAlerts = settings.SendSecurityAlerts;
            globalSettings.LogSecurityEvents = settings.LogSecurityEvents;
            globalSettings.SecurityLogRetentionDays = settings.SecurityLogRetentionDays;
            globalSettings.AutoUnlockAfterLockoutPeriod = settings.AutoUnlockAfterLockoutPeriod;
            globalSettings.AdditionalSettings = settings.AdditionalSettings;
            globalSettings.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return globalSettings ?? settings;
    }

    /// <summary>
    /// Checks if user has custom security settings
    /// </summary>
    public async Task<bool> HasCustomSettingsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.UserSecuritySettings
            .AnyAsync(ss => ss.UserId == userId, cancellationToken);
    }

    /// <summary>
    /// Removes user-specific security settings (falls back to global default)
    /// </summary>
    public async Task<bool> RemoveUserSettingsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var userSettings = await _context.UserSecuritySettings
            .FirstOrDefaultAsync(ss => ss.UserId == userId, cancellationToken);

        if (userSettings == null)
            return false;

        _context.UserSecuritySettings.Remove(userSettings);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    /// <summary>
    /// Gets all users with custom security settings
    /// </summary>
    public async Task<(List<UserSecuritySettings> settings, int totalCount)> GetUsersWithCustomSettingsAsync(
        int pageNumber = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var query = _context.UserSecuritySettings
            .Include(ss => ss.User)
            .Where(ss => ss.UserId != null && !ss.IsGlobalDefault)
            .OrderBy(ss => ss.User!.Email);

        var totalCount = await query.CountAsync(cancellationToken);
        var settings = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (settings, totalCount);
    }

    /// <summary>
    /// Bulk applies global settings to users who don't have custom settings
    /// </summary>
    public async Task<int> ApplyGlobalSettingsToUsersAsync(CancellationToken cancellationToken = default)
    {
        // This method would typically be used for migration scenarios
        // For now, we'll return 0 as users automatically get global settings when needed
        return 0;
    }
}
