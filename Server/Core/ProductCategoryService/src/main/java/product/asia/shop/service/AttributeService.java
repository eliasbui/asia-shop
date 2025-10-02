package product.asia.shop.service;

import product.asia.shop.dto.*;

import java.util.List;
import java.util.UUID;

public interface AttributeService {
    
    // Attribute CRUD
    PageResponseDto<AttributeDto> getAllAttributes(Integer page, Integer size, String groupId, String dataType, Boolean isFilterable, String locale);
    AttributeDto getAttributeById(UUID id, String locale);
    AttributeDto createAttribute(AttributeRequestDto request);
    AttributeDto updateAttribute(UUID id, AttributeRequestDto request);
    void deleteAttribute(UUID id);
    
    // Attribute Values (for select/multiselect)
    List<AttributeValueDto> getAttributeValues(UUID attributeId, String locale);
    AttributeValueDto addAttributeValue(UUID attributeId, AttributeValueRequestDto request);
    AttributeValueDto updateAttributeValue(UUID attributeId, UUID valueId, AttributeValueRequestDto request);
    void deleteAttributeValue(UUID attributeId, UUID valueId);
}
