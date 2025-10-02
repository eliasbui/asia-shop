package product.asia.shop.entities;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PRODUCT_VARIANTS")
public class ProductVariantsEntity extends BaseEntity {

    @Column(name = "PARENT_PRODUCT_ID", nullable = false, length = 36, insertable = false, updatable = false)
    private UUID parentProductId;

    @Column(name = "VARIANT_SKU", nullable = false, length = 50)
    private String variantSku;

    @Column(name = "VARIANT_NAME", nullable = false, length = 100)
    private String variantName; // e.g., "Red - Large", "32GB - Black"

    @Column(name = "PRICE", nullable = true, precision = 15, scale = 2)
    private BigDecimal price; // Override parent price if different

    @Column(name = "COMPARE_PRICE", nullable = true, precision = 15, scale = 2)
    private BigDecimal comparePrice;

    @Column(name = "WEIGHT", nullable = true, precision = 10, scale = 3)
    private BigDecimal weight;

    @Column(name = "BARCODE", nullable = true, length = 100)
    private String barcode;

    @Column(name = "IMAGE_URL", nullable = true, length = 500)
    private String imageUrl; // Primary variant image

    @Column(name = "POSITION", nullable = false)
    private Integer position = 0; // Display order

    @Column(name = "STATUS", nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, DISCONTINUED

    // Reference table PRODUCTS (parent product)
    @ManyToOne
    @JoinColumn(name = "PARENT_PRODUCT_ID", nullable = false)
    private ProductsEntity parentProduct;

    // Constructors
    public ProductVariantsEntity() {}

    public ProductVariantsEntity(UUID parentProductId, String variantSku, String variantName) {
        this.parentProductId = parentProductId;
        this.variantSku = variantSku;
        this.variantName = variantName;
    }

    // Getters and Setters
    public UUID getParentProductId() {
        return parentProductId;
    }

    public void setParentProductId(UUID parentProductId) {
        this.parentProductId = parentProductId;
    }

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

    public ProductsEntity getParentProduct() {
        return parentProduct;
    }

    public void setParentProduct(ProductsEntity parentProduct) {
        this.parentProduct = parentProduct;
    }

    // toString
    @Override
    public String toString() {
        return "ProductVariantsEntity{" +
                "parentProductId=" + parentProductId +
                ", variantSku='" + variantSku + '\'' +
                ", variantName='" + variantName + '\'' +
                ", price=" + price +
                ", comparePrice=" + comparePrice +
                ", weight=" + weight +
                ", barcode='" + barcode + '\'' +
                ", position=" + position +
                ", status='" + status + '\'' +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductVariantsEntity that = (ProductVariantsEntity) o;
        return Objects.equals(super.getId(), that.getId()) &&
                Objects.equals(parentProductId, that.parentProductId) &&
                Objects.equals(variantSku, that.variantSku);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(super.getId(), parentProductId, variantSku);
    }
}
