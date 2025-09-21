package product.asia.shop.entities;

import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "CATEGORY_ATTRIBUTES") // -- Which attributes in which category (category-specific features)
public class CategoryAttributesEntity extends BaseEntity {

    @Column(name = "CATEGORY_ID", nullable = false, length = 36)
    private UUID categoryId;

    @Column(name = "ATTRIBUTE_ID", nullable = false, length = 36)
    private UUID attributeId;

    // display order
    @Column(name = "DISPLAY_ORDER", nullable = false, length = 100)
    private Integer displayOrder;

    // refence table CATEGORIES
    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private CategoriesEntity category;

    // refence table ATTRIBUTES
    @ManyToOne
    @JoinColumn(name = "ATTRIBUTE_ID", nullable = false)
    private AttributesEntity attribute;

    // Getter and Setter
    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    public UUID getAttributeId() {
        return attributeId;
    }

    public void setAttributeId(UUID attributeId) {
        this.attributeId = attributeId;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    // toString
    @Override
    public String toString() {
        return "CategoryAttributesEntity{" +
                "categoryId=" + categoryId +
                ", attributeId=" + attributeId +
                ", displayOrder=" + displayOrder +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        CategoryAttributesEntity that = (CategoryAttributesEntity) o;
        return Objects.equals(super.getId(), that.getId()) && Objects.equals(categoryId, that.categoryId)
                && Objects.equals(attributeId, that.attributeId) && Objects.equals(displayOrder, that.displayOrder);
    }
}
