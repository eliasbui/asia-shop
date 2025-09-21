package product.asia.shop.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown for database-related errors
 */
public class DatabaseException extends BaseException {
    
    private static final String DEFAULT_MESSAGE = "Database operation failed";
    private static final String ERROR_CODE = "DATABASE_ERROR";
    
    public DatabaseException() {
        super(DEFAULT_MESSAGE, ERROR_CODE, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    public DatabaseException(String message) {
        super(message, ERROR_CODE, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    public DatabaseException(String message, Throwable cause) {
        super(message, ERROR_CODE, HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }
    
    public DatabaseException(String operation, String entity) {
        super(String.format("Database operation '%s' failed for entity '%s'", operation, entity), 
              ERROR_CODE, HttpStatus.INTERNAL_SERVER_ERROR, operation, entity);
    }
    
    public DatabaseException(String operation, String entity, Throwable cause) {
        super(String.format("Database operation '%s' failed for entity '%s'", operation, entity), 
              ERROR_CODE, HttpStatus.INTERNAL_SERVER_ERROR, cause, operation, entity);
    }
}
