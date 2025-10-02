package product.asia.shop.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PRODUCT_PRICING")
public class ProductPricingEntity extends BaseEntity {

    @Column(name = "PRODUCT_ID", nullable = false, length = 36, insertable = false, updatable = false)
    private UUID productId;

    @Column(name = "PRICE_TYPE", nullable = false, length = 50)
    private String priceType; // BASE, SALE, BULK, TIER, etc.

    @Column(name = "CURRENCY", nullable = false, length = 3)
    private String currency; // USD, EUR, VND, etc.

    @Column(name = "PRICE", nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "COMPARE_PRICE", nullable = true, precision = 15, scale = 2)
    private BigDecimal comparePrice; // Original price for sale items

    @Column(name = "COST_PRICE", nullable = true, precision = 15, scale = 2)
    private BigDecimal costPrice; // For profit calculation

    @Column(name = "MIN_QUANTITY", nullable = true)
    private Integer minQuantity; // For bulk/tier pricing

    @Column(name = "MAX_QUANTITY", nullable = true)
    private Integer maxQuantity; // For bulk/tier pricing

    @Column(name = "VALID_FROM", nullable = true)
    private LocalDateTime validFrom;

    @Column(name = "VALID_TO", nullable = true)
    private LocalDateTime validTo;

    @Column(name = "IS_ACTIVE", nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean isActive = true;

    // Reference table PRODUCTS
    @ManyToOne
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private ProductsEntity product;

    // Constructors
    public ProductPricingEntity() {}

    public ProductPricingEntity(UUID productId, String priceType, String currency, BigDecimal price) {
        this.productId = productId;
        this.priceType = priceType;
        this.currency = currency;
        this.price = price;
    }

    // Getters and Setters
    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public String getPriceType() {
        return priceType;
    }

    public void setPriceType(String priceType) {
        this.priceType = priceType;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
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

    public BigDecimal getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(BigDecimal costPrice) {
        this.costPrice = costPrice;
    }

    public Integer getMinQuantity() {
        return minQuantity;
    }

    public void setMinQuantity(Integer minQuantity) {
        this.minQuantity = minQuantity;
    }

    public Integer getMaxQuantity() {
        return maxQuantity;
    }

    public void setMaxQuantity(Integer maxQuantity) {
        this.maxQuantity = maxQuantity;
    }

    public LocalDateTime getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDateTime validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDateTime getValidTo() {
        return validTo;
    }

    public void setValidTo(LocalDateTime validTo) {
        this.validTo = validTo;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public ProductsEntity getProduct() {
        return product;
    }

    public void setProduct(ProductsEntity product) {
        this.product = product;
    }

    // toString
    @Override
    public String toString() {
        return "ProductPricingEntity{" +
                "productId=" + productId +
                ", priceType='" + priceType + '\'' +
                ", currency='" + currency + '\'' +
                ", price=" + price +
                ", comparePrice=" + comparePrice +
                ", costPrice=" + costPrice +
                ", minQuantity=" + minQuantity +
                ", maxQuantity=" + maxQuantity +
                ", validFrom=" + validFrom +
                ", validTo=" + validTo +
                ", isActive=" + isActive +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductPricingEntity that = (ProductPricingEntity) o;
        return Objects.equals(super.getId(), that.getId()) &&
                Objects.equals(productId, that.productId) &&
                Objects.equals(priceType, that.priceType) &&
                Objects.equals(currency, that.currency) &&
                Objects.equals(price, that.price);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(super.getId(), productId, priceType, currency, price);
    }
}
