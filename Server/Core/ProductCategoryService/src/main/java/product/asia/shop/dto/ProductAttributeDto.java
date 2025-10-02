package product.asia.shop.dto;

import java.util.UUID;

public class ProductAttributeDto {
    private UUID attributeId;
    private String attributeCode;
    private String attributeName;
    private String dataType;
    private String inputType;
    private String unit;
    private Object value;
    private String displayValue;
    private String groupName;
    private Boolean isFilterable;
    private Boolean isRequired;

    // Constructors
    public ProductAttributeDto() {}

    public ProductAttributeDto(UUID attributeId, String attributeCode, String attributeName, 
                             String dataType, Object value, String displayValue) {
        this.attributeId = attributeId;
        this.attributeCode = attributeCode;
        this.attributeName = attributeName;
        this.dataType = dataType;
        this.value = value;
        this.displayValue = displayValue;
    }

    // Getters and Setters
    public UUID getAttributeId() {
        return attributeId;
    }

    public void setAttributeId(UUID attributeId) {
        this.attributeId = attributeId;
    }

    public String getAttributeCode() {
        return attributeCode;
    }

    public void setAttributeCode(String attributeCode) {
        this.attributeCode = attributeCode;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getInputType() {
        return inputType;
    }

    public void setInputType(String inputType) {
        this.inputType = inputType;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public String getDisplayValue() {
        return displayValue;
    }

    public void setDisplayValue(String displayValue) {
        this.displayValue = displayValue;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
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
}
