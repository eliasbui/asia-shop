package product.asia.shop.service;

import product.asia.shop.dto.*;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    
    // Category CRUD
    List<CategoryResponseDto> getAllCategories(String locale);
    CategoryResponseDto getCategoryById(UUID id, String locale);
    CategoryResponseDto createCategory(CategoryRequestDto request);
    CategoryResponseDto updateCategory(UUID id, CategoryRequestDto request);
    void deleteCategory(UUID id);
    
    // Category Hierarchy
    List<CategoryResponseDto> getCategoryChildren(UUID id, String locale);
    List<CategoryResponseDto> getCategoryAncestors(UUID id, String locale);
    CategoryResponseDto moveCategory(UUID id, UUID newParentId);
    
    // Category Attributes
    List<AttributeDto> getCategoryAttributes(UUID categoryId, String locale);
    void addAttributeToCategory(UUID categoryId, UUID attributeId, Integer displayOrder);
    void removeAttributeFromCategory(UUID categoryId, UUID attributeId);
}
