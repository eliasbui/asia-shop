package product.asia.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Map;

public class AttributeGroupRequestDto {
    
    @NotBlank(message = "Attribute group name is required")
    @Size(max = 100, message = "Attribute group name must not exceed 100 characters")
    private String name;
    
    private Integer displayOrder;
    private Map<String, Map<String, String>> translations;

    // Constructors
    public AttributeGroupRequestDto() {}

    public AttributeGroupRequestDto(String name, Integer displayOrder) {
        this.name = name;
        this.displayOrder = displayOrder;
    }

    // Getters and Setters
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

    public Map<String, Map<String, String>> getTranslations() {
        return translations;
    }

    public void setTranslations(Map<String, Map<String, String>> translations) {
        this.translations = translations;
    }
}
