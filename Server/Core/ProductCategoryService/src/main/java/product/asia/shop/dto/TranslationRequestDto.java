package product.asia.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class TranslationRequestDto {
    
    @NotBlank(message = "Entity type is required")
    @Size(max = 50, message = "Entity type must not exceed 50 characters")
    private String entityType;
    
    @NotNull(message = "Entity ID is required")
    private UUID entityId;
    
    @NotBlank(message = "Locale is required")
    @Size(max = 10, message = "Locale must not exceed 10 characters")
    private String locale;
    
    @NotBlank(message = "Field is required")
    @Size(max = 50, message = "Field must not exceed 50 characters")
    private String field;
    
    @NotBlank(message = "Translation is required")
    @Size(max = 255, message = "Translation must not exceed 255 characters")
    private String translation;

    // Constructors
    public TranslationRequestDto() {}

    public TranslationRequestDto(String entityType, UUID entityId, String locale, String field, String translation) {
        this.entityType = entityType;
        this.entityId = entityId;
        this.locale = locale;
        this.field = field;
        this.translation = translation;
    }

    // Getters and Setters
    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public UUID getEntityId() {
        return entityId;
    }

    public void setEntityId(UUID entityId) {
        this.entityId = entityId;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getTranslation() {
        return translation;
    }

    public void setTranslation(String translation) {
        this.translation = translation;
    }
}
