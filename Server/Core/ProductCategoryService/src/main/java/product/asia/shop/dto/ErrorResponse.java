package product.asia.shop.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Standardized error response DTO for consistent error handling
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    
    private String errorCode;
    private String message;
    private String details;
    private LocalDateTime timestamp;
    private String correlationId;
    private String path;
    private Integer status;
    private Map<String, String> fieldErrors;
    private List<String> stackTrace;
    
    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    public ErrorResponse(String errorCode, String message) {
        this();
        this.errorCode = errorCode;
        this.message = message;
    }
    
    public ErrorResponse(String errorCode, String message, String details) {
        this();
        this.errorCode = errorCode;
        this.message = message;
        this.details = details;
    }
    
    public ErrorResponse(String errorCode, String message, String details, String correlationId) {
        this();
        this.errorCode = errorCode;
        this.message = message;
        this.details = details;
        this.correlationId = correlationId;
    }
    
    // Static factory methods
    public static ErrorResponse of(String errorCode, String message) {
        return new ErrorResponse(errorCode, message);
    }
    
    public static ErrorResponse of(String errorCode, String message, String details) {
        return new ErrorResponse(errorCode, message, details);
    }
    
    public static ErrorResponse of(String errorCode, String message, String details, String correlationId) {
        return new ErrorResponse(errorCode, message, details, correlationId);
    }
    
    public static ErrorResponse validationError(String message, Map<String, String> fieldErrors) {
        ErrorResponse response = new ErrorResponse("VALIDATION_ERROR", message);
        response.setFieldErrors(fieldErrors);
        return response;
    }
    
    // Getters and Setters
    public String getErrorCode() {
        return errorCode;
    }
    
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getDetails() {
        return details;
    }
    
    public void setDetails(String details) {
        this.details = details;
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
    
    public String getPath() {
        return path;
    }
    
    public void setPath(String path) {
        this.path = path;
    }
    
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }
    
    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
    
    public void setFieldErrors(Map<String, String> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
    
    public List<String> getStackTrace() {
        return stackTrace;
    }
    
    public void setStackTrace(List<String> stackTrace) {
        this.stackTrace = stackTrace;
    }
}
