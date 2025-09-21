package product.asia.shop.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Specialized error response for validation errors
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ValidationErrorResponse {
    
    private String message;
    private LocalDateTime timestamp;
    private String correlationId;
    private List<FieldError> fieldErrors;
    private List<String> globalErrors;
    
    public ValidationErrorResponse() {
        this.timestamp = LocalDateTime.now();
        this.fieldErrors = new ArrayList<>();
        this.globalErrors = new ArrayList<>();
    }
    
    public ValidationErrorResponse(String message) {
        this();
        this.message = message;
    }
    
    public ValidationErrorResponse(String message, String correlationId) {
        this();
        this.message = message;
        this.correlationId = correlationId;
    }
    
    // Static factory methods
    public static ValidationErrorResponse of(String message) {
        return new ValidationErrorResponse(message);
    }
    
    public static ValidationErrorResponse of(String message, String correlationId) {
        return new ValidationErrorResponse(message, correlationId);
    }
    
    public static ValidationErrorResponse fromMap(String message, Map<String, String> errors) {
        ValidationErrorResponse response = new ValidationErrorResponse(message);
        errors.forEach((field, error) -> response.addFieldError(field, error));
        return response;
    }
    
    // Helper methods
    public void addFieldError(String field, String message) {
        this.fieldErrors.add(new FieldError(field, message));
    }
    
    public void addFieldError(String field, String message, Object rejectedValue) {
        this.fieldErrors.add(new FieldError(field, message, rejectedValue));
    }
    
    public void addGlobalError(String message) {
        this.globalErrors.add(message);
    }
    
    // Getters and Setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getCorrelationId() {
        return correlationId;
    }
    
    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }
    
    public List<FieldError> getFieldErrors() {
        return fieldErrors;
    }
    
    public void setFieldErrors(List<FieldError> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
    
    public List<String> getGlobalErrors() {
        return globalErrors;
    }
    
    public void setGlobalErrors(List<String> globalErrors) {
        this.globalErrors = globalErrors;
    }
    
    /**
     * Inner class representing a field validation error
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FieldError {
        private String field;
        private String message;
        private Object rejectedValue;
        
        public FieldError() {}
        
        public FieldError(String field, String message) {
            this.field = field;
            this.message = message;
        }
        
        public FieldError(String field, String message, Object rejectedValue) {
            this.field = field;
            this.message = message;
            this.rejectedValue = rejectedValue;
        }
        
        // Getters and Setters
        public String getField() {
            return field;
        }
        
        public void setField(String field) {
            this.field = field;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public Object getRejectedValue() {
            return rejectedValue;
        }
        
        public void setRejectedValue(Object rejectedValue) {
            this.rejectedValue = rejectedValue;
        }
    }
}
