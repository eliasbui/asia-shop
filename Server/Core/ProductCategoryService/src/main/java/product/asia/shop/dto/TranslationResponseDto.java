package product.asia.shop.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class TranslationResponseDto {
    private UUID id;
    private String entityType;
    private UUID entityId;
    private String locale;
    private String field;
    private String translation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public TranslationResponseDto() {}

    public TranslationResponseDto(UUID id, String entityType, UUID entityId, String locale, 
                                String field, String translation) {
        this.id = id;
        this.entityType = entityType;
        this.entityId = entityId;
        this.locale = locale;
        this.field = field;
        this.translation = translation;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
