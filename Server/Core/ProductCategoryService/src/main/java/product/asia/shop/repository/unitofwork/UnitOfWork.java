package product.asia.shop.repository.unitofwork;

import product.asia.shop.repository.base.GenericRepository;

/**
 * Unit of Work pattern interface for managing database transactions and repositories
 */
public interface UnitOfWork {

    /**
     * Get repository for a specific entity type
     *
     * @param entityClass The entity class
     * @param <T>         Entity type
     * @param <ID>        Primary key type
     * @return Repository instance
     */
    <T, ID> GenericRepository<T, ID> getRepository(Class<T> entityClass);

    /**
     * Begin a new transaction
     */
    void beginTransaction();

    /**
     * Commit the current transaction
     */
    void commit();

    /**
     * Rollback the current transaction
     */
    void rollback();

    /**
     * Check if a transaction is active
     *
     * @return true if transaction is active
     */
    boolean isTransactionActive();

    /**
     * Flush all pending changes to the database
     */
    void flush();

    /**
     * Clear the persistence context
     */
    void clear();

    /**
     * Close the unit of work and release resources
     */
    void close();

    /**
     * Execute a block of code within a transaction
     *
     * @param action The action to execute
     */
    void executeInTransaction(Runnable action);

    /**
     * Execute a block of code within a transaction and return a result
     *
     * @param action The action to execute
     * @param <T>    Return type
     * @return The result of the action
     */
    <T> T executeInTransaction(java.util.function.Supplier<T> action);
}
