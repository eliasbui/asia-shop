package product.asia.shop.entities;

import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "CATEGORIES") //parent/child (tree)
public class CategoriesEntity extends BaseEntity {
    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "DESCRIPTION", nullable = false, length = 500)
    private String description;

    @Column(name = "PARENT_ID", nullable = false, length = 36, insertable = false, updatable = false)
    private UUID parentId;

    //Getter and Setter
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

    public UUID getParentId() {
        return parentId;
    }

    public void setParentId(UUID parentId) {
        this.parentId = parentId;
    }

    //toString
    @Override
    public String toString() {
        return "CategoriesEntity{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", parentId=" + parentId +
                '}';
    }

    //equals
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CategoriesEntity that = (CategoriesEntity) o;
        return Objects.equals(super.getId(), that.getId()) && Objects.equals(name, that.name) && Objects.equals(description, that.description) && Objects.equals(parentId, that.parentId);
    }

    //hashCode
    @Override
    public int hashCode() {
        return Objects.hash(super.getId(), name, description, parentId);
    }

}
