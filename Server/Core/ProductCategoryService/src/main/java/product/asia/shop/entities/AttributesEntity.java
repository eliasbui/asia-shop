package product.asia.shop.entities;

import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ATTRIBUTES") // master list for attributes
public class AttributesEntity extends BaseEntity {
    // code
    @Column(name = "CODE", nullable = false, length = 128)
    private String code;

    // input type
    @Column(name = "INPUT_TYPE", nullable = false, length = 30)
    private String inputType;

    // data type
    @Column(name = "DATA_TYPE", nullable = false, length = 20)
    private String dataType;

    // unit
    @Column(name = "UNIT", nullable = false, length = 30)
    private String unit;

    // group id -- group for display (e.g., Tech Specs)
    @Column(name = "GROUP_ID", nullable = false, length = 36)
    private UUID groupId;

    // is_filterable BOOLEAN DEFAULT false,
    @Column(name = "IS_FILTERABLE", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isFilterable;

    // is_required BOOLEAN DEFAULT false
    @Column(name = "IS_REQUIRED", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean isRequired;

    // ALTER TABLE attributes ADD CONSTRAINT fk_group FOREIGN KEY(group_id)
    // REFERENCES attribute_groups(id);
    @ManyToOne
    @JoinColumn(name = "GROUP_ID", nullable = false)
    private AttributeGroupsEntity group;

    // Getter and Setter
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getInputType() {
        return inputType;
    }

    public void setInputType(String inputType) {
        this.inputType = inputType;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public UUID getGroupId() {
        return groupId;
    }

    public void setGroupId(UUID groupId) {
        this.groupId = groupId;
    }

    public Boolean getIsFilterable() {
        return isFilterable;
    }

    public void setIsFilterable(Boolean isFilterable) {
        this.isFilterable = isFilterable;
    }

    public Boolean getIsRequired() {
        return isRequired;
    }

    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
    }

    // toString
    @Override
    public String toString() {
        return "AttributesEntity{" +
                "code='" + code + '\'' +
                ", inputType='" + inputType + '\'' +
                ", dataType='" + dataType + '\'' +
                ", unit='" + unit + '\'' +
                ", groupId=" + groupId +
                ", isFilterable=" + isFilterable +
                ", isRequired=" + isRequired +
                '}';
    }

    // equals
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        AttributesEntity that = (AttributesEntity) o;
        return Objects.equals(super.getId(), that.getId()) && Objects.equals(code, that.code)
                && Objects.equals(inputType, that.inputType) && Objects.equals(dataType, that.dataType)
                && Objects.equals(unit, that.unit) && Objects.equals(groupId, that.groupId)
                && Objects.equals(isFilterable, that.isFilterable) && Objects.equals(isRequired, that.isRequired);
    }

    // hashCode
    @Override
    public int hashCode() {
        return Objects.hash(super.getId(), code, inputType, dataType, unit, groupId, isFilterable, isRequired);
    }

}
