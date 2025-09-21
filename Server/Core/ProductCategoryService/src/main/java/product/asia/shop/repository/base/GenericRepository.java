package product.asia.shop.repository.base;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

/**
 * Generic repository interface providing common CRUD operations
 *
 * @param <T>  Entity type
 * @param <ID> Primary key type
 */
public interface GenericRepository<T, ID> {

    /**
     * Save an entity
     */
    T save(T entity);

    /**
     * Save multiple entities
     */
    List<T> saveAll(Iterable<T> entities);

    /**
     * Find entity by ID
     */
    Optional<T> findById(ID id);

    /**
     * Check if entity exists by ID
     */
    boolean existsById(ID id);

    /**
     * Find all entities
     */
    List<T> findAll();

    /**
     * Find all entities with sorting
     */
    List<T> findAll(Sort sort);

    /**
     * Find all entities with pagination
     */
    Page<T> findAll(Pageable pageable);

    /**
     * Find all entities by IDs
     */
    List<T> findAllById(Iterable<ID> ids);

    /**
     * Count all entities
     */
    long count();

    /**
     * Delete entity by ID
     */
    void deleteById(ID id);

    /**
     * Delete an entity
     */
    void delete(T entity);

    /**
     * Delete multiple entities
     */
    void deleteAll(Iterable<T> entities);

    /**
     * Delete all entities
     */
    void deleteAll();

    /**
     * Flush changes to database
     */
    void flush();

    /**
     * Save and flush
     */
    T saveAndFlush(T entity);

    /**
     * Delete in batch
     */
    void deleteInBatch(Iterable<T> entities);

    /**
     * Delete all in batch
     */
    void deleteAllInBatch();

    /**
     * Get reference to entity (lazy loading)
     */
    T getReference(ID id);
}
