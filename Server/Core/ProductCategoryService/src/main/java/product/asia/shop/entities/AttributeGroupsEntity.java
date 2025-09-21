package product.asia.shop.entities;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "ATTRIBUTE_GROUPS") //Attribute group for display sections
public class AttributeGroupsEntity extends BaseEntity {

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "DISPLAY_ORDER", nullable = false, length = 100)
    private Integer displayOrder;

    //Getter and Setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    //toString
    @Override
    public String toString() {
        return "AttributeGroupsEntity{" +
                "name='" + name + '\'' +
                ", displayOrder=" + displayOrder +
                '}';
    }

    //equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AttributeGroupsEntity that = (AttributeGroupsEntity) o;
        return Objects.equals(super.getId(), that.getId()) && Objects.equals(name, that.name) && Objects.equals(displayOrder, that.displayOrder);
    }

}
