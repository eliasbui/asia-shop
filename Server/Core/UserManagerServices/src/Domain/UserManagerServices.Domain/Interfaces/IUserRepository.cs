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
    Task<IEnumerable<User>> GetUsersByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    
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
    Task<Dictionary<DateTime, int>> GetRegistrationStatisticsAsync(int days, CancellationToken cancellationToken = default);
    
    #endregion
    
    #region User Validation
    
    /// <summary>
    /// Checks if email is already taken by another user
    /// </summary>
    /// <param name="email">Email to check</param>
    /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if email is taken, false otherwise</returns>
    Task<bool> IsEmailTakenAsync(string email, Guid? excludeUserId = null, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Checks if username is already taken by another user
    /// </summary>
    /// <param name="username">Username to check</param>
    /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if username is taken, false otherwise</returns>
    Task<bool> IsUsernameTakenAsync(string username, Guid? excludeUserId = null, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Checks if phone number is already taken by another user
    /// </summary>
    /// <param name="phoneNumber">Phone number to check</param>
    /// <param name="excludeUserId">User ID to exclude from check (for updates)</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if phone number is taken, false otherwise</returns>
    Task<bool> IsPhoneNumberTakenAsync(string phoneNumber, Guid? excludeUserId = null, CancellationToken cancellationToken = default);
    
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
}
