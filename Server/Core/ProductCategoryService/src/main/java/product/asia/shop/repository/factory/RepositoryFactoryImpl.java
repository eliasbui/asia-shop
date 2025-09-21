package product.asia.shop.repository.factory;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;
import product.asia.shop.repository.base.BaseRepository;
import product.asia.shop.repository.base.GenericRepository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Repository factory implementation
 */
@Component
public class RepositoryFactoryImpl implements RepositoryFactory {

    private final Map<Class<?>, GenericRepository<?, ?>> repositoryCache = new ConcurrentHashMap<>();
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public <T, ID> GenericRepository<T, ID> getRepository(Class<T> entityClass) {
        return (GenericRepository<T, ID>) repositoryCache.computeIfAbsent(entityClass, this::createRepository);
    }

    @Override
    public <T, ID> void registerRepository(Class<T> entityClass, GenericRepository<T, ID> repository) {
        repositoryCache.put(entityClass, repository);
    }

    @Override
    public boolean hasRepository(Class<?> entityClass) {
        return repositoryCache.containsKey(entityClass);
    }

    /**
     * Create repository instance for entity class
     */
    @SuppressWarnings("unchecked")
    private <T, ID> GenericRepository<T, ID> createRepository(Class<T> entityClass) {
        // Check for specific repository implementations
       
        // Create generic repository for other entities
        return new GenericRepositoryImpl<>(entityClass);
    }

    /**
     * Generic repository implementation for entities without custom repositories
     */
    private class GenericRepositoryImpl<T, ID> extends BaseRepository<T, ID> {

        public GenericRepositoryImpl(Class<T> entityClass) {
            super();
            this.entityManager = RepositoryFactoryImpl.this.entityManager;
        }
    }
}
