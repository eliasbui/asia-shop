package product.asia.shop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import product.asia.shop.dto.*;
import product.asia.shop.service.ProductService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Product CRUD Operations
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponseDto<ProductResponseDto>>> getAllProducts(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection,
            @RequestParam(required = false) String locale) {
        
        PageResponseDto<ProductResponseDto> products = productService.getAllProducts(page, size, sortBy, sortDirection, locale);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> getProductById(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        ProductResponseDto product = productService.getProductById(id, locale);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponseDto>> createProduct(@Valid @RequestBody ProductRequestDto request) {
        ProductResponseDto createdProduct = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdProduct));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponseDto>> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequestDto request) {
        
        ProductResponseDto updatedProduct = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedProduct));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ProductResponseDto>> updateProductStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        
        ProductResponseDto updatedProduct = productService.updateProductStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(updatedProduct));
    }

    // Product Search & Filtering
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponseDto<ProductResponseDto>>> searchProducts(
            @Valid @ModelAttribute ProductSearchRequestDto searchRequest) {
        
        PageResponseDto<ProductResponseDto> searchResults = productService.searchProducts(searchRequest);
        return ResponseEntity.ok(ApiResponse.success(searchResults));
    }

    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<ApiResponse<PageResponseDto<ProductResponseDto>>> getProductsByCategory(
            @PathVariable UUID categoryId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String locale) {
        
        PageResponseDto<ProductResponseDto> products = productService.getProductsByCategory(categoryId, page, size, locale);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/by-shop/{shopId}")
    public ResponseEntity<ApiResponse<PageResponseDto<ProductResponseDto>>> getProductsByShop(
            @PathVariable UUID shopId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String locale) {
        
        PageResponseDto<ProductResponseDto> products = productService.getProductsByShop(shopId, page, size, locale);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    // Product Attributes
    @GetMapping("/{id}/attributes")
    public ResponseEntity<ApiResponse<List<ProductAttributeDto>>> getProductAttributes(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        List<ProductAttributeDto> attributes = productService.getProductAttributes(id, locale);
        return ResponseEntity.ok(ApiResponse.success(attributes));
    }

    @PutMapping("/{id}/attributes")
    public ResponseEntity<ApiResponse<List<ProductAttributeDto>>> updateProductAttributes(
            @PathVariable UUID id,
            @Valid @RequestBody List<ProductAttributeValueDto> attributes) {
        
        List<ProductAttributeDto> updatedAttributes = productService.updateProductAttributes(id, attributes);
        return ResponseEntity.ok(ApiResponse.success(updatedAttributes));
    }

    @PostMapping("/{id}/attributes/{attributeId}")
    public ResponseEntity<ApiResponse<ProductAttributeDto>> setProductAttributeValue(
            @PathVariable UUID id,
            @PathVariable UUID attributeId,
            @RequestBody Object value) {
        
        ProductAttributeDto attribute = productService.setProductAttributeValue(id, attributeId, value);
        return ResponseEntity.ok(ApiResponse.success(attribute));
    }

    @DeleteMapping("/{id}/attributes/{attributeId}")
    public ResponseEntity<ApiResponse<Void>> removeProductAttributeValue(
            @PathVariable UUID id,
            @PathVariable UUID attributeId) {
        
        productService.removeProductAttributeValue(id, attributeId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
