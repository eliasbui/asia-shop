package product.asia.shop.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

/**
 * Exception thrown for validation errors
 */
public class ValidationException extends BaseException {
    
    private static final String DEFAULT_MESSAGE = "Validation failed";
    private static final String ERROR_CODE = "VALIDATION_ERROR";
    
    private Map<String, String> fieldErrors;
    
    public ValidationException() {
        super(DEFAULT_MESSAGE, ERROR_CODE, HttpStatus.BAD_REQUEST);
    }
    
    public ValidationException(String message) {
        super(message, ERROR_CODE, HttpStatus.BAD_REQUEST);
    }
    
    public ValidationException(String message, Map<String, String> fieldErrors) {
        super(message, ERROR_CODE, HttpStatus.BAD_REQUEST);
        this.fieldErrors = fieldErrors;
    }
    
    public ValidationException(String field, String errorMessage) {
        super(String.format("Validation failed for field '%s': %s", field, errorMessage), 
              ERROR_CODE, HttpStatus.BAD_REQUEST, field, errorMessage);
    }
    
    public ValidationException(String message, Throwable cause) {
        super(message, ERROR_CODE, HttpStatus.BAD_REQUEST, cause);
    }
    
    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }
    
    public void setFieldErrors(Map<String, String> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
}
