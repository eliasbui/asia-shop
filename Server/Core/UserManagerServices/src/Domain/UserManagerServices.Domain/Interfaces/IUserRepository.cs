using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Repository interface for User entity with specialized operations
/// Extends generic repository with user-specific functionality
/// </summary>
public interface IUserRepository : IGenericRepository<User>
{
    #region User-Specific Queries

    /// <summary>
    /// Gets a user by email address
    /// </summary>
    /// <param name="email">Email address</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User if found, null otherwise</returns>
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a user by username
    /// </summary>
    /// <param name="username">Username</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User if found, null otherwise</returns>
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a user by phone number
    /// </summary>
    /// <param name="phoneNumber">Phone number</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User if found, null otherwise</returns>
    Task<User?> GetByPhoneNumberAsync(string phoneNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a user with all related data (profiles, sessions, etc.)
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User with related data if found, null otherwise</returns>
    Task<User?> GetWithAllRelatedDataAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets users by role
    /// </summary>
    /// <param name="roleName">Role name</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Users in the specified role</returns>
    Task<IEnumerable<User>> GetUsersByRoleAsync(string roleName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets active users (IsActive = true and not deleted)
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Active users</returns>
    Task<IEnumerable<User>> GetActiveUsersAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets users created within a date range
    /// </summary>
    /// <param name="startDate">Start date</param>
    /// <param name="endDate">End date</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Users created within the date range</returns>
    Task<IEnumerable<User>> GetUsersByDateRangeAsync(DateTime startDate, DateTime endDate,
        CancellationToken cancellationToken = default);

    #endregion

    #region User Statistics

    /// <summary>
    /// Gets total count of active users
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of active users</returns>
    Task<int> GetActiveUserCountAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets count of users registered today
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of users registered today</returns>
    Task<int> GetTodayRegistrationCountAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets user registration statistics by date
    /// </summary>
    /// <param name="days">Number of days to look back</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Registration statistics</returns>
    Task<Dictionary<DateTime, int>> GetRegistrationStatisticsAsync(int days,
        CancellationToken cancellationToken = default);

    #endregion

    #region User Validation

    /// <summary>
    /// Checks if email is already taken by another user
    /// </summary>
    /// <param name="email">Email to check</param>
    /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if email is taken, false otherwise</returns>
    Task<bool> IsEmailTakenAsync(string email, Guid? excludeUserId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if username is already taken by another user
    /// </summary>
    /// <param name="username">Username to check</param>
    /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if username is taken, false otherwise</returns>
    Task<bool> IsUsernameTakenAsync(string username, Guid? excludeUserId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if phone number is already taken by another user
    /// </summary>
    /// <param name="phoneNumber">Phone number to check</param>
    /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if phone number is taken, false otherwise</returns>
    Task<bool> IsPhoneNumberTakenAsync(string phoneNumber, Guid? excludeUserId = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region Search and Filtering

    /// <summary>
    /// Searches users by multiple criteria
    /// </summary>
    /// <param name="searchTerm">Search term (searches in name, email, username)</param>
    /// <param name="isActive">Filter by active status</param>
    /// <param name="roles">Filter by roles</param>
    /// <param name="pageNumber">Page number</param>
    /// <param name="pageSize">Page size</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated search results</returns>
    Task<(IEnumerable<User> Users, int TotalCount)> SearchUsersAsync(
        string? searchTerm = null,
        bool? isActive = null,
        IEnumerable<string>? roles = null,
        int pageNumber = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);

    #endregion

    #region Profile and Preferences

    /// <summary>
    /// Gets user profile by user ID
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User profile if found, null otherwise</returns>
    Task<UserProfile?> GetUserProfileAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a new user profile
    /// </summary>
    /// <param name="userProfile">User profile to add</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task AddUserProfileAsync(UserProfile userProfile, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets user preferences by user ID
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User preferences</returns>
    Task<IEnumerable<UserPreference>> GetUserPreferencesAsync(Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a specific user preference by category and key
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="category">Preference category</param>
    /// <param name="key">Preference key</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User preference if found, null otherwise</returns>
    Task<UserPreference?> GetUserPreferenceAsync(Guid userId, string category, string key,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds or updates a user preference
    /// </summary>
    /// <param name="userPreference">User preference to add or update</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task AddOrUpdateUserPreferenceAsync(UserPreference userPreference, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets user notification settings by user ID
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User notification settings if found, null otherwise</returns>
    Task<UserNotificationSettings?> GetUserNotificationSettingsAsync(Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds or updates user notification settings
    /// </summary>
    /// <param name="notificationSetting">Notification settings to add or update</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task AddOrUpdateNotificationSettingsAsync(UserNotificationSettings notificationSetting,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets user API keys by user ID
    /// </summary>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User API keys</returns>
    Task<IEnumerable<UserApiKey>> GetUserApiKeysAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a specific user API key by ID and user ID
    /// </summary>
    /// <param name="keyId">API key identifier</param>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>User API key if found, null otherwise</returns>
    Task<UserApiKey?> GetUserApiKeyAsync(Guid keyId, Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a new user API key
    /// </summary>
    /// <param name="apiKey">API key to add</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task AddUserApiKeyAsync(UserApiKey apiKey, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a user API key (soft delete)
    /// </summary>
    /// <param name="keyId">API key identifier</param>
    /// <param name="userId">User identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if deleted, false if not found</returns>
    Task<bool> DeleteUserApiKeyAsync(Guid keyId, Guid userId, CancellationToken cancellationToken = default);

    #endregion
}