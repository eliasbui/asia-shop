#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.Linq.Expressions;
using UserManagerServices.Domain.Common;

namespace UserManagerServices.Domain.Interfaces;

/// <summary>
/// Generic repository interface providing common CRUD operations
/// Follows Repository pattern to abstract data access logic
/// </summary>
/// <typeparam name="T">Entity type that implements IBaseEntity</typeparam>
public interface IGenericRepository<T> where T : class, IBaseEntity
{
    #region Query Operations

    /// <summary>
    /// Gets an entity by its identifier
    /// </summary>
    /// <param name="id">Entity identifier</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Entity if found, null otherwise</returns>
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all entities
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of entities</returns>
    Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Finds entities based on predicate
    /// </summary>
    /// <param name="predicate">Filter predicate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Collection of matching entities</returns>
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the first entity matching the predicate
    /// </summary>
    /// <param name="predicate">Filter predicate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>First matching entity or null</returns>
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks if any entity matches the predicate
    /// </summary>
    /// <param name="predicate">Filter predicate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>True if any entity matches, false otherwise</returns>
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Counts entities matching the predicate
    /// </summary>
    /// <param name="predicate">Filter predicate</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Count of matching entities</returns>
    Task<int> CountAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);

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
    Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        Expression<Func<T, bool>>? predicate = null,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        CancellationToken cancellationToken = default);

    #endregion

    #region Command Operations

    /// <summary>
    /// Adds a new entity
    /// </summary>
    /// <param name="entity">Entity to add</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Added entity</returns>
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds multiple entities
    /// </summary>
    /// <param name="entities">Entities to add</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Task representing the operation</returns>
    Task AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an entity
    /// </summary>
    /// <param name="entity">Entity to update</param>
    /// <returns>Updated entity</returns>
    T Update(T entity);

    /// <summary>
    /// Updates multiple entities
    /// </summary>
    /// <param name="entities">Entities to update</param>
    void UpdateRange(IEnumerable<T> entities);

    /// <summary>
    /// Soft deletes an entity (sets IsDeleted = true)
    /// </summary>
    /// <param name="entity">Entity to soft delete</param>
    void SoftDelete(T entity);

    /// <summary>
    /// Soft deletes multiple entities
    /// </summary>
    /// <param name="entities">Entities to soft delete</param>
    void SoftDeleteRange(IEnumerable<T> entities);

    /// <summary>
    /// Hard deletes an entity (removes from database)
    /// </summary>
    /// <param name="entity">Entity to delete</param>
    void Delete(T entity);

    /// <summary>
    /// Hard deletes multiple entities
    /// </summary>
    /// <param name="entities">Entities to delete</param>
    void DeleteRange(IEnumerable<T> entities);

    #endregion

    #region Advanced Queries

    /// <summary>
    /// Gets entities with included related data
    /// </summary>
    /// <param name="includeProperties">Properties to include</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Entities with included data</returns>
    Task<IEnumerable<T>> GetWithIncludeAsync(
        Expression<Func<T, object>>[] includeProperties,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets entities with included related data and filtering
    /// </summary>
    /// <param name="predicate">Filter predicate</param>
    /// <param name="includeProperties">Properties to include</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Filtered entities with included data</returns>
    Task<IEnumerable<T>> GetWithIncludeAsync(
        Expression<Func<T, bool>> predicate,
        Expression<Func<T, object>>[] includeProperties,
        CancellationToken cancellationToken = default);

    #endregion
}