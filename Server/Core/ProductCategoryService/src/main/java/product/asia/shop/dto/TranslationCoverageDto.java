package product.asia.shop.dto;

import java.util.Map;

public class TranslationCoverageDto {
    private String entityType;
    private Long totalEntities;
    private Map<String, Long> entitiesWithTranslations; // locale -> count
    private Map<String, Double> coveragePercentage; // locale -> percentage
    private Map<String, Long> missingTranslations; // locale -> missing count

    // Constructors
    public TranslationCoverageDto() {}

    public TranslationCoverageDto(String entityType, Long totalEntities) {
        this.entityType = entityType;
        this.totalEntities = totalEntities;
    }

    // Getters and Setters
    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getTotalEntities() {
        return totalEntities;
    }

    public void setTotalEntities(Long totalEntities) {
        this.totalEntities = totalEntities;
    }

    public Map<String, Long> getEntitiesWithTranslations() {
        return entitiesWithTranslations;
    }

    public void setEntitiesWithTranslations(Map<String, Long> entitiesWithTranslations) {
        this.entitiesWithTranslations = entitiesWithTranslations;
    }

    public Map<String, Double> getCoveragePercentage() {
        return coveragePercentage;
    }

    public void setCoveragePercentage(Map<String, Double> coveragePercentage) {
        this.coveragePercentage = coveragePercentage;
    }

    public Map<String, Long> getMissingTranslations() {
        return missingTranslations;
    }

    public void setMissingTranslations(Map<String, Long> missingTranslations) {
        this.missingTranslations = missingTranslations;
    }
}
