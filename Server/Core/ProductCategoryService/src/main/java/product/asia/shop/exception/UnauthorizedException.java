package product.asia.shop.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown for unauthorized access attempts
 */
public class UnauthorizedException extends BaseException {
    
    private static final String DEFAULT_MESSAGE = "Unauthorized access";
    private static final String ERROR_CODE = "UNAUTHORIZED";
    
    public UnauthorizedException() {
        super(DEFAULT_MESSAGE, ERROR_CODE, HttpStatus.UNAUTHORIZED);
    }
    
    public UnauthorizedException(String message) {
        super(message, ERROR_CODE, HttpStatus.UNAUTHORIZED);
    }
    
    public UnauthorizedException(String message, Throwable cause) {
        super(message, ERROR_CODE, HttpStatus.UNAUTHORIZED, cause);
    }
}
