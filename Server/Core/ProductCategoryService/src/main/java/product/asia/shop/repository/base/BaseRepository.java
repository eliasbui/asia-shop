package product.asia.shop.repository.base;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Optional;

/**
 * Base repository implementation providing common CRUD operations
 *
 * @param <T>  Entity type
 * @param <ID> Primary key type
 */
@Transactional
public abstract class BaseRepository<T, ID> implements GenericRepository<T, ID> {

    private final Class<T> entityClass;
    @PersistenceContext
    public EntityManager entityManager;

    @SuppressWarnings("unchecked")
    public BaseRepository() {
        this.entityClass = (Class<T>) ((ParameterizedType) getClass()
                .getGenericSuperclass()).getActualTypeArguments()[0];
    }

    @Override
    public T save(T entity) {
        if (entityManager.contains(entity)) {
            return entityManager.merge(entity);
        } else {
            entityManager.persist(entity);
            return entity;
        }
    }

    @Override
    public List<T> saveAll(Iterable<T> entities) {
        List<T> result = new java.util.ArrayList<>();
        for (T entity : entities) {
            result.add(save(entity));
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<T> findById(ID id) {
        T entity = entityManager.find(entityClass, id);
        return Optional.ofNullable(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(ID id) {
        return findById(id).isPresent();
    }

    @Override
    @Transactional(readOnly = true)
    public List<T> findAll() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> query = cb.createQuery(entityClass);
        Root<T> root = query.from(entityClass);
        query.select(root);

        return entityManager.createQuery(query).getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<T> findAll(Sort sort) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> query = cb.createQuery(entityClass);
        Root<T> root = query.from(entityClass);
        query.select(root);

        // Apply sorting
        if (sort != null && sort.isSorted()) {
            List<jakarta.persistence.criteria.Order> orders = new java.util.ArrayList<>();
            for (Sort.Order order : sort) {
                if (order.isAscending()) {
                    orders.add(cb.asc(root.get(order.getProperty())));
                } else {
                    orders.add(cb.desc(root.get(order.getProperty())));
                }
            }
            query.orderBy(orders);
        }

        return entityManager.createQuery(query).getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<T> findAll(Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> query = cb.createQuery(entityClass);
        Root<T> root = query.from(entityClass);
        query.select(root);

        // Apply sorting
        if (pageable.getSort().isSorted()) {
            List<jakarta.persistence.criteria.Order> orders = new java.util.ArrayList<>();
            for (Sort.Order order : pageable.getSort()) {
                if (order.isAscending()) {
                    orders.add(cb.asc(root.get(order.getProperty())));
                } else {
                    orders.add(cb.desc(root.get(order.getProperty())));
                }
            }
            query.orderBy(orders);
        }

        TypedQuery<T> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<T> content = typedQuery.getResultList();
        long total = count();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    @Transactional(readOnly = true)
    public List<T> findAllById(Iterable<ID> ids) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> query = cb.createQuery(entityClass);
        Root<T> root = query.from(entityClass);

        List<ID> idList = new java.util.ArrayList<>();
        ids.forEach(idList::add);

        query.select(root).where(root.get("id").in(idList));

        return entityManager.createQuery(query).getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<T> root = query.from(entityClass);
        query.select(cb.count(root));

        return entityManager.createQuery(query).getSingleResult();
    }

    @Override
    public void deleteById(ID id) {
        findById(id).ifPresent(this::delete);
    }

    @Override
    public void delete(T entity) {
        if (entityManager.contains(entity)) {
            entityManager.remove(entity);
        } else {
            entityManager.remove(entityManager.merge(entity));
        }
    }

    @Override
    public void deleteAll(Iterable<T> entities) {
        for (T entity : entities) {
            delete(entity);
        }
    }

    @Override
    public void deleteAll() {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        jakarta.persistence.criteria.CriteriaDelete<T> delete = cb.createCriteriaDelete(entityClass);
        delete.from(entityClass);
        entityManager.createQuery(delete).executeUpdate();
    }

    @Override
    public void flush() {
        entityManager.flush();
    }

    @Override
    public T saveAndFlush(T entity) {
        T result = save(entity);
        flush();
        return result;
    }

    @Override
    public void deleteInBatch(Iterable<T> entities) {
        if (!entities.iterator().hasNext()) {
            return;
        }

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        jakarta.persistence.criteria.CriteriaDelete<T> delete = cb.createCriteriaDelete(entityClass);
        Root<T> root = delete.from(entityClass);

        List<ID> ids = new java.util.ArrayList<>();
        for (T entity : entities) {
            try {
                @SuppressWarnings("unchecked")
                ID id = (ID) entityClass.getMethod("getId").invoke(entity);
                ids.add(id);
            } catch (Exception e) {
                throw new RuntimeException("Error getting ID from entity", e);
            }
        }

        delete.where(root.get("id").in(ids));
        entityManager.createQuery(delete).executeUpdate();
    }

    @Override
    public void deleteAllInBatch() {
        deleteAll();
    }

    @Override
    @Transactional(readOnly = true)
    public T getReference(ID id) {
        return entityManager.getReference(entityClass, id);
    }

    /**
     * Get the entity class
     */
    protected Class<T> getEntityClass() {
        return entityClass;
    }

    /**
     * Get the entity manager
     */
    protected EntityManager getEntityManager() {
        return entityManager;
    }
}
