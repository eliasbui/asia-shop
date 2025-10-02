package product.asia.shop.repository;

import product.asia.shop.entities.AttributeAllowedValuesEntity;
import product.asia.shop.repository.base.GenericRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttributeAllowedValueRepository extends GenericRepository<AttributeAllowedValuesEntity, UUID> {
    
    /**
     * Find all allowed values for an attribute
     */
    List<AttributeAllowedValuesEntity> findByAttributeIdAndIsDeletedFalseOrderByDisplayOrder(UUID attributeId);
    
    /**
     * Find allowed value by attribute and value
     */
    Optional<AttributeAllowedValuesEntity> findByAttributeIdAndValueAndIsDeletedFalse(UUID attributeId, String value);
    
    /**
     * Check if value exists for attribute
     */
    boolean existsByAttributeIdAndValueAndIsDeletedFalse(UUID attributeId, String value);
    
    /**
     * Check if value exists for attribute (excluding specific value ID for updates)
     */
    boolean existsByAttributeIdAndValueAndIdNotAndIsDeletedFalse(UUID attributeId, String value, UUID excludeId);
    
    /**
     * Count allowed values for an attribute
     */
    long countByAttributeIdAndIsDeletedFalse(UUID attributeId);
    
    /**
     * Delete all allowed values for an attribute
     */
    void deleteByAttributeIdAndIsDeletedFalse(UUID attributeId);
    
    /**
     * Find allowed values with specific display order range
     */
    List<AttributeAllowedValuesEntity> findByAttributeIdAndDisplayOrderBetweenAndIsDeletedFalse(
        UUID attributeId, Integer minOrder, Integer maxOrder);
    
    /**
     * Find max display order for an attribute
     */
    Optional<Integer> findMaxDisplayOrderByAttributeIdAndIsDeletedFalse(UUID attributeId);
    
    /**
     * Find allowed values by value pattern (case-insensitive)
     */
    List<AttributeAllowedValuesEntity> findByAttributeIdAndValueContainingIgnoreCaseAndIsDeletedFalse(
        UUID attributeId, String valuePattern);
}
