using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for User entity with specialized operations
/// Uses Entity Framework Core for all database operations
/// </summary>
public class UserRepository : GenericRepository<User>, IUserRepository
{
    /// <summary>
    /// Initializes a new instance of the UserRepository
    /// </summary>
    /// <param name="context">Database context</param>
    public UserRepository(ApplicationDbContext context, IDapperConnectionFactory dapperConnectionFactory)
        : base(context)
    {
    }

    #region User-Specific Queries

    /// <summary>
    /// Gets a user by email address
    /// </summary>
    /// <param name="email">Email address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User if found, null otherwise</returns>
    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    /// <summary>
    /// Gets a user by username
    /// </summary>
    /// <param name="username">Username</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User if found, null otherwise</returns>
    public async Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.UserName == username, cancellationToken);
    }

    /// <summary>
    /// Gets a user by phone number
    /// </summary>
    /// <param name="phoneNumber">Phone number</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User if found, null otherwise</returns>
    public async Task<User?> GetByPhoneNumberAsync(string phoneNumber, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber, cancellationToken);
    }

    /// <summary>
    /// Gets a user with all related data (profiles, sessions, etc.)
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User with related data if found, null otherwise</returns>
    public async Task<User?> GetWithAllRelatedDataAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(u => u.UserProfiles)
            .Include(u => u.UserSessions)
            .Include(u => u.UserActivityLogs)
            .Include(u => u.UserApiKeys)
            .Include(u => u.UserPreferences)
            .Include(u => u.UserNotificationSettings)
            .Include(u => u.UserRoles)
            .Include(u => u.UserClaims)
            .Include(u => u.UserLogins)
            .Include(u => u.UserTokens)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
    }

    /// <summary>
    /// Gets users by role using Entity Framework
    /// </summary>
    /// <param name="roleName">Role name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Users in the specified role</returns>
    public async Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserRoles
            .Where(ur => !ur.IsDeleted)
            .Join(_context.Roles.Where(r => r.Name == roleName && !r.IsDeleted),
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => ur.UserId)
            .Join(_context.Users.Where(u => !u.IsDeleted),
                userId => userId,
                u => u.Id,
                (userId, u) => u)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets active users (IsActive = true and not deleted)
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Active users</returns>
    public async Task<IEnumerable<User>> GetActiveUsersAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.Where(u => u.IsActive).ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets users created within a date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Users created within the date range</returns>
    public async Task<IEnumerable<User>> GetUsersByDateRangeAsync(DateTime startDate, DateTime endDate,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    #endregion

    #region User Statistics

    /// <summary>
    /// Gets total count of active users using Entity Framework
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of active users</returns>
    public async Task<int> GetActiveUserCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(u => u.IsActive && !u.IsDeleted, cancellationToken);
    }

    /// <summary>
    /// Gets count of users registered today
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of users registered today</returns>
    public async Task<int> GetTodayRegistrationCountAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        return await _dbSet.CountAsync(u => u.CreatedAt >= today && u.CreatedAt < tomorrow && !u.IsDeleted,
            cancellationToken);
    }

    /// <summary>
    /// Gets user registration statistics by date using Entity Framework
    /// </summary>
    /// <param name="days">Number of days to look back</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Registration statistics</returns>
    public async Task<Dictionary<DateTime, int>> GetRegistrationStatisticsAsync(int days,
        CancellationToken cancellationToken = default)
    {
        var startDate = DateTime.UtcNow.Date.AddDays(-days);

        var results = await _dbSet
            .Where(u => u.CreatedAt >= startDate && !u.IsDeleted)
            .GroupBy(u => u.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(x => x.Date)
            .ToListAsync(cancellationToken);

        return results.ToDictionary(r => r.Date, r => r.Count);
    }

    #endregion

    #region User Validation

    /// <summary>
    /// Checks if email is already taken by another user
    /// </summary>
    /// <param name="email">Email to check</param>
    /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if email is taken, false otherwise</returns>
    public async Task<bool> IsEmailTakenAsync(string email, Guid? excludeUserId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(u => u.Email == email);

        if (excludeUserId.HasValue) query = query.Where(u => u.Id != excludeUserId.Value);

        return await query.AnyAsync(cancellationToken);
    }

    /// <summary>
    /// Checks if username is already taken by another user
    /// </summary>
    /// <param name="username">Username to check</param>
    /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if username is taken, false otherwise</returns>
    public async Task<bool> IsUsernameTakenAsync(string username, Guid? excludeUserId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(u => u.UserName == username);

        if (excludeUserId.HasValue) query = query.Where(u => u.Id != excludeUserId.Value);

        return await query.AnyAsync(cancellationToken);
    }

    /// <summary>
    /// Checks if phone number is already taken by another user
    /// </summary>
    /// <param name="phoneNumber">Phone number to check</param>
    /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if phone number is taken, false otherwise</returns>
    public async Task<bool> IsPhoneNumberTakenAsync(string phoneNumber, Guid? excludeUserId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(u => u.PhoneNumber == phoneNumber);

        if (excludeUserId.HasValue) query = query.Where(u => u.Id != excludeUserId.Value);

        return await query.AnyAsync(cancellationToken);
    }

    #endregion

    #region Search and Filtering

    /// <summary>
    /// Searches users by multiple criteria using Entity Framework
    /// </summary>
    /// <param name="searchTerm">Search term (searches in name, email, username)</param>
    /// <param name="isActive">Filter by active status</param>
    /// <param name="roles">Filter by roles</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated search results</returns>
    public async Task<(IEnumerable<User> Users, int TotalCount)> SearchUsersAsync(
        string? searchTerm = null,
        bool? isActive = null,
        IEnumerable<string>? roles = null,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(u => !u.IsDeleted);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lowerSearchTerm = searchTerm.ToLower();
            query = query.Where(u =>
                (u.FirstName != null && u.FirstName.ToLower().Contains(lowerSearchTerm)) ||
                (u.LastName != null && u.LastName.ToLower().Contains(lowerSearchTerm)) ||
                (u.Email != null && u.Email.ToLower().Contains(lowerSearchTerm)) ||
                (u.UserName != null && u.UserName.ToLower().Contains(lowerSearchTerm)));
        }

        if (isActive.HasValue) query = query.Where(u => u.IsActive == isActive.Value);

        if (roles != null && roles.Any())
        {
            var roleArray = roles.ToArray();
            query = query.Where(u => _context.UserRoles
                .Where(ur => ur.UserId == u.Id && !ur.IsDeleted)
                .Join(_context.Roles.Where(r => roleArray.Contains(r.Name) && !r.IsDeleted),
                    ur => ur.RoleId,
                    r => r.Id,
                    (ur, r) => r)
                .Any());
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (users, totalCount);
    }

    #endregion

    #region Profile and Preferences

    /// <summary>
    /// Gets user profile by user ID
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User profile if found, null otherwise</returns>
    public async Task<UserProfile?> GetUserProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.UserProfiles
            .FirstOrDefaultAsync(up => up.UserId == userId && !up.IsDeleted, cancellationToken);
    }

    /// <summary>
    /// Adds a new user profile
    /// </summary>
    /// <param name="userProfile">User profile to add</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task AddUserProfileAsync(UserProfile userProfile, CancellationToken cancellationToken = default)
    {
        await _context.UserProfiles.AddAsync(userProfile, cancellationToken);
    }

    /// <summary>
    /// Gets user preferences by user ID
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User preferences</returns>
    public async Task<IEnumerable<UserPreference>> GetUserPreferencesAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserPreferences
            .Where(up => up.UserId == userId && !up.IsDeleted)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets a specific user preference by category and key
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="category">Preference category</param>
    /// <param name="key">Preference key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User preference if found, null otherwise</returns>
    public async Task<UserPreference?> GetUserPreferenceAsync(Guid userId, string category, string key,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserPreferences
            .FirstOrDefaultAsync(up => up.UserId == userId && up.Category == category && up.Key == key && !up.IsDeleted,
                cancellationToken);
    }

    /// <summary>
    /// Adds or updates a user preference
    /// </summary>
    /// <param name="userPreference">User preference to add or update</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task AddOrUpdateUserPreferenceAsync(UserPreference userPreference,
        CancellationToken cancellationToken = default)
    {
        var existing = await GetUserPreferenceAsync(userPreference.UserId, userPreference.Category, userPreference.Key,
            cancellationToken);

        if (existing != null)
        {
            // Update existing preference
            existing.Value = userPreference.Value;
            existing.DataType = userPreference.DataType;
            existing.IsActive = userPreference.IsActive;
            var entry = _context.Entry(existing);
            entry.Property(nameof(UserPreference.UpdatedAt)).CurrentValue = DateTime.UtcNow;
        }
        else
        {
            // Add new preference
            await _context.UserPreferences.AddAsync(userPreference, cancellationToken);
        }
    }

    /// <summary>
    /// Gets user notification settings by user ID
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User notification settings if found, null otherwise</returns>
    public async Task<UserNotificationSettings?> GetUserNotificationSettingsAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserNotificationSettings
            .FirstOrDefaultAsync(uns => uns.UserId == userId && !uns.IsDeleted, cancellationToken);
    }

    /// <summary>
    /// Adds or updates user notification settings
    /// </summary>
    /// <param name="notificationSettings">Notification settings to add or update</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task AddOrUpdateNotificationSettingsAsync(UserNotificationSettings notificationSettings,
        CancellationToken cancellationToken = default)
    {
        var existing = await GetUserNotificationSettingsAsync(notificationSettings.UserId, cancellationToken);

        if (existing != null)
        {
            // Update existing settings
            existing.EmailEnabled = notificationSettings.EmailEnabled;
            existing.EmailSecurityAlerts = notificationSettings.EmailSecurityAlerts;
            existing.EmailAccountUpdates = notificationSettings.EmailAccountUpdates;
            existing.EmailMarketing = notificationSettings.EmailMarketing;
            existing.EmailNewsletter = notificationSettings.EmailNewsletter;
            existing.EmailSystemNotifications = notificationSettings.EmailSystemNotifications;

            existing.SmsEnabled = notificationSettings.SmsEnabled;
            existing.SmsSecurityAlerts = notificationSettings.SmsSecurityAlerts;
            existing.SmsAccountUpdates = notificationSettings.SmsAccountUpdates;
            existing.SmsTwoFactorAuth = notificationSettings.SmsTwoFactorAuth;

            existing.PushEnabled = notificationSettings.PushEnabled;
            existing.PushSecurityAlerts = notificationSettings.PushSecurityAlerts;
            existing.PushAccountUpdates = notificationSettings.PushAccountUpdates;
            existing.PushSystemNotifications = notificationSettings.PushSystemNotifications;

            existing.InAppEnabled = notificationSettings.InAppEnabled;
            existing.InAppSecurityAlerts = notificationSettings.InAppSecurityAlerts;
            existing.InAppAccountUpdates = notificationSettings.InAppAccountUpdates;
            existing.InAppSystemNotifications = notificationSettings.InAppSystemNotifications;

            existing.DoNotDisturb = notificationSettings.DoNotDisturb;
            existing.DoNotDisturbStart = notificationSettings.DoNotDisturbStart;
            existing.DoNotDisturbEnd = notificationSettings.DoNotDisturbEnd;
            existing.TimeZone = notificationSettings.TimeZone;
            existing.Frequency = notificationSettings.Frequency;

            var entry = _context.Entry(existing);
            entry.Property(nameof(UserNotificationSettings.UpdatedAt)).CurrentValue = DateTime.UtcNow;
        }
        else
        {
            // Add new settings
            await _context.UserNotificationSettings.AddAsync(notificationSettings, cancellationToken);
        }
    }

    /// <summary>
    /// Gets user API keys by user ID
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User API keys</returns>
    public async Task<IEnumerable<UserApiKey>> GetUserApiKeysAsync(Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserApiKeys
            .Where(uak => uak.UserId == userId && !uak.IsDeleted)
            .OrderByDescending(uak => uak.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets a specific user API key by ID and user ID
    /// </summary>
    /// <param name="keyId">API key identifier</param>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User API key if found, null otherwise</returns>
    public async Task<UserApiKey?> GetUserApiKeyAsync(Guid keyId, Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserApiKeys
            .FirstOrDefaultAsync(uak => uak.Id == keyId && uak.UserId == userId && !uak.IsDeleted, cancellationToken);
    }

    /// <summary>
    /// Adds a new user API key
    /// </summary>
    /// <param name="apiKey">API key to add</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task AddUserApiKeyAsync(UserApiKey apiKey, CancellationToken cancellationToken = default)
    {
        await _context.UserApiKeys.AddAsync(apiKey, cancellationToken);
    }

    /// <summary>
    /// Deletes a user API key (soft delete)
    /// </summary>
    /// <param name="keyId">API key identifier</param>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted, false if not found</returns>
    public async Task<bool> DeleteUserApiKeyAsync(Guid keyId, Guid userId,
        CancellationToken cancellationToken = default)
    {
        var apiKey = await GetUserApiKeyAsync(keyId, userId, cancellationToken);
        if (apiKey == null)
            return false;

        var entry = _context.Entry(apiKey);
        entry.Property(nameof(UserApiKey.IsDeleted)).CurrentValue = true;
        entry.Property(nameof(UserApiKey.UpdatedAt)).CurrentValue = DateTime.UtcNow;

        return true;
    }

    #endregion
}