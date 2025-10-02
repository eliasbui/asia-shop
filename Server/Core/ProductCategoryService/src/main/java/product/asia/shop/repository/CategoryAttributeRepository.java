package product.asia.shop.repository;

import product.asia.shop.entities.CategoryAttributesEntity;
import product.asia.shop.repository.base.GenericRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryAttributeRepository extends GenericRepository<CategoryAttributesEntity, UUID> {
    
    /**
     * Find all attributes for a category
     */
    List<CategoryAttributesEntity> findByCategoryIdAndIsDeletedFalseOrderByDisplayOrder(UUID categoryId);
    
    /**
     * Find all categories using a specific attribute
     */
    List<CategoryAttributesEntity> findByAttributeIdAndIsDeletedFalse(UUID attributeId);
    
    /**
     * Find specific category-attribute relationship
     */
    Optional<CategoryAttributesEntity> findByCategoryIdAndAttributeIdAndIsDeletedFalse(UUID categoryId, UUID attributeId);
    
    /**
     * Check if category has specific attribute
     */
    boolean existsByCategoryIdAndAttributeIdAndIsDeletedFalse(UUID categoryId, UUID attributeId);
    
    /**
     * Count attributes for a category
     */
    long countByCategoryIdAndIsDeletedFalse(UUID categoryId);
    
    /**
     * Count categories using specific attribute
     */
    long countByAttributeIdAndIsDeletedFalse(UUID attributeId);
    
    /**
     * Delete category-attribute relationship
     */
    void deleteByCategoryIdAndAttributeIdAndIsDeletedFalse(UUID categoryId, UUID attributeId);
    
    /**
     * Delete all attributes for a category
     */
    void deleteByCategoryIdAndIsDeletedFalse(UUID categoryId);
    
    /**
     * Find attributes with specific display order range
     */
    List<CategoryAttributesEntity> findByCategoryIdAndDisplayOrderBetweenAndIsDeletedFalse(
        UUID categoryId, Integer minOrder, Integer maxOrder);
    
    /**
     * Find max display order for a category
     */
    Optional<Integer> findMaxDisplayOrderByCategoryIdAndIsDeletedFalse(UUID categoryId);
}
