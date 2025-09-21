package product.asia.shop.repository.unitofwork;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import product.asia.shop.repository.base.GenericRepository;
import product.asia.shop.repository.factory.RepositoryFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

/**
 * Unit of Work implementation for managing database transactions and repositories
 */
@Component
public class UnitOfWorkImpl implements UnitOfWork {

    private final Map<Class<?>, GenericRepository<?, ?>> repositories = new HashMap<>();
    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    private RepositoryFactory repositoryFactory;
    private EntityTransaction transaction;

    @Override
    @SuppressWarnings("unchecked")
    public <T, ID> GenericRepository<T, ID> getRepository(Class<T> entityClass) {
        return (GenericRepository<T, ID>) repositories.computeIfAbsent(entityClass,
                key -> repositoryFactory.getRepository(entityClass));
    }

    @Override
    public void beginTransaction() {
        if (transaction != null && transaction.isActive()) {
            throw new IllegalStateException("Transaction is already active");
        }
        transaction = entityManager.getTransaction();
        transaction.begin();
    }

    @Override
    public void commit() {
        if (transaction == null || !transaction.isActive()) {
            throw new IllegalStateException("No active transaction to commit");
        }
        try {
            flush();
            transaction.commit();
        } catch (Exception e) {
            rollback();
            throw new RuntimeException("Failed to commit transaction", e);
        }
    }

    @Override
    public void rollback() {
        if (transaction != null && transaction.isActive()) {
            try {
                transaction.rollback();
            } catch (Exception e) {
                throw new RuntimeException("Failed to rollback transaction", e);
            }
        }
    }

    @Override
    public boolean isTransactionActive() {
        return transaction != null && transaction.isActive();
    }

    @Override
    public void flush() {
        entityManager.flush();
    }

    @Override
    public void clear() {
        entityManager.clear();
        repositories.clear();
    }

    @Override
    public void close() {
        if (isTransactionActive()) {
            rollback();
        }
        clear();
    }

    @Override
    public void executeInTransaction(Runnable action) {
        executeInTransaction(() -> {
            action.run();
            return null;
        });
    }

    @Override
    public <T> T executeInTransaction(Supplier<T> action) {
        boolean wasTransactionStartedHere = false;

        try {
            if (!isTransactionActive()) {
                beginTransaction();
                wasTransactionStartedHere = true;
            }

            T result = action.get();

            if (wasTransactionStartedHere) {
                commit();
            }

            return result;
        } catch (Exception e) {
            if (wasTransactionStartedHere && isTransactionActive()) {
                rollback();
            }
            throw new RuntimeException("Error executing transaction", e);
        }
    }

    /**
     * Get the entity manager (for advanced operations)
     */
    public EntityManager getEntityManager() {
        return entityManager;
    }
}
