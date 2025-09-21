package product.asia.shop.entities;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PRODUCT_ATTRIBUTE_VALUES") // Values for each attribute of each product (supports all types)
public class ProductAttributeValuesEntity extends BaseEntity {

    @Column(name = "PRODUCT_ID", nullable = false, length = 36)
    private UUID productId;

    @Column(name = "ATTRIBUTE_ID", nullable = false, length = 36)
    private UUID attributeId;

    @Column(name = "VALUE_STRING", nullable = false, length = 100)
    private String valueString;

    @Column(name = "VALUE_NUMBER", nullable = false, length = 100)
    private Double valueNumber;

    @Column(name = "VALUE_BOOLEAN", nullable = false, length = 100)
    private Boolean valueBoolean;

    @Column(name = "VALUE_DATE", nullable = false, length = 100)
    private LocalDateTime valueDate;

    // value options id reference attribute allowed values
    @Column(name = "VALUE_OPTIONS_ID", nullable = false, length = 36)
    private UUID valueOptionsId;

    // refence table PRODUCTS
    @ManyToOne
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private ProductsEntity product;

    // refence table ATTRIBUTES
    @ManyToOne
    @JoinColumn(name = "ATTRIBUTE_ID", nullable = false)
    private AttributesEntity attribute;

    // refence table ATTRIBUTE_ALLOWED_VALUES
    @ManyToOne
    @JoinColumn(name = "VALUE_OPTIONS_ID", nullable = false)
    private AttributeAllowedValuesEntity valueOptions;

    // getter and setter
    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public UUID getAttributeId() {
        return attributeId;
    }

    public void setAttributeId(UUID attributeId) {
        this.attributeId = attributeId;
    }

    public String getValueString() {
        return valueString;
    }

    public void setValueString(String valueString) {
        this.valueString = valueString;
    }

    public Double getValueNumber() {
        return valueNumber;
    }

    public void setValueNumber(Double valueNumber) {
        this.valueNumber = valueNumber;
    }

    public Boolean getValueBoolean() {
        return valueBoolean;
    }

    public void setValueBoolean(Boolean valueBoolean) {
        this.valueBoolean = valueBoolean;
    }

    public LocalDateTime getValueDate() {
        return valueDate;
    }

    public void setValueDate(LocalDateTime valueDate) {
        this.valueDate = valueDate;
    }

    public UUID getValueOptionsId() {
        return valueOptionsId;
    }

    public void setValueOptionsId(UUID valueOptionsId) {
        this.valueOptionsId = valueOptionsId;
    }

    // toString
    @Override
    public String toString() {
        return "ProductAttributeValuesEntity{" +
                "productId=" + productId +
                ", attributeId=" + attributeId +
                ", valueString='" + valueString + '\'' +
                ", valueNumber=" + valueNumber +
                ", valueBoolean=" + valueBoolean +
                ", valueDate=" + valueDate +
                ", valueOptionsId=" + valueOptionsId +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ProductAttributeValuesEntity that = (ProductAttributeValuesEntity) o;
        return Objects.equals(super.getId(), that.getId()) && Objects.equals(productId, that.productId)
                && Objects.equals(attributeId, that.attributeId) && Objects.equals(valueString, that.valueString)
                && Objects.equals(valueNumber, that.valueNumber) && Objects.equals(valueBoolean, that.valueBoolean)
                && Objects.equals(valueDate, that.valueDate) && Objects.equals(valueOptionsId, that.valueOptionsId);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(super.getId(), productId, attributeId, valueString, valueNumber, valueBoolean, valueDate,
                valueOptionsId);
    }

}
