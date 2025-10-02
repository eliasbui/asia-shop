package product.asia.shop.repository;

import product.asia.shop.entities.ProductImagesEntity;
import product.asia.shop.repository.base.GenericRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductImageRepository extends GenericRepository<ProductImagesEntity, UUID> {
    
    /**
     * Find all images for a product
     */
    List<ProductImagesEntity> findByProductIdAndIsDeletedFalseOrderByDisplayOrder(UUID productId);
    
    /**
     * Find images by product and type
     */
    List<ProductImagesEntity> findByProductIdAndImageTypeAndIsDeletedFalseOrderByDisplayOrder(UUID productId, String imageType);
    
    /**
     * Find image by product and image ID
     */
    Optional<ProductImagesEntity> findByProductIdAndIdAndIsDeletedFalse(UUID productId, UUID imageId);
    
    /**
     * Find main image for a product
     */
    Optional<ProductImagesEntity> findByProductIdAndImageTypeAndIsDeletedFalse(UUID productId, String imageType);
    
    /**
     * Count images for a product
     */
    long countByProductIdAndIsDeletedFalse(UUID productId);
    
    /**
     * Count images by type for a product
     */
    long countByProductIdAndImageTypeAndIsDeletedFalse(UUID productId, String imageType);
    
    /**
     * Find images by URL
     */
    List<ProductImagesEntity> findByImageUrlAndIsDeletedFalse(String imageUrl);
    
    /**
     * Find max display order for a product
     */
    Optional<Integer> findMaxDisplayOrderByProductIdAndIsDeletedFalse(UUID productId);
    
    /**
     * Find max display order by type for a product
     */
    Optional<Integer> findMaxDisplayOrderByProductIdAndImageTypeAndIsDeletedFalse(UUID productId, String imageType);
    
    /**
     * Delete all images for a product
     */
    void deleteByProductIdAndIsDeletedFalse(UUID productId);
    
    /**
     * Delete images by type for a product
     */
    void deleteByProductIdAndImageTypeAndIsDeletedFalse(UUID productId, String imageType);
}
