package product.asia.shop.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class AttributeGroupResponseDto {
    private UUID id;
    private String name;
    private Integer displayOrder;
    private List<AttributeDto> attributes;
    private Long attributeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<String, Map<String, String>> translations;

    // Constructors
    public AttributeGroupResponseDto() {}

    public AttributeGroupResponseDto(UUID id, String name, Integer displayOrder) {
        this.id = id;
        this.name = name;
        this.displayOrder = displayOrder;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public List<AttributeDto> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<AttributeDto> attributes) {
        this.attributes = attributes;
    }

    public Long getAttributeCount() {
        return attributeCount;
    }

    public void setAttributeCount(Long attributeCount) {
        this.attributeCount = attributeCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Map<String, Map<String, String>> getTranslations() {
        return translations;
    }

    public void setTranslations(Map<String, Map<String, String>> translations) {
        this.translations = translations;
    }
}
