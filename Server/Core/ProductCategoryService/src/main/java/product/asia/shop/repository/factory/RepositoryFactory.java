package product.asia.shop.repository.factory;

import product.asia.shop.repository.base.GenericRepository;

/**
 * Factory interface for creating repository instances
 */
public interface RepositoryFactory {

    /**
     * Get repository instance for a specific entity type
     *
     * @param entityClass The entity class
     * @param <T>         Entity type
     * @param <ID>        Primary key type
     * @return Repository instance
     */
    <T, ID> GenericRepository<T, ID> getRepository(Class<T> entityClass);

    /**
     * Register a custom repository for an entity type
     *
     * @param entityClass The entity class
     * @param repository  The repository instance
     * @param <T>         Entity type
     * @param <ID>        Primary key type
     */
    <T, ID> void registerRepository(Class<T> entityClass, GenericRepository<T, ID> repository);

    /**
     * Check if a repository is registered for an entity type
     *
     * @param entityClass The entity class
     * @return true if repository is registered
     */
    boolean hasRepository(Class<?> entityClass);
}
