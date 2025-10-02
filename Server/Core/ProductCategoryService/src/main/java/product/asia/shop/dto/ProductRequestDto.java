package product.asia.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class ProductRequestDto {
    
    @NotBlank(message = "SKU is required")
    @Size(max = 30, message = "SKU must not exceed 30 characters")
    private String sku;
    
    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String name;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    private String status = "DRAFT";
    
    @NotNull(message = "Shop ID is required")
    private UUID shopId;
    
    @NotNull(message = "Category ID is required")
    private UUID categoryId;
    
    private List<ProductAttributeValueDto> attributes;
    
    private Map<String, Map<String, String>> translations;

    // Constructors
    public ProductRequestDto() {}

    public ProductRequestDto(String sku, String name, String description, UUID shopId, UUID categoryId) {
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.shopId = shopId;
        this.categoryId = categoryId;
    }

    // Getters and Setters
    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UUID getShopId() {
        return shopId;
    }

    public void setShopId(UUID shopId) {
        this.shopId = shopId;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    public List<ProductAttributeValueDto> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<ProductAttributeValueDto> attributes) {
        this.attributes = attributes;
    }

    public Map<String, Map<String, String>> getTranslations() {
        return translations;
    }

    public void setTranslations(Map<String, Map<String, String>> translations) {
        this.translations = translations;
    }
}
