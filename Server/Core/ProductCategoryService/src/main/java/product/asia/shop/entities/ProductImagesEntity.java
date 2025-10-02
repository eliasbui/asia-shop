package product.asia.shop.entities;

import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PRODUCT_IMAGES")
public class ProductImagesEntity extends BaseEntity {

    @Column(name = "PRODUCT_ID", nullable = false, length = 36, insertable = false, updatable = false)
    private UUID productId;

    @Column(name = "IMAGE_URL", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "ALT_TEXT", nullable = true, length = 255)
    private String altText;

    @Column(name = "IMAGE_TYPE", nullable = false, length = 50)
    private String imageType; // MAIN, GALLERY, THUMBNAIL, etc.

    @Column(name = "DISPLAY_ORDER", nullable = false)
    private Integer displayOrder;

    @Column(name = "FILE_SIZE", nullable = true)
    private Long fileSize;

    @Column(name = "WIDTH", nullable = true)
    private Integer width;

    @Column(name = "HEIGHT", nullable = true)
    private Integer height;

    // Reference table PRODUCTS
    @ManyToOne
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private ProductsEntity product;

    // Constructors
    public ProductImagesEntity() {}

    public ProductImagesEntity(UUID productId, String imageUrl, String imageType, Integer displayOrder) {
        this.productId = productId;
        this.imageUrl = imageUrl;
        this.imageType = imageType;
        this.displayOrder = displayOrder;
    }

    // Getters and Setters
    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
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
        return "ProductImagesEntity{" +
                "productId=" + productId +
                ", imageUrl='" + imageUrl + '\'' +
                ", altText='" + altText + '\'' +
                ", imageType='" + imageType + '\'' +
                ", displayOrder=" + displayOrder +
                ", fileSize=" + fileSize +
                ", width=" + width +
                ", height=" + height +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductImagesEntity that = (ProductImagesEntity) o;
        return Objects.equals(super.getId(), that.getId()) &&
                Objects.equals(productId, that.productId) &&
                Objects.equals(imageUrl, that.imageUrl) &&
                Objects.equals(imageType, that.imageType) &&
                Objects.equals(displayOrder, that.displayOrder);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(super.getId(), productId, imageUrl, imageType, displayOrder);
    }
}
