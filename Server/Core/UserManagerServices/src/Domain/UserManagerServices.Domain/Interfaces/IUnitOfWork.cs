using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Unit of Work pattern interface for managing database transactions
/// Ensures data consistency across multiple repository operations
/// </summary>
public interface IUnitOfWork : IDisposable
{
    #region Repository Properties

    /// <summary>
    /// Gets the User repository
    /// </summary>
    IUserRepository Users { get; }

    /// <summary>
    /// Gets the Role repository
    /// </summary>
    IRoleRepository Roles { get; }

    /// <summary>
    /// Gets the UserSession repository
    /// </summary>
    IUserSessionRepository UserSessions { get; }

    /// <summary>
    /// Gets the UserActivityLog repository
    /// </summary>
    IUserActivityLogRepository UserActivityLogs { get; }

    /// <summary>
    /// Gets the UserMfaSettings repository
    /// </summary>
    IUserMfaSettingsRepository UserMfaSettings { get; }

    /// <summary>
    /// Gets the UserMfaBackupCode repository
    /// </summary>
    IUserMfaBackupCodeRepository UserMfaBackupCodes { get; }

    /// <summary>
    /// Gets the UserMfaAuditLog repository
    /// </summary>
    IUserMfaAuditLogRepository UserMfaAuditLogs { get; }

    /// <summary>
    /// Gets the UserEmailOtp repository
    /// </summary>
    IUserEmailOtpRepository UserEmailOtps { get; }

    #endregion

    #region Transaction Management

    /// <summary>
    /// Begins a new database transaction
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Commits the current transaction
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Rolls back the current transaction
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);

    #endregion

    #region Save Operations

    /// <summary>
    /// Saves all changes to the database
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of affected records</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Saves all changes to the database with user context for audit
    /// </summary>
    /// <param name="userId">User identifier for audit</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of affected records</returns>
    Task<int> SaveChangesAsync(Guid userId, CancellationToken cancellationToken = default);

    #endregion

    #region Generic Repository Access

    /// <summary>
    /// Gets a generic repository for the specified entity type
    /// </summary>
    /// <typeparam name="T">Entity type</typeparam>
    /// <returns>Generic repository instance</returns>
    IGenericRepository<T> Repository<T>() where T : class, IBaseEntity;

    #endregion

    #region State Management

    /// <summary>
    /// Indicates whether a transaction is currently active
    /// </summary>
    bool HasActiveTransaction { get; }

    /// <summary>
    /// Gets the current transaction ID (if any)
    /// </summary>
    Guid? CurrentTransactionId { get; }

    #endregion
}
