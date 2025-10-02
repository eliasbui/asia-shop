package product.asia.shop.repository;

import product.asia.shop.entities.CategoriesEntity;
import product.asia.shop.repository.base.GenericRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends GenericRepository<CategoriesEntity, UUID> {
    
    /**
     * Find root categories (no parent)
     */
    List<CategoriesEntity> findByParentIdIsNullAndIsDeletedFalse();
    
    /**
     * Find child categories by parent ID
     */
    List<CategoriesEntity> findByParentIdAndIsDeletedFalse(UUID parentId);
    
    /**
     * Find categories by name (case-insensitive)
     */
    List<CategoriesEntity> findByNameContainingIgnoreCaseAndIsDeletedFalse(String name);
    
    /**
     * Find all active categories (not deleted)
     */
    List<CategoriesEntity> findByIsDeletedFalseOrderByName();
    
    /**
     * Check if category has children
     */
    boolean existsByParentIdAndIsDeletedFalse(UUID parentId);
    
    /**
     * Count child categories
     */
    long countByParentIdAndIsDeletedFalse(UUID parentId);
    
    /**
     * Check if name exists (excluding specific category ID for updates)
     */
    boolean existsByNameAndIdNotAndIsDeletedFalse(String name, UUID excludeId);
    
    /**
     * Check if name exists
     */
    boolean existsByNameAndIsDeletedFalse(String name);
    
    /**
     * Find category hierarchy (ancestors) - requires custom implementation
     */
    List<CategoriesEntity> findAncestors(UUID categoryId);
    
    /**
     * Find category tree (descendants) - requires custom implementation  
     */
    List<CategoriesEntity> findDescendants(UUID categoryId);
}
