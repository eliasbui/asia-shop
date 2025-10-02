package product.asia.shop.dto;

import java.util.List;
import java.util.UUID;

public class MissingTranslationDto {
    private UUID entityId;
    private String entityType;
    private String originalName; // Original entity name for reference
    private List<String> missingFields;
    private String targetLocale;

    // Constructors
    public MissingTranslationDto() {}

    public MissingTranslationDto(UUID entityId, String entityType, String originalName, 
                               List<String> missingFields, String targetLocale) {
        this.entityId = entityId;
        this.entityType = entityType;
        this.originalName = originalName;
        this.missingFields = missingFields;
        this.targetLocale = targetLocale;
    }

    // Getters and Setters
    public UUID getEntityId() {
        return entityId;
    }

    public void setEntityId(UUID entityId) {
        this.entityId = entityId;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public List<String> getMissingFields() {
        return missingFields;
    }

    public void setMissingFields(List<String> missingFields) {
        this.missingFields = missingFields;
    }

    public String getTargetLocale() {
        return targetLocale;
    }

    public void setTargetLocale(String targetLocale) {
        this.targetLocale = targetLocale;
    }
}
