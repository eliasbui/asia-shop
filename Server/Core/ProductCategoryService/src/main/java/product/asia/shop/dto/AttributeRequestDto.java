package product.asia.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class AttributeRequestDto {
    
    @NotBlank(message = "Attribute code is required")
    @Size(max = 128, message = "Attribute code must not exceed 128 characters")
    private String code;
    
    @NotBlank(message = "Input type is required")
    @Size(max = 30, message = "Input type must not exceed 30 characters")
    private String inputType;
    
    @NotBlank(message = "Data type is required")
    @Size(max = 20, message = "Data type must not exceed 20 characters")
    private String dataType;
    
    @Size(max = 30, message = "Unit must not exceed 30 characters")
    private String unit;
    
    @NotNull(message = "Group ID is required")
    private UUID groupId;
    
    private Boolean isFilterable = false;
    private Boolean isRequired = false;
    
    private List<AttributeValueRequestDto> allowedValues;
    private Map<String, Map<String, String>> translations;

    // Constructors
    public AttributeRequestDto() {}

    public AttributeRequestDto(String code, String inputType, String dataType, UUID groupId) {
        this.code = code;
        this.inputType = inputType;
        this.dataType = dataType;
        this.groupId = groupId;
    }

    // Getters and Setters
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

    public List<AttributeValueRequestDto> getAllowedValues() {
        return allowedValues;
    }

    public void setAllowedValues(List<AttributeValueRequestDto> allowedValues) {
        this.allowedValues = allowedValues;
    }

    public Map<String, Map<String, String>> getTranslations() {
        return translations;
    }

    public void setTranslations(Map<String, Map<String, String>> translations) {
        this.translations = translations;
    }
}
