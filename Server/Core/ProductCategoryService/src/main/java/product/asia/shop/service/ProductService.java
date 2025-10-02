package product.asia.shop.service;

import product.asia.shop.dto.*;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    
    // Product CRUD Operations
    PageResponseDto<ProductResponseDto> getAllProducts(Integer page, Integer size, String sortBy, String sortDirection, String locale);
    ProductResponseDto getProductById(UUID id, String locale);
    ProductResponseDto createProduct(ProductRequestDto request);
    ProductResponseDto updateProduct(UUID id, ProductRequestDto request);
    void deleteProduct(UUID id);
    ProductResponseDto updateProductStatus(UUID id, String status);
    
    // Product Search & Filtering
    PageResponseDto<ProductResponseDto> searchProducts(ProductSearchRequestDto searchRequest);
    PageResponseDto<ProductResponseDto> getProductsByCategory(UUID categoryId, Integer page, Integer size, String locale);
    PageResponseDto<ProductResponseDto> getProductsByShop(UUID shopId, Integer page, Integer size, String locale);
    
    // Product Attributes
    List<ProductAttributeDto> getProductAttributes(UUID productId, String locale);
    List<ProductAttributeDto> updateProductAttributes(UUID productId, List<ProductAttributeValueDto> attributes);
    ProductAttributeDto setProductAttributeValue(UUID productId, UUID attributeId, Object value);
    void removeProductAttributeValue(UUID productId, UUID attributeId);
}
