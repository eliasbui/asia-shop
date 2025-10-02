package product.asia.shop.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class TranslationUpdateDto {
    
    @NotNull(message = "Translation ID is required")
    private UUID id;
    
    @Size(max = 255, message = "Translation must not exceed 255 characters")
    private String translation;

    // Constructors
    public TranslationUpdateDto() {}

    public TranslationUpdateDto(UUID id, String translation) {
        this.id = id;
        this.translation = translation;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTranslation() {
        return translation;
    }

    public void setTranslation(String translation) {
        this.translation = translation;
    }
}
