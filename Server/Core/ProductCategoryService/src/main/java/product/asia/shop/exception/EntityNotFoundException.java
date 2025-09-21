package product.asia.shop.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a requested entity is not found
 */
public class EntityNotFoundException extends BaseException {
    
    private static final String DEFAULT_MESSAGE = "Entity not found";
    private static final String ERROR_CODE = "ENTITY_NOT_FOUND";
    
    public EntityNotFoundException() {
        super(DEFAULT_MESSAGE, ERROR_CODE, HttpStatus.NOT_FOUND);
    }
    
    public EntityNotFoundException(String message) {
        super(message, ERROR_CODE, HttpStatus.NOT_FOUND);
    }
    
    public EntityNotFoundException(String entityType, Object id) {
        super(String.format("%s with id '%s' not found", entityType, id), 
              ERROR_CODE, HttpStatus.NOT_FOUND, entityType, id);
    }
    
    public EntityNotFoundException(String message, Throwable cause) {
        super(message, ERROR_CODE, HttpStatus.NOT_FOUND, cause);
    }
    
    public EntityNotFoundException(String entityType, Object id, Throwable cause) {
        super(String.format("%s with id '%s' not found", entityType, id), 
              ERROR_CODE, HttpStatus.NOT_FOUND, cause, entityType, id);
    }
}
