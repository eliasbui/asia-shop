package product.asia.shop.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class VariantReorderDto {
    
    @NotNull(message = "Variant ID is required")
    private UUID id;
    
    @NotNull(message = "Position is required")
    private Integer position;

    // Constructors
    public VariantReorderDto() {}

    public VariantReorderDto(UUID id, Integer position) {
        this.id = id;
        this.position = position;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }
}
