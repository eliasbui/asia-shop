package product.asia.shop.dto;

import java.util.Map;

public class ShopStatisticsDto {
    private Long totalProducts;
    private Long activeProducts;
    private Long inactiveProducts;
    private Long draftProducts;
    private Long soldOutProducts;
    private Long totalCategories;
    private Long totalAttributes;
    private Map<String, Long> productsByStatus;
    private Map<String, Long> productsByCategory;

    // Constructors
    public ShopStatisticsDto() {}

    public ShopStatisticsDto(Long totalProducts, Long activeProducts, Long totalCategories) {
        this.totalProducts = totalProducts;
        this.activeProducts = activeProducts;
        this.totalCategories = totalCategories;
    }

    // Getters and Setters
    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getActiveProducts() {
        return activeProducts;
    }

    public void setActiveProducts(Long activeProducts) {
        this.activeProducts = activeProducts;
    }

    public Long getInactiveProducts() {
        return inactiveProducts;
    }

    public void setInactiveProducts(Long inactiveProducts) {
        this.inactiveProducts = inactiveProducts;
    }

    public Long getDraftProducts() {
        return draftProducts;
    }

    public void setDraftProducts(Long draftProducts) {
        this.draftProducts = draftProducts;
    }

    public Long getSoldOutProducts() {
        return soldOutProducts;
    }

    public void setSoldOutProducts(Long soldOutProducts) {
        this.soldOutProducts = soldOutProducts;
    }

    public Long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public Long getTotalAttributes() {
        return totalAttributes;
    }

    public void setTotalAttributes(Long totalAttributes) {
        this.totalAttributes = totalAttributes;
    }

    public Map<String, Long> getProductsByStatus() {
        return productsByStatus;
    }

    public void setProductsByStatus(Map<String, Long> productsByStatus) {
        this.productsByStatus = productsByStatus;
    }

    public Map<String, Long> getProductsByCategory() {
        return productsByCategory;
    }

    public void setProductsByCategory(Map<String, Long> productsByCategory) {
        this.productsByCategory = productsByCategory;
    }
}
