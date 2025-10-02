package product.asia.shop.service;

import product.asia.shop.dto.*;

import java.util.List;
import java.util.UUID;

public interface ProductVariantService {
    
    // Product Variant CRUD
    List<ProductVariantResponseDto> getProductVariants(UUID productId, String locale);
    ProductVariantResponseDto getProductVariant(UUID productId, UUID variantId, String locale);
    ProductVariantResponseDto createProductVariant(UUID productId, ProductVariantRequestDto request);
    ProductVariantResponseDto updateProductVariant(UUID productId, UUID variantId, ProductVariantRequestDto request);
    void deleteProductVariant(UUID productId, UUID variantId);
    
    // Bulk Operations
    List<ProductVariantResponseDto> createBulkVariants(UUID productId, List<ProductVariantRequestDto> requests);
    
    // Variant Management
    List<ProductVariantResponseDto> reorderVariants(UUID productId, List<VariantReorderDto> reorderData);
}
