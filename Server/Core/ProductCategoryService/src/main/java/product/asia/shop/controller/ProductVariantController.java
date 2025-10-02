package product.asia.shop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import product.asia.shop.dto.*;
import product.asia.shop.service.ProductVariantService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products/{productId}/variants")
@CrossOrigin(origins = "*")
public class ProductVariantController {

    private final ProductVariantService variantService;

    @Autowired
    public ProductVariantController(ProductVariantService variantService) {
        this.variantService = variantService;
    }

    // Product Variant CRUD
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductVariantResponseDto>>> getProductVariants(
            @PathVariable UUID productId,
            @RequestParam(required = false) String locale) {
        
        List<ProductVariantResponseDto> variants = variantService.getProductVariants(productId, locale);
        return ResponseEntity.ok(ApiResponse.success(variants));
    }

    @GetMapping("/{variantId}")
    public ResponseEntity<ApiResponse<ProductVariantResponseDto>> getProductVariant(
            @PathVariable UUID productId,
            @PathVariable UUID variantId,
            @RequestParam(required = false) String locale) {
        
        ProductVariantResponseDto variant = variantService.getProductVariant(productId, variantId, locale);
        return ResponseEntity.ok(ApiResponse.success(variant));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductVariantResponseDto>> createProductVariant(
            @PathVariable UUID productId,
            @Valid @RequestBody ProductVariantRequestDto request) {
        
        ProductVariantResponseDto createdVariant = variantService.createProductVariant(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdVariant));
    }

    @PutMapping("/{variantId}")
    public ResponseEntity<ApiResponse<ProductVariantResponseDto>> updateProductVariant(
            @PathVariable UUID productId,
            @PathVariable UUID variantId,
            @Valid @RequestBody ProductVariantRequestDto request) {
        
        ProductVariantResponseDto updatedVariant = variantService.updateProductVariant(productId, variantId, request);
        return ResponseEntity.ok(ApiResponse.success(updatedVariant));
    }

    @DeleteMapping("/{variantId}")
    public ResponseEntity<ApiResponse<Void>> deleteProductVariant(
            @PathVariable UUID productId,
            @PathVariable UUID variantId) {
        
        variantService.deleteProductVariant(productId, variantId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Bulk Operations
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<ProductVariantResponseDto>>> createBulkVariants(
            @PathVariable UUID productId,
            @Valid @RequestBody List<ProductVariantRequestDto> requests) {
        
        List<ProductVariantResponseDto> createdVariants = variantService.createBulkVariants(productId, requests);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdVariants));
    }

    // Variant Reordering
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<List<ProductVariantResponseDto>>> reorderVariants(
            @PathVariable UUID productId,
            @RequestBody List<VariantReorderDto> reorderData) {
        
        List<ProductVariantResponseDto> reorderedVariants = variantService.reorderVariants(productId, reorderData);
        return ResponseEntity.ok(ApiResponse.success(reorderedVariants));
    }
}
