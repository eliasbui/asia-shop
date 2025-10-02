package product.asia.shop.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class ProductAttributeValueDto {
    
    @NotNull(message = "Attribute ID is required")
    private UUID attributeId;
    
    private Object value;

    // Constructors
    public ProductAttributeValueDto() {}

    public ProductAttributeValueDto(UUID attributeId, Object value) {
        this.attributeId = attributeId;
        this.value = value;
    }

    // Getters and Setters
    public UUID getAttributeId() {
        return attributeId;
    }

    public void setAttributeId(UUID attributeId) {
        this.attributeId = attributeId;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
