package product.asia.shop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import product.asia.shop.dto.*;
import product.asia.shop.service.AttributeGroupService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/attribute-groups")
@CrossOrigin(origins = "*")
public class AttributeGroupController {

    private final AttributeGroupService attributeGroupService;

    @Autowired
    public AttributeGroupController(AttributeGroupService attributeGroupService) {
        this.attributeGroupService = attributeGroupService;
    }

    // Attribute Group CRUD
    @GetMapping
    public ResponseEntity<ApiResponse<List<AttributeGroupResponseDto>>> getAllAttributeGroups(
            @RequestParam(required = false) String locale) {
        
        List<AttributeGroupResponseDto> groups = attributeGroupService.getAllAttributeGroups(locale);
        return ResponseEntity.ok(ApiResponse.success(groups));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AttributeGroupResponseDto>> getAttributeGroupById(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        AttributeGroupResponseDto group = attributeGroupService.getAttributeGroupById(id, locale);
        return ResponseEntity.ok(ApiResponse.success(group));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AttributeGroupResponseDto>> createAttributeGroup(
            @Valid @RequestBody AttributeGroupRequestDto request) {
        
        AttributeGroupResponseDto createdGroup = attributeGroupService.createAttributeGroup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdGroup));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AttributeGroupResponseDto>> updateAttributeGroup(
            @PathVariable UUID id,
            @Valid @RequestBody AttributeGroupRequestDto request) {
        
        AttributeGroupResponseDto updatedGroup = attributeGroupService.updateAttributeGroup(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedGroup));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAttributeGroup(@PathVariable UUID id) {
        attributeGroupService.deleteAttributeGroup(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Attribute Group Attributes
    @GetMapping("/{id}/attributes")
    public ResponseEntity<ApiResponse<List<AttributeDto>>> getAttributesByGroup(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        List<AttributeDto> attributes = attributeGroupService.getAttributesByGroup(id, locale);
        return ResponseEntity.ok(ApiResponse.success(attributes));
    }

    // Reorder Groups
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<List<AttributeGroupResponseDto>>> reorderAttributeGroups(
            @RequestBody List<AttributeGroupReorderDto> reorderData) {
        
        List<AttributeGroupResponseDto> reorderedGroups = attributeGroupService.reorderAttributeGroups(reorderData);
        return ResponseEntity.ok(ApiResponse.success(reorderedGroups));
    }
}
