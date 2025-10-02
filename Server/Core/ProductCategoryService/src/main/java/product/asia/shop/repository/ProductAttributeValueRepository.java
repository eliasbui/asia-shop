package product.asia.shop.repository;

import product.asia.shop.entities.ProductAttributeValuesEntity;
import product.asia.shop.repository.base.GenericRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductAttributeValueRepository extends GenericRepository<ProductAttributeValuesEntity, UUID> {
    
    /**
     * Find all attribute values for a product
     */
    List<ProductAttributeValuesEntity> findByProductIdAndIsDeletedFalse(UUID productId);
    
    /**
     * Find specific attribute value for a product
     */
    Optional<ProductAttributeValuesEntity> findByProductIdAndAttributeIdAndIsDeletedFalse(UUID productId, UUID attributeId);
    
    /**
     * Find all products with specific attribute value
     */
    List<ProductAttributeValuesEntity> findByAttributeIdAndValueStringAndIsDeletedFalse(UUID attributeId, String value);
    
    /**
     * Find all products with specific numeric attribute value
     */
    List<ProductAttributeValuesEntity> findByAttributeIdAndValueNumberAndIsDeletedFalse(UUID attributeId, Double value);
    
    /**
     * Find all products with specific boolean attribute value
     */
    List<ProductAttributeValuesEntity> findByAttributeIdAndValueBooleanAndIsDeletedFalse(UUID attributeId, Boolean value);
    
    /**
     * Find all products with specific option value
     */
    List<ProductAttributeValuesEntity> findByAttributeIdAndValueOptionsIdAndIsDeletedFalse(UUID attributeId, UUID optionId);
    
    /**
     * Find all attribute values by attribute ID
     */
    List<ProductAttributeValuesEntity> findByAttributeIdAndIsDeletedFalse(UUID attributeId);
    
    /**
     * Delete all attribute values for a product
     */
    void deleteByProductIdAndIsDeletedFalse(UUID productId);
    
    /**
     * Delete specific attribute value for a product
     */
    void deleteByProductIdAndAttributeIdAndIsDeletedFalse(UUID productId, UUID attributeId);
    
    /**
     * Check if product has specific attribute
     */
    boolean existsByProductIdAndAttributeIdAndIsDeletedFalse(UUID productId, UUID attributeId);
    
    /**
     * Count attribute values for a product
     */
    long countByProductIdAndIsDeletedFalse(UUID productId);
    
    /**
     * Count products using specific attribute
     */
    long countByAttributeIdAndIsDeletedFalse(UUID attributeId);
}
