#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using UserManagerServices.Domain.Common;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Repositories;

/// <summary>
/// Generic repository implementation providing common CRUD operations
/// Implements Repository pattern with Entity Framework Core
/// </summary>
/// <typeparam name="T">Entity type that implements IBaseEntity</typeparam>
public class GenericRepository<T> : IGenericRepository<T> where T : class, IBaseEntity
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<T> _dbSet;

    /// <summary>
    /// Initializes a new instance of the GenericRepository
    /// </summary>
    /// <param name="context">Database context</param>
    public GenericRepository(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _dbSet = _context.Set<T>();
    }

    #region Query Operations

    /// <summary>
    /// Gets an entity by its identifier
    /// </summary>
    /// <param name="id">Entity identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Entity if found, null otherwise</returns>
    public virtual async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
    }

    /// <summary>
    /// Gets all entities
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of entities</returns>
    public virtual async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Finds entities based on predicate
    /// </summary>
    /// <param name="predicate">Filter predicate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching entities</returns>
    public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.Where(predicate).ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets the first entity matching the predicate
    /// </summary>
    /// <param name="predicate">Filter predicate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>First matching entity or null</returns>
    public virtual async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(predicate, cancellationToken);
    }

    /// <summary>
    /// Checks if any entity matches the predicate
    /// </summary>
    /// <param name="predicate">Filter predicate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if any entity matches, false otherwise</returns>
    public virtual async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.AnyAsync(predicate, cancellationToken);
    }

    /// <summary>
    /// Counts entities matching the predicate
    /// </summary>
    /// <param name="predicate">Filter predicate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of matching entities</returns>
    public virtual async Task<int> CountAsync(Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(predicate, cancellationToken);
    }

    #endregion

    #region Pagination

    /// <summary>
    /// Gets paginated results
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <param name="predicate">Optional filter predicate</param>
    /// <param name="orderBy">Optional ordering function</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated results</returns>
    public virtual async Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        Expression<Func<T, bool>>? predicate = null,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsQueryable();

        if (predicate != null) query = query.Where(predicate);

        var totalCount = await query.CountAsync(cancellationToken);

        if (orderBy != null)
            query = orderBy(query);
        else
            // Default ordering by CreatedAt descending
            query = query.OrderByDescending(e => e.CreatedAt);

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    #endregion

    #region Command Operations

    /// <summary>
    /// Adds a new entity
    /// </summary>
    /// <param name="entity">Entity to add</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Added entity</returns>
    public virtual async Task<T> AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        var entry = await _dbSet.AddAsync(entity, cancellationToken);
        return entry.Entity;
    }

    /// <summary>
    /// Adds multiple entities
    /// </summary>
    /// <param name="entities">Entities to add</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    public virtual async Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddRangeAsync(entities, cancellationToken);
    }

    /// <summary>
    /// Updates an entity
    /// </summary>
    /// <param name="entity">Entity to update</param>
    /// <returns>Updated entity</returns>
    public virtual T Update(T entity)
    {
        var entry = _dbSet.Update(entity);
        return entry.Entity;
    }

    /// <summary>
    /// Updates multiple entities
    /// </summary>
    /// <param name="entities">Entities to update</param>
    public virtual void UpdateRange(IEnumerable<T> entities)
    {
        _dbSet.UpdateRange(entities);
    }

    /// <summary>
    /// Soft deletes an entity (sets IsDeleted = true)
    /// </summary>
    /// <param name="entity">Entity to soft delete</param>
    public virtual void SoftDelete(T entity)
    {
        // Use reflection to set IsDeleted property since it's read-only
        var entry = _context.Entry(entity);
        entry.Property(nameof(IBaseEntity.IsDeleted)).CurrentValue = true;
        entry.Property(nameof(IBaseEntity.UpdatedAt)).CurrentValue = DateTime.UtcNow;
    }

    /// <summary>
    /// Soft deletes multiple entities
    /// </summary>
    /// <param name="entities">Entities to soft delete</param>
    public virtual void SoftDeleteRange(IEnumerable<T> entities)
    {
        foreach (var entity in entities) SoftDelete(entity);
    }

    /// <summary>
    /// Hard deletes an entity (removes from database)
    /// </summary>
    /// <param name="entity">Entity to delete</param>
    public virtual void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    /// <summary>
    /// Hard deletes multiple entities
    /// </summary>
    /// <param name="entities">Entities to delete</param>
    public virtual void DeleteRange(IEnumerable<T> entities)
    {
        _dbSet.RemoveRange(entities);
    }

    #endregion

    #region Advanced Queries

    /// <summary>
    /// Gets entities with included related data
    /// </summary>
    /// <param name="includeProperties">Properties to include</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Entities with included data</returns>
    public virtual async Task<IEnumerable<T>> GetWithIncludeAsync(
        Expression<Func<T, object>>[] includeProperties,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsQueryable();

        foreach (var includeProperty in includeProperties) query = query.Include(includeProperty);

        return await query.ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets entities with included related data and filtering
    /// </summary>
    /// <param name="predicate">Filter predicate</param>
    /// <param name="includeProperties">Properties to include</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Filtered entities with included data</returns>
    public virtual async Task<IEnumerable<T>> GetWithIncludeAsync(
        Expression<Func<T, bool>> predicate,
        Expression<Func<T, object>>[] includeProperties,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsQueryable();

        foreach (var includeProperty in includeProperties) query = query.Include(includeProperty);

        return await query.Where(predicate).ToListAsync(cancellationToken);
    }

    #endregion
}