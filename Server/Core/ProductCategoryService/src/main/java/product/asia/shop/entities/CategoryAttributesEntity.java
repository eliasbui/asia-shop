package product.asia.shop.entities;

import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "CATEGORY_ATTRIBUTES")
public class CategoryAttributesEntity extends BaseEntity {

    // Remove these duplicate column mappings
    // @Column(name = "CATEGORY_ID", nullable = false, length = 36)
    // private UUID categoryId;

    // @Column(name = "ATTRIBUTE_ID", nullable = false, length = 36)
    // private UUID attributeId;

    // display order
    @Column(name = "DISPLAY_ORDER", nullable = false, length = 100)
    private Integer displayOrder;

    // reference table CATEGORIES
    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private CategoriesEntity category;

    // reference table ATTRIBUTES
    @ManyToOne
    @JoinColumn(name = "ATTRIBUTE_ID", nullable = false)
    private AttributesEntity attribute;

    // Getter and Setter methods for the relationship entities
    public CategoriesEntity getCategory() {
        return category;
    }

    public void setCategory(CategoriesEntity category) {
        this.category = category;
    }

    public AttributesEntity getAttribute() {
        return attribute;
    }

    public void setAttribute(AttributesEntity attribute) {
        this.attribute = attribute;
    }

    // Convenience methods to get IDs from relationships
    public UUID getCategoryId() {
        return category != null ? category.getId() : null;
    }

    public UUID getAttributeId() {
        return attribute != null ? attribute.getId() : null;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    @Override
    public String toString() {
        return "CategoryAttributesEntity{" +
                "categoryId=" + getCategoryId() +
                ", attributeId=" + getAttributeId() +
                ", displayOrder=" + displayOrder +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        CategoryAttributesEntity that = (CategoryAttributesEntity) o;
        return Objects.equals(super.getId(), that.getId()) &&
                Objects.equals(getCategoryId(), that.getCategoryId()) &&
                Objects.equals(getAttributeId(), that.getAttributeId()) &&
                Objects.equals(displayOrder, that.displayOrder);
    }
}
