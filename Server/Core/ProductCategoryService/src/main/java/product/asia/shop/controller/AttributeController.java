package product.asia.shop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import product.asia.shop.dto.*;
import product.asia.shop.service.AttributeService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/attributes")
@CrossOrigin(origins = "*")
public class AttributeController {

    private final AttributeService attributeService;

    @Autowired
    public AttributeController(AttributeService attributeService) {
        this.attributeService = attributeService;
    }

    // Attribute CRUD
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponseDto<AttributeDto>>> getAllAttributes(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String groupId,
            @RequestParam(required = false) String dataType,
            @RequestParam(required = false) Boolean isFilterable,
            @RequestParam(required = false) String locale) {
        
        PageResponseDto<AttributeDto> attributes = attributeService.getAllAttributes(
            page, size, groupId, dataType, isFilterable, locale);
        return ResponseEntity.ok(ApiResponse.success(attributes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AttributeDto>> getAttributeById(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        AttributeDto attribute = attributeService.getAttributeById(id, locale);
        return ResponseEntity.ok(ApiResponse.success(attribute));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AttributeDto>> createAttribute(@Valid @RequestBody AttributeRequestDto request) {
        AttributeDto createdAttribute = attributeService.createAttribute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdAttribute));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AttributeDto>> updateAttribute(
            @PathVariable UUID id,
            @Valid @RequestBody AttributeRequestDto request) {
        
        AttributeDto updatedAttribute = attributeService.updateAttribute(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedAttribute));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAttribute(@PathVariable UUID id) {
        attributeService.deleteAttribute(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Attribute Values (for select/multiselect)
    @GetMapping("/{id}/values")
    public ResponseEntity<ApiResponse<List<AttributeValueDto>>> getAttributeValues(
            @PathVariable UUID id,
            @RequestParam(required = false) String locale) {
        
        List<AttributeValueDto> values = attributeService.getAttributeValues(id, locale);
        return ResponseEntity.ok(ApiResponse.success(values));
    }

    @PostMapping("/{id}/values")
    public ResponseEntity<ApiResponse<AttributeValueDto>> addAttributeValue(
            @PathVariable UUID id,
            @Valid @RequestBody AttributeValueRequestDto request) {
        
        AttributeValueDto createdValue = attributeService.addAttributeValue(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(createdValue));
    }

    @PutMapping("/{id}/values/{valueId}")
    public ResponseEntity<ApiResponse<AttributeValueDto>> updateAttributeValue(
            @PathVariable UUID id,
            @PathVariable UUID valueId,
            @Valid @RequestBody AttributeValueRequestDto request) {
        
        AttributeValueDto updatedValue = attributeService.updateAttributeValue(id, valueId, request);
        return ResponseEntity.ok(ApiResponse.success(updatedValue));
    }

    @DeleteMapping("/{id}/values/{valueId}")
    public ResponseEntity<ApiResponse<Void>> deleteAttributeValue(
            @PathVariable UUID id,
            @PathVariable UUID valueId) {
        
        attributeService.deleteAttributeValue(id, valueId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
