package product.asia.shop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import product.asia.shop.entities.ProductsEntity;
import product.asia.shop.repository.base.GenericRepository;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends GenericRepository<ProductsEntity, UUID> {
    
    /**
     * Find products by shop ID
     */
    Page<ProductsEntity> findByShopIdAndIsDeletedFalse(UUID shopId, Pageable pageable);
    
    /**
     * Find products by category ID
     */
    Page<ProductsEntity> findByCategoryIdAndIsDeletedFalse(UUID categoryId, Pageable pageable);
    
    /**
     * Find products by status
     */
    Page<ProductsEntity> findByStatusAndIsDeletedFalse(String status, Pageable pageable);
    
    /**
     * Find products by shop and category
     */
    Page<ProductsEntity> findByShopIdAndCategoryIdAndIsDeletedFalse(UUID shopId, UUID categoryId, Pageable pageable);
    
    /**
     * Find products by SKU
     */
    List<ProductsEntity> findBySkuContainingIgnoreCaseAndIsDeletedFalse(String sku);
    
    /**
     * Find products by name
     */
    Page<ProductsEntity> findByNameContainingIgnoreCaseAndIsDeletedFalse(String name, Pageable pageable);
    
    /**
     * Find all active products (not deleted)
     */
    Page<ProductsEntity> findByIsDeletedFalse(Pageable pageable);
    
    /**
     * Count products by shop
     */
    long countByShopIdAndIsDeletedFalse(UUID shopId);
    
    /**
     * Count products by category
     */
    long countByCategoryIdAndIsDeletedFalse(UUID categoryId);
    
    /**
     * Check if SKU exists (excluding specific product ID for updates)
     */
    boolean existsBySkuAndIdNotAndIsDeletedFalse(String sku, UUID excludeId);
    
    /**
     * Check if SKU exists
     */
    boolean existsBySkuAndIsDeletedFalse(String sku);
}
