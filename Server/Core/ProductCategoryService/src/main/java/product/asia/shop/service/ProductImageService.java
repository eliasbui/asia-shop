package product.asia.shop.service;

import org.springframework.web.multipart.MultipartFile;
import product.asia.shop.dto.*;

import java.util.List;
import java.util.UUID;

public interface ProductImageService {
    
    // Product Image CRUD
    List<ProductImageResponseDto> getProductImages(UUID productId, String imageType);
    ProductImageResponseDto getProductImage(UUID productId, UUID imageId);
    ProductImageResponseDto createProductImage(UUID productId, ProductImageRequestDto request);
    ProductImageResponseDto updateProductImage(UUID productId, UUID imageId, ProductImageRequestDto request);
    void deleteProductImage(UUID productId, UUID imageId);
    
    // File Upload
    ProductImageResponseDto uploadProductImage(UUID productId, MultipartFile file, String imageType, String altText, Integer displayOrder);
    
    // Image Management
    List<ProductImageResponseDto> reorderImages(UUID productId, List<ImageReorderDto> reorderData);
    ProductImageResponseDto setMainImage(UUID productId, UUID imageId);
    
    // Bulk Operations
    List<ProductImageResponseDto> createBulkImages(UUID productId, List<ProductImageRequestDto> requests);
}
