package product.asia.shop.repository;

import product.asia.shop.entities.ProductVariantsEntity;
import product.asia.shop.repository.base.GenericRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductVariantRepository extends GenericRepository<ProductVariantsEntity, UUID> {
    
    /**
     * Find all variants for a product
     */
    List<ProductVariantsEntity> findByParentProductIdAndIsDeletedFalseOrderByPosition(UUID parentProductId);
    
    /**
     * Find variant by parent product and variant ID
     */
    Optional<ProductVariantsEntity> findByParentProductIdAndIdAndIsDeletedFalse(UUID parentProductId, UUID variantId);
    
    /**
     * Find variant by SKU
     */
    Optional<ProductVariantsEntity> findByVariantSkuAndIsDeletedFalse(String variantSku);
    
    /**
     * Check if variant SKU exists (excluding specific variant ID for updates)
     */
    boolean existsByVariantSkuAndIdNotAndIsDeletedFalse(String variantSku, UUID excludeId);
    
    /**
     * Check if variant SKU exists
     */
    boolean existsByVariantSkuAndIsDeletedFalse(String variantSku);
    
    /**
     * Count variants for a product
     */
    long countByParentProductIdAndIsDeletedFalse(UUID parentProductId);
    
    /**
     * Find variants by status
     */
    List<ProductVariantsEntity> findByParentProductIdAndStatusAndIsDeletedFalse(UUID parentProductId, String status);
    
    /**
     * Find variants by barcode
     */
    List<ProductVariantsEntity> findByBarcodeAndIsDeletedFalse(String barcode);
    
    /**
     * Find max position for a product
     */
    Optional<Integer> findMaxPositionByParentProductIdAndIsDeletedFalse(UUID parentProductId);
    
    /**
     * Delete all variants for a product
     */
    void deleteByParentProductIdAndIsDeletedFalse(UUID parentProductId);
}
