package product.asia.shop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import java.util.Map;
import java.util.UUID;

public class ProductSearchRequestDto {
    
    private String query; // Full-text search
    private UUID shopId;
    private UUID categoryId;
    private String status;
    private Map<UUID, Object> attributeFilters; // attributeId -> value
    
    private String sortBy = "createdAt";
    private String sortDirection = "DESC";
    
    @Min(value = 0, message = "Page number must be non-negative")
    private Integer page = 0;
    
    @Min(value = 1, message = "Page size must be at least 1")
    @Max(value = 100, message = "Page size must not exceed 100")
    private Integer size = 20;
    
    private String locale = "en"; // For translations

    // Constructors
    public ProductSearchRequestDto() {}

    // Getters and Setters
    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<UUID, Object> getAttributeFilters() {
        return attributeFilters;
    }

    public void setAttributeFilters(Map<UUID, Object> attributeFilters) {
        this.attributeFilters = attributeFilters;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public String getSortDirection() {
        return sortDirection;
    }

    public void setSortDirection(String sortDirection) {
        this.sortDirection = sortDirection;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }
}
