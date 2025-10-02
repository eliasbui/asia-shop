package product.asia.shop.dto;

import java.util.Map;

public class TranslationStatisticsDto {
    private Long totalTranslations;
    private Long totalEntities;
    private Integer totalLocales;
    private Map<String, Long> translationsByEntityType;
    private Map<String, Long> translationsByLocale;
    private Map<String, Double> completionByLocale;
    private Double overallCompletionPercentage;

    // Constructors
    public TranslationStatisticsDto() {}

    // Getters and Setters
    public Long getTotalTranslations() {
        return totalTranslations;
    }

    public void setTotalTranslations(Long totalTranslations) {
        this.totalTranslations = totalTranslations;
    }

    public Long getTotalEntities() {
        return totalEntities;
    }

    public void setTotalEntities(Long totalEntities) {
        this.totalEntities = totalEntities;
    }

    public Integer getTotalLocales() {
        return totalLocales;
    }

    public void setTotalLocales(Integer totalLocales) {
        this.totalLocales = totalLocales;
    }

    public Map<String, Long> getTranslationsByEntityType() {
        return translationsByEntityType;
    }

    public void setTranslationsByEntityType(Map<String, Long> translationsByEntityType) {
        this.translationsByEntityType = translationsByEntityType;
    }

    public Map<String, Long> getTranslationsByLocale() {
        return translationsByLocale;
    }

    public void setTranslationsByLocale(Map<String, Long> translationsByLocale) {
        this.translationsByLocale = translationsByLocale;
    }

    public Map<String, Double> getCompletionByLocale() {
        return completionByLocale;
    }

    public void setCompletionByLocale(Map<String, Double> completionByLocale) {
        this.completionByLocale = completionByLocale;
    }

    public Double getOverallCompletionPercentage() {
        return overallCompletionPercentage;
    }

    public void setOverallCompletionPercentage(Double overallCompletionPercentage) {
        this.overallCompletionPercentage = overallCompletionPercentage;
    }
}
