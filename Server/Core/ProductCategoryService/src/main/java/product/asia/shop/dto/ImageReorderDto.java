package product.asia.shop.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class ImageReorderDto {
    
    @NotNull(message = "Image ID is required")
    private UUID id;
    
    @NotNull(message = "Display order is required")
    private Integer displayOrder;

    // Constructors
    public ImageReorderDto() {}

    public ImageReorderDto(UUID id, Integer displayOrder) {
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
