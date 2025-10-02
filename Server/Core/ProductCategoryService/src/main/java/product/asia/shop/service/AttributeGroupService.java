package product.asia.shop.service;

import product.asia.shop.dto.*;

import java.util.List;
import java.util.UUID;

public interface AttributeGroupService {
    
    // Attribute Group CRUD
    List<AttributeGroupResponseDto> getAllAttributeGroups(String locale);
    AttributeGroupResponseDto getAttributeGroupById(UUID id, String locale);
    AttributeGroupResponseDto createAttributeGroup(AttributeGroupRequestDto request);
    AttributeGroupResponseDto updateAttributeGroup(UUID id, AttributeGroupRequestDto request);
    void deleteAttributeGroup(UUID id);
    
    // Group Attributes
    List<AttributeDto> getAttributesByGroup(UUID groupId, String locale);
    
    // Group Management
    List<AttributeGroupResponseDto> reorderAttributeGroups(List<AttributeGroupReorderDto> reorderData);
}
