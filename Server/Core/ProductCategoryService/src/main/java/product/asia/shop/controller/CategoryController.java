package product.asia.shop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import product.asia.shop.dto.*;
import product.asia.shop.service.CategoryService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Category CRUD
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getAllCategories(
            @RequestParam(required = false) String locale) {
        
        List<CategoryResponseDto> categories = categoryService.getAllCategories(locale);
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> getCategoryById(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        CategoryResponseDto category = categoryService.getCategoryById(id, locale);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponseDto>> createCategory(@Valid @RequestBody CategoryRequestDto request) {
        CategoryResponseDto createdCategory = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdCategory));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryRequestDto request) {
        
        CategoryResponseDto updatedCategory = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedCategory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Category Hierarchy
    @GetMapping("/{id}/children")
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getCategoryChildren(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        List<CategoryResponseDto> children = categoryService.getCategoryChildren(id, locale);
        return ResponseEntity.ok(ApiResponse.success(children));
    }

    @GetMapping("/{id}/ancestors")
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getCategoryAncestors(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        List<CategoryResponseDto> ancestors = categoryService.getCategoryAncestors(id, locale);
        return ResponseEntity.ok(ApiResponse.success(ancestors));
    }

    @PostMapping("/{id}/move")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> moveCategory(
            @PathVariable UUID id,
            @RequestParam UUID newParentId) {
        
        CategoryResponseDto movedCategory = categoryService.moveCategory(id, newParentId);
        return ResponseEntity.ok(ApiResponse.success(movedCategory));
    }

    // Category Attributes
    @GetMapping("/{id}/attributes")
    public ResponseEntity<ApiResponse<List<AttributeDto>>> getCategoryAttributes(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        List<AttributeDto> attributes = categoryService.getCategoryAttributes(id, locale);
        return ResponseEntity.ok(ApiResponse.success(attributes));
    }

    @PostMapping("/{id}/attributes")
    public ResponseEntity<ApiResponse<Void>> addAttributeToCategory(
            @PathVariable UUID id,
            @RequestParam UUID attributeId,
            @RequestParam(required = false) Integer displayOrder) {
        
        categoryService.addAttributeToCategory(id, attributeId, displayOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null));
    }

    @DeleteMapping("/{id}/attributes/{attributeId}")
    public ResponseEntity<ApiResponse<Void>> removeAttributeFromCategory(
            @PathVariable UUID id,
            @PathVariable UUID attributeId) {
        
        categoryService.removeAttributeFromCategory(id, attributeId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
