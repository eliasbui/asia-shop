package product.asia.shop.entities;

import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ATTRIBUTE_ALLOWED_VALUES") // --Attribute value options (select/multiselect)
public class AttributeAllowedValuesEntity extends BaseEntity {

    @Column(name = "ATTRIBUTE_ID", nullable = false, length = 36)
    private UUID attributeId;

    @Column(name = "VALUE", nullable = false, length = 100)
    private String value;

    // display order
    @Column(name = "DISPLAY_ORDER", nullable = false, length = 100)
    private Integer displayOrder;

    // refence table ATTRIBUTES
    @ManyToOne
    @JoinColumn(name = "ATTRIBUTE_ID", nullable = false)
    private AttributesEntity attribute;

    // Getter and Setter
    public UUID getAttributeId() {
        return attributeId;
    }

    public void setAttributeId(UUID attributeId) {
        this.attributeId = attributeId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
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
        return "AttributeAllowedValuesEntity{" +
                "attributeId=" + attributeId +
                ", value='" + value + '\'' +
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
        AttributeAllowedValuesEntity that = (AttributeAllowedValuesEntity) o;
        return Objects.equals(super.getId(), that.getId()) && Objects.equals(attributeId, that.attributeId)
                && Objects.equals(value, that.value) && Objects.equals(displayOrder, that.displayOrder);
    }
}
