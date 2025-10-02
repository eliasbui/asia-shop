package product.asia.shop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import product.asia.shop.dto.*;
import product.asia.shop.service.ProductImageService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products/{productId}/images")
@CrossOrigin(origins = "*")
public class ProductImageController {

    private final ProductImageService imageService;

    @Autowired
    public ProductImageController(ProductImageService imageService) {
        this.imageService = imageService;
    }

    // Product Image CRUD
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductImageResponseDto>>> getProductImages(
            @PathVariable UUID productId,
            @RequestParam(required = false) String imageType) {
        
        List<ProductImageResponseDto> images = imageService.getProductImages(productId, imageType);
        return ResponseEntity.ok(ApiResponse.success(images));
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<ApiResponse<ProductImageResponseDto>> getProductImage(
            @PathVariable UUID productId,
            @PathVariable UUID imageId) {
        
        ProductImageResponseDto image = imageService.getProductImage(productId, imageId);
        return ResponseEntity.ok(ApiResponse.success(image));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductImageResponseDto>> createProductImage(
            @PathVariable UUID productId,
            @Valid @RequestBody ProductImageRequestDto request) {
        
        ProductImageResponseDto createdImage = imageService.createProductImage(productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdImage));
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ProductImageResponseDto>> uploadProductImage(
            @PathVariable UUID productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String imageType,
            @RequestParam(required = false) String altText,
            @RequestParam(required = false) Integer displayOrder) {
        
        ProductImageResponseDto uploadedImage = imageService.uploadProductImage(
            productId, file, imageType, altText, displayOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(uploadedImage));
    }

    @PutMapping("/{imageId}")
    public ResponseEntity<ApiResponse<ProductImageResponseDto>> updateProductImage(
            @PathVariable UUID productId,
            @PathVariable UUID imageId,
            @Valid @RequestBody ProductImageRequestDto request) {
        
        ProductImageResponseDto updatedImage = imageService.updateProductImage(productId, imageId, request);
        return ResponseEntity.ok(ApiResponse.success(updatedImage));
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteProductImage(
            @PathVariable UUID productId,
            @PathVariable UUID imageId) {
        
        imageService.deleteProductImage(productId, imageId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Image Management
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<List<ProductImageResponseDto>>> reorderImages(
            @PathVariable UUID productId,
            @RequestBody List<ImageReorderDto> reorderData) {
        
        List<ProductImageResponseDto> reorderedImages = imageService.reorderImages(productId, reorderData);
        return ResponseEntity.ok(ApiResponse.success(reorderedImages));
    }

    @PutMapping("/{imageId}/set-main")
    public ResponseEntity<ApiResponse<ProductImageResponseDto>> setMainImage(
            @PathVariable UUID productId,
            @PathVariable UUID imageId) {
        
        ProductImageResponseDto mainImage = imageService.setMainImage(productId, imageId);
        return ResponseEntity.ok(ApiResponse.success(mainImage));
    }

    // Bulk Operations
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<ProductImageResponseDto>>> createBulkImages(
            @PathVariable UUID productId,
            @Valid @RequestBody List<ProductImageRequestDto> requests) {
        
        List<ProductImageResponseDto> createdImages = imageService.createBulkImages(productId, requests);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdImages));
    }
}
