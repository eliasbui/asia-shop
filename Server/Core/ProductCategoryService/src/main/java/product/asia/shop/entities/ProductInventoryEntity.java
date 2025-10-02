package product.asia.shop.entities;

import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PRODUCT_INVENTORY")
public class ProductInventoryEntity extends BaseEntity {

    @Column(name = "PRODUCT_ID", nullable = false, length = 36, insertable = false, updatable = false)
    private UUID productId;

    @Column(name = "WAREHOUSE_ID", nullable = true, length = 36)
    private UUID warehouseId; // For multi-warehouse support

    @Column(name = "QUANTITY_AVAILABLE", nullable = false)
    private Integer quantityAvailable = 0;

    @Column(name = "QUANTITY_RESERVED", nullable = false)
    private Integer quantityReserved = 0; // For pending orders

    @Column(name = "QUANTITY_ON_ORDER", nullable = false)
    private Integer quantityOnOrder = 0; // From suppliers

    @Column(name = "REORDER_POINT", nullable = true)
    private Integer reorderPoint; // When to reorder

    @Column(name = "MAX_STOCK_LEVEL", nullable = true)
    private Integer maxStockLevel;

    @Column(name = "MIN_STOCK_LEVEL", nullable = true)
    private Integer minStockLevel;

    @Column(name = "TRACK_INVENTORY", nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean trackInventory = true;

    @Column(name = "ALLOW_BACKORDER", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean allowBackorder = false;

    @Column(name = "LOCATION", nullable = true, length = 100)
    private String location; // Warehouse location/bin

    @Column(name = "NOTES", nullable = true, length = 500)
    private String notes;

    // Reference table PRODUCTS
    @ManyToOne
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private ProductsEntity product;

    // Constructors
    public ProductInventoryEntity() {}

    public ProductInventoryEntity(UUID productId, Integer quantityAvailable) {
        this.productId = productId;
        this.quantityAvailable = quantityAvailable;
    }

    // Calculated fields
    public Integer getQuantityOnHand() {
        return quantityAvailable - quantityReserved;
    }

    public Boolean isInStock() {
        return getQuantityOnHand() > 0;
    }

    public Boolean isLowStock() {
        return minStockLevel != null && getQuantityOnHand() <= minStockLevel;
    }

    public Boolean needsReorder() {
        return reorderPoint != null && getQuantityOnHand() <= reorderPoint;
    }

    // Getters and Setters
    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public UUID getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(UUID warehouseId) {
        this.warehouseId = warehouseId;
    }

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public Integer getQuantityReserved() {
        return quantityReserved;
    }

    public void setQuantityReserved(Integer quantityReserved) {
        this.quantityReserved = quantityReserved;
    }

    public Integer getQuantityOnOrder() {
        return quantityOnOrder;
    }

    public void setQuantityOnOrder(Integer quantityOnOrder) {
        this.quantityOnOrder = quantityOnOrder;
    }

    public Integer getReorderPoint() {
        return reorderPoint;
    }

    public void setReorderPoint(Integer reorderPoint) {
        this.reorderPoint = reorderPoint;
    }

    public Integer getMaxStockLevel() {
        return maxStockLevel;
    }

    public void setMaxStockLevel(Integer maxStockLevel) {
        this.maxStockLevel = maxStockLevel;
    }

    public Integer getMinStockLevel() {
        return minStockLevel;
    }

    public void setMinStockLevel(Integer minStockLevel) {
        this.minStockLevel = minStockLevel;
    }

    public Boolean getTrackInventory() {
        return trackInventory;
    }

    public void setTrackInventory(Boolean trackInventory) {
        this.trackInventory = trackInventory;
    }

    public Boolean getAllowBackorder() {
        return allowBackorder;
    }

    public void setAllowBackorder(Boolean allowBackorder) {
        this.allowBackorder = allowBackorder;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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
        return "ProductInventoryEntity{" +
                "productId=" + productId +
                ", warehouseId=" + warehouseId +
                ", quantityAvailable=" + quantityAvailable +
                ", quantityReserved=" + quantityReserved +
                ", quantityOnOrder=" + quantityOnOrder +
                ", reorderPoint=" + reorderPoint +
                ", trackInventory=" + trackInventory +
                ", allowBackorder=" + allowBackorder +
                ", location='" + location + '\'' +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductInventoryEntity that = (ProductInventoryEntity) o;
        return Objects.equals(super.getId(), that.getId()) &&
                Objects.equals(productId, that.productId) &&
                Objects.equals(warehouseId, that.warehouseId);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(super.getId(), productId, warehouseId);
    }
}
