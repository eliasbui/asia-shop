package product.asia.shop.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class CategoryResponseDto {
    private UUID id;
    private String name;
    private String description;
    private UUID parentId;
    private String parentName;
    private List<CategoryResponseDto> children;
    private List<AttributeDto> applicableAttributes;
    private Map<String, Map<String, String>> translations;

    // Constructors
    public CategoryResponseDto() {}

    public CategoryResponseDto(UUID id, String name, String description, UUID parentId, String parentName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.parentId = parentId;
        this.parentName = parentName;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getParentId() {
        return parentId;
    }

    public void setParentId(UUID parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public List<CategoryResponseDto> getChildren() {
        return children;
    }

    public void setChildren(List<CategoryResponseDto> children) {
        this.children = children;
    }

    public List<AttributeDto> getApplicableAttributes() {
        return applicableAttributes;
    }

    public void setApplicableAttributes(List<AttributeDto> applicableAttributes) {
        this.applicableAttributes = applicableAttributes;
    }

    public Map<String, Map<String, String>> getTranslations() {
        return translations;
    }

    public void setTranslations(Map<String, Map<String, String>> translations) {
        this.translations = translations;
    }
}
