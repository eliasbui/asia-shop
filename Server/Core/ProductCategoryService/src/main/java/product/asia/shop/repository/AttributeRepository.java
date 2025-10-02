package product.asia.shop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import product.asia.shop.entities.AttributesEntity;
import product.asia.shop.repository.base.GenericRepository;

import java.util.List;
import java.util.UUID;

public interface AttributeRepository extends GenericRepository<AttributesEntity, UUID> {
    
    /**
     * Find attributes by group ID
     */
    List<AttributesEntity> findByGroupIdAndIsDeletedFalse(UUID groupId);
    
    /**
     * Find attributes by data type
     */
    Page<AttributesEntity> findByDataTypeAndIsDeletedFalse(String dataType, Pageable pageable);
    
    /**
     * Find filterable attributes
     */
    List<AttributesEntity> findByIsFilterableTrueAndIsDeletedFalse();
    
    /**
     * Find required attributes
     */
    List<AttributesEntity> findByIsRequiredTrueAndIsDeletedFalse();
    
    /**
     * Find attributes by input type
     */
    List<AttributesEntity> findByInputTypeAndIsDeletedFalse(String inputType);
    
    /**
     * Find attributes by code (case-insensitive)
     */
    List<AttributesEntity> findByCodeContainingIgnoreCaseAndIsDeletedFalse(String code);
    
    /**
     * Find all active attributes (not deleted) with pagination
     */
    Page<AttributesEntity> findByIsDeletedFalse(Pageable pageable);
    
    /**
     * Find all active attributes (not deleted) ordered by group and code
     */
    List<AttributesEntity> findByIsDeletedFalseOrderByGroupIdAscCodeAsc();
    
    /**
     * Check if code exists (excluding specific attribute ID for updates)
     */
    boolean existsByCodeAndIdNotAndIsDeletedFalse(String code, UUID excludeId);
    
    /**
     * Check if code exists
     */
    boolean existsByCodeAndIsDeletedFalse(String code);
    
    /**
     * Count attributes by group
     */
    long countByGroupIdAndIsDeletedFalse(UUID groupId);
    
    /**
     * Find attributes with filters
     */
    Page<AttributesEntity> findByGroupIdAndDataTypeAndIsFilterableAndIsDeletedFalse(
        UUID groupId, String dataType, Boolean isFilterable, Pageable pageable);
}
