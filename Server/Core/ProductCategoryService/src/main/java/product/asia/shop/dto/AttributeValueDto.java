package product.asia.shop.dto;

import java.util.Map;
import java.util.UUID;

public class AttributeValueDto {
    private UUID id;
    private String value;
    private Integer displayOrder;
    private Map<String, String> translations;

    // Constructors
    public AttributeValueDto() {}

    public AttributeValueDto(UUID id, String value, Integer displayOrder) {
        this.id = id;
        this.value = value;
        this.displayOrder = displayOrder;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Map<String, String> getTranslations() {
        return translations;
    }

    public void setTranslations(Map<String, String> translations) {
        this.translations = translations;
    }
}
