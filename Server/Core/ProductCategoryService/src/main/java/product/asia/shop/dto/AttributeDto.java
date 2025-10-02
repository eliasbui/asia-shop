package product.asia.shop.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class AttributeDto {
    private UUID id;
    private String code;
    private String inputType;
    private String dataType;
    private String unit;
    private UUID groupId;
    private String groupName;
    private Boolean isFilterable;
    private Boolean isRequired;
    private List<AttributeValueDto> allowedValues;
    private Map<String, Map<String, String>> translations;

    // Constructors
    public AttributeDto() {}

    public AttributeDto(UUID id, String code, String inputType, String dataType) {
        this.id = id;
        this.code = code;
        this.inputType = inputType;
        this.dataType = dataType;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public List<AttributeValueDto> getAllowedValues() {
        return allowedValues;
    }

    public void setAllowedValues(List<AttributeValueDto> allowedValues) {
        this.allowedValues = allowedValues;
    }

    public Map<String, Map<String, String>> getTranslations() {
        return translations;
    }

    public void setTranslations(Map<String, Map<String, String>> translations) {
        this.translations = translations;
    }
}
