package product.asia.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Map;

public class AttributeValueRequestDto {
    
    @NotBlank(message = "Value is required")
    @Size(max = 100, message = "Value must not exceed 100 characters")
    private String value;
    
    private Integer displayOrder;
    private Map<String, String> translations;

    // Constructors
    public AttributeValueRequestDto() {}

    public AttributeValueRequestDto(String value, Integer displayOrder) {
        this.value = value;
        this.displayOrder = displayOrder;
    }

    // Getters and Setters
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
