package product.asia.shop.entities;

import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * ProductsEntity
 *
 * @author dthai16gg
 * @date 20/9/25
 *       <p>
 *       Joke: Why do programmers always mix up Halloween and Christmas?
 *       Because Oct 31 == Dec 25!
 */
@Entity
@Table(name = "PRODUCTS")
public class ProductsEntity extends BaseEntity {
    @Column(name = "SKU", nullable = false, length = 30)
    private String SKU;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "DESCRIPTION", nullable = false, length = 500)
    private String description;

    @Column(name = "STATUS", nullable = false, length = 30, columnDefinition = "ENUM('ACTIVE', 'INACTIVE', 'SOLD_OUT', 'DISCONTINUED', 'ARCHIVED', 'DRAFT', 'PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'RESTOCKING', 'RESTOCKED', 'DELETED') DEFAULT 'ACTIVE'")
    private String status; // ACTIVE, INACTIVE, SOLD_OUT, etc.

    // SHOP_ID
    @Column(name = "SHOP_ID", nullable = false, length = 36, insertable = false, updatable = false)
    private UUID shopId;

    // CATEGORY_ID
    @Column(name = "CATEGORY_ID", nullable = false, length = 36, insertable = false, updatable = false)
    private UUID categoryId;

    // refence table PRODUCT_CATEGORIES
    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private CategoriesEntity category;

    // refence table SHOPS
    @ManyToOne
    @JoinColumn(name = "SHOP_ID", nullable = false)
    private ShopsEntity shop;

    // getter and setter
    public String getSKU() {
        return SKU;
    }

    public void setSKU(String SKU) {
        this.SKU = SKU;
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

    // getter and setter
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

    // toString
    @Override
    public String toString() {
        return "ProductsEntity{" +
                "SKU='" + SKU + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", shopId=" + shopId +
                ", categoryId=" + categoryId +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ProductsEntity that = (ProductsEntity) o;
        return Objects.equals(super.getId(), that.getId()) && Objects.equals(SKU, that.SKU)
                && Objects.equals(name, that.name) && Objects.equals(description, that.description)
                && Objects.equals(status, that.status) && Objects.equals(shopId, that.shopId)
                && Objects.equals(categoryId, that.categoryId);
    }

}
