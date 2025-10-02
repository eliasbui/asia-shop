package product.asia.shop.dto;

public class LocaleInfoDto {
    private String locale;
    private String displayName;
    private Long translationCount;
    private Double completionPercentage;

    // Constructors
    public LocaleInfoDto() {}

    public LocaleInfoDto(String locale, String displayName, Long translationCount) {
        this.locale = locale;
        this.displayName = displayName;
        this.translationCount = translationCount;
    }

    // Getters and Setters
    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Long getTranslationCount() {
        return translationCount;
    }

    public void setTranslationCount(Long translationCount) {
        this.translationCount = translationCount;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}
