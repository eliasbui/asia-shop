using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using UserManagerServices.Domain.Common;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Repositories;

namespace UserManagerServices.Infrastructure.Data;

/// <summary>
/// Unit of Work implementation for managing database transactions and repositories
/// Provides centralized access to repositories and transaction management
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UnitOfWork> _logger;
    private readonly Dictionary<Type, object> _repositories;
    private IDbContextTransaction? _currentTransaction;
    private bool _disposed;

    #region Repository Properties

    /// <summary>
    /// Gets the User repository
    /// </summary>
    public IUserRepository Users { get; }

    /// <summary>
    /// Gets the Role repository
    /// </summary>
    public IRoleRepository Roles { get; }

    /// <summary>
    /// Gets the UserSession repository
    /// </summary>
    public IUserSessionRepository UserSessions { get; }

    /// <summary>
    /// Gets the UserActivityLog repository
    /// </summary>
    public IUserActivityLogRepository UserActivityLogs { get; }

    /// <summary>
    /// Gets the UserMfaSettings repository
    /// </summary>
    public IUserMfaSettingsRepository UserMfaSettings { get; }

    /// <summary>
    /// Gets the UserMfaBackupCode repository
    /// </summary>
    public IUserMfaBackupCodeRepository UserMfaBackupCodes { get; }

    /// <summary>
    /// Gets the UserMfaAuditLog repository
    /// </summary>
    public IUserMfaAuditLogRepository UserMfaAuditLogs { get; }

    /// <summary>
    /// Gets the UserEmailOtp repository
    /// </summary>
    public IUserEmailOtpRepository UserEmailOtps { get; }

    /// <summary>
    /// Gets the UserLoginAttempt repository
    /// </summary>
    public IUserLoginAttemptRepository UserLoginAttempts { get; }

    /// <summary>
    /// Gets the UserLockoutHistory repository
    /// </summary>
    public IUserLockoutHistoryRepository UserLockoutHistory { get; }

    /// <summary>
    /// Gets the UserSecuritySettings repository
    /// </summary>
    public IUserSecuritySettingsRepository UserSecuritySettings { get; }

    #endregion

    /// <summary>
    /// Initializes a new instance of the UnitOfWork
    /// </summary>
    /// <param name="context">Database context</param>
    /// <param name="logger">Logger instance</param>
    public UnitOfWork(
        ApplicationDbContext context,
        ILogger<UnitOfWork> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _repositories = new Dictionary<Type, object>();

        // Initialize specific repositories
        Users = new UserRepository(_context);
        Roles = new RoleRepository(_context);
        UserSessions = new UserSessionRepository(_context);
        UserActivityLogs = new UserActivityLogRepository(_context);
        UserMfaSettings = new UserMfaSettingsRepository(_context);
        UserMfaBackupCodes = new UserMfaBackupCodeRepository(_context);
        UserMfaAuditLogs = new UserMfaAuditLogRepository(_context);
        UserEmailOtps = new UserEmailOtpRepository(_context);
        UserLoginAttempts = new UserLoginAttemptRepository(_context);
        UserLockoutHistory = new UserLockoutHistoryRepository(_context);
        UserSecuritySettings = new UserSecuritySettingsRepository(_context);
    }

    #region Transaction Management

    /// <summary>
    /// Indicates whether a transaction is currently active
    /// </summary>
    public bool HasActiveTransaction => _currentTransaction != null;

    /// <summary>
    /// Gets the current transaction ID (if any)
    /// </summary>
    public Guid? CurrentTransactionId => _currentTransaction?.TransactionId;

    /// <summary>
    /// Begins a new database transaction
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction != null)
        {
            _logger.LogWarning("Transaction already active. Transaction ID: {TransactionId}",
                _currentTransaction.TransactionId);
            return;
        }

        _currentTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        _logger.LogInformation("Transaction started. Transaction ID: {TransactionId}",
            _currentTransaction.TransactionId);
    }

    /// <summary>
    /// Commits the current transaction
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction == null)
        {
            _logger.LogWarning("No active transaction to commit");
            return;
        }

        try
        {
            await _currentTransaction.CommitAsync(cancellationToken);
            _logger.LogInformation("Transaction committed successfully. Transaction ID: {TransactionId}",
                _currentTransaction.TransactionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to commit transaction. Transaction ID: {TransactionId}",
                _currentTransaction.TransactionId);
            await RollbackTransactionAsync(cancellationToken);
            throw;
        }
        finally
        {
            await _currentTransaction.DisposeAsync();
            _currentTransaction = null;
        }
    }

    /// <summary>
    /// Rolls back the current transaction
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction == null)
        {
            _logger.LogWarning("No active transaction to rollback");
            return;
        }

        try
        {
            await _currentTransaction.RollbackAsync(cancellationToken);
            _logger.LogInformation("Transaction rolled back successfully. Transaction ID: {TransactionId}",
                _currentTransaction.TransactionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to rollback transaction. Transaction ID: {TransactionId}",
                _currentTransaction.TransactionId);
            throw;
        }
        finally
        {
            await _currentTransaction.DisposeAsync();
            _currentTransaction = null;
        }
    }

    #endregion

    #region Save Operations

    /// <summary>
    /// Saves all changes to the database
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of affected records</returns>
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Saved {Count} changes to database", result);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save changes to database");
            throw;
        }
    }

    /// <summary>
    /// Saves all changes to the database with user context for audit
    /// </summary>
    /// <param name="userId">User identifier for audit</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of affected records</returns>
    public async Task<int> SaveChangesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        try
        {
            // Set audit information for modified entities
            SetAuditInformation(userId);

            var result = await _context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Saved {Count} changes to database with user context {UserId}", result, userId);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save changes to database with user context {UserId}", userId);
            throw;
        }
    }

    #endregion

    #region Generic Repository Access

    /// <summary>
    /// Gets a generic repository for the specified entity type
    /// </summary>
    /// <typeparam name="T">Entity type</typeparam>
    /// <returns>Generic repository instance</returns>
    public IGenericRepository<T> Repository<T>() where T : class, IBaseEntity
    {
        var type = typeof(T);

        if (_repositories.ContainsKey(type)) return (IGenericRepository<T>)_repositories[type];

        var repository = new GenericRepository<T>(_context);
        _repositories.Add(type, repository);

        return repository;
    }

    #endregion

    #region Private Methods

    /// <summary>
    /// Sets audit information for modified entities
    /// </summary>
    /// <param name="userId">User identifier</param>
    private void SetAuditInformation(Guid userId)
    {
        var entries = _context.ChangeTracker.Entries<IBaseEntity>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
            if (entry.State == EntityState.Added)
                entry.Property(nameof(IBaseEntity.CreatedBy)).CurrentValue = userId;
            else if (entry.State == EntityState.Modified)
                entry.Property(nameof(IBaseEntity.UpdatedBy)).CurrentValue = userId;
    }

    #endregion

    #region Dispose

    /// <summary>
    /// Disposes the unit of work and releases resources
    /// </summary>
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    /// <summary>
    /// Disposes the unit of work and releases resources
    /// </summary>
    /// <param name="disposing">True if disposing managed resources</param>
    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed && disposing)
        {
            _currentTransaction?.Dispose();
            _context.Dispose();
            _disposed = true;
        }
    }

    #endregion
}