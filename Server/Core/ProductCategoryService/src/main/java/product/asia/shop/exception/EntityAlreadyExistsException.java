package product.asia.shop.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when attempting to create an entity that already exists
 */
public class EntityAlreadyExistsException extends BaseException {
    
    private static final String DEFAULT_MESSAGE = "Entity already exists";
    private static final String ERROR_CODE = "ENTITY_ALREADY_EXISTS";
    
    public EntityAlreadyExistsException() {
        super(DEFAULT_MESSAGE, ERROR_CODE, HttpStatus.CONFLICT);
    }
    
    public EntityAlreadyExistsException(String message) {
        super(message, ERROR_CODE, HttpStatus.CONFLICT);
    }
    
    public EntityAlreadyExistsException(String entityType, Object identifier) {
        super(String.format("%s with identifier '%s' already exists", entityType, identifier), 
              ERROR_CODE, HttpStatus.CONFLICT, entityType, identifier);
    }
    
    public EntityAlreadyExistsException(String message, Throwable cause) {
        super(message, ERROR_CODE, HttpStatus.CONFLICT, cause);
    }
    
    public EntityAlreadyExistsException(String entityType, Object identifier, Throwable cause) {
        super(String.format("%s with identifier '%s' already exists", entityType, identifier), 
              ERROR_CODE, HttpStatus.CONFLICT, cause, entityType, identifier);
    }
}
