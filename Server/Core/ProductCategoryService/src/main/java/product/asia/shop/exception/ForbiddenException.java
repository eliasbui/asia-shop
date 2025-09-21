package product.asia.shop.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when access to a resource is forbidden
 */
public class ForbiddenException extends BaseException {
    
    private static final String DEFAULT_MESSAGE = "Access forbidden";
    private static final String ERROR_CODE = "FORBIDDEN";
    
    public ForbiddenException() {
        super(DEFAULT_MESSAGE, ERROR_CODE, HttpStatus.FORBIDDEN);
    }
    
    public ForbiddenException(String resource) {
        super(String.format("Access to '%s' is forbidden", resource), 
              ERROR_CODE, HttpStatus.FORBIDDEN, resource);
    }
    
    public ForbiddenException(String message, Throwable cause) {
        super(message, ERROR_CODE, HttpStatus.FORBIDDEN, cause);
    }
}
