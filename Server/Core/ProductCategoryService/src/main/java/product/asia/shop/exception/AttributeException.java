package product.asia.shop.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception specific to Attribute entity operations
 */
public class AttributeException extends BaseException {
    
    private static final String ERROR_CODE_PREFIX = "ATTRIBUTE_";
    
    public AttributeException(String message) {
        super(message, ERROR_CODE_PREFIX + "ERROR", HttpStatus.BAD_REQUEST);
    }
    
    public AttributeException(String message, HttpStatus httpStatus) {
        super(message, ERROR_CODE_PREFIX + "ERROR", httpStatus);
    }
    
    public AttributeException(String message, String specificErrorCode, HttpStatus httpStatus) {
        super(message, ERROR_CODE_PREFIX + specificErrorCode, httpStatus);
    }
    
    public AttributeException(String message, Throwable cause) {
        super(message, ERROR_CODE_PREFIX + "ERROR", HttpStatus.BAD_REQUEST, cause);
    }
    
    // Specific attribute exceptions
    public static class AttributeNotFound extends AttributeException {
        public AttributeNotFound(Object attributeId) {
            super(String.format("Attribute with id '%s' not found", attributeId), "NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }
    
    public static class AttributeAlreadyExists extends AttributeException {
        public AttributeAlreadyExists(String identifier) {
            super(String.format("Attribute with identifier '%s' already exists", identifier), "ALREADY_EXISTS", HttpStatus.CONFLICT);
        }
    }
    
    public static class InvalidAttributeValue extends AttributeException {
        public InvalidAttributeValue(String attributeName, Object value) {
            super(String.format("Invalid value '%s' for attribute '%s'", value, attributeName), "INVALID_VALUE", HttpStatus.BAD_REQUEST);
        }
    }
    
    public static class AttributeValueNotAllowed extends AttributeException {
        public AttributeValueNotAllowed(String attributeName, Object value) {
            super(String.format("Value '%s' is not allowed for attribute '%s'", value, attributeName), "VALUE_NOT_ALLOWED", HttpStatus.BAD_REQUEST);
        }
    }
    
    public static class RequiredAttributeMissing extends AttributeException {
        public RequiredAttributeMissing(String attributeName) {
            super(String.format("Required attribute '%s' is missing", attributeName), "REQUIRED_MISSING", HttpStatus.BAD_REQUEST);
        }
    }
}
