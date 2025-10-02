package product.asia.shop.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class AttributeGroupReorderDto {
    
    @NotNull(message = "Attribute group ID is required")
    private UUID id;
    
    @NotNull(message = "Display order is required")
    private Integer displayOrder;

    // Constructors
    public AttributeGroupReorderDto() {}

    public AttributeGroupReorderDto(UUID id, Integer displayOrder) {
        this.id = id;
        this.displayOrder = displayOrder;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
