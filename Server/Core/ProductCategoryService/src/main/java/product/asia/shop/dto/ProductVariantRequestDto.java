package product.asia.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.Map;

public class ProductVariantRequestDto {
    
    @NotBlank(message = "Variant SKU is required")
    @Size(max = 50, message = "Variant SKU must not exceed 50 characters")
    private String variantSku;
    
    @NotBlank(message = "Variant name is required")
    @Size(max = 100, message = "Variant name must not exceed 100 characters")
    private String variantName;
    
    private BigDecimal price;
    private BigDecimal comparePrice;
    private BigDecimal weight;
    
    @Size(max = 100, message = "Barcode must not exceed 100 characters")
    private String barcode;
    
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;
    
    private Integer position = 0;
    private String status = "ACTIVE";
    private Map<String, Map<String, String>> translations;

    // Constructors
    public ProductVariantRequestDto() {}

    public ProductVariantRequestDto(String variantSku, String variantName) {
        this.variantSku = variantSku;
        this.variantName = variantName;
    }

    // Getters and Setters
    public String getVariantSku() {
        return variantSku;
    }

    public void setVariantSku(String variantSku) {
        this.variantSku = variantSku;
    }

    public String getVariantName() {
        return variantName;
    }

    public void setVariantName(String variantName) {
        this.variantName = variantName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getComparePrice() {
        return comparePrice;
    }

    public void setComparePrice(BigDecimal comparePrice) {
        this.comparePrice = comparePrice;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, Map<String, String>> getTranslations() {
        return translations;
    }

    public void setTranslations(Map<String, Map<String, String>> translations) {
        this.translations = translations;
    }
}
