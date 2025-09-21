package product.asia.shop.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown for business logic violations
 */
public class BusinessLogicException extends BaseException {
    
    private static final String DEFAULT_MESSAGE = "Business logic violation";
    private static final String ERROR_CODE = "BUSINESS_LOGIC_ERROR";
    
    public BusinessLogicException() {
        super(DEFAULT_MESSAGE, ERROR_CODE, HttpStatus.BAD_REQUEST);
    }
    
    public BusinessLogicException(String message) {
        super(message, ERROR_CODE, HttpStatus.BAD_REQUEST);
    }
    
    public BusinessLogicException(String message, String customErrorCode) {
        super(message, customErrorCode, HttpStatus.BAD_REQUEST);
    }
    
    public BusinessLogicException(String message, Throwable cause) {
        super(message, ERROR_CODE, HttpStatus.BAD_REQUEST, cause);
    }
    
    public BusinessLogicException(String message, String customErrorCode, Throwable cause) {
        super(message, customErrorCode, HttpStatus.BAD_REQUEST, cause);
    }
    
    public BusinessLogicException(String message, HttpStatus httpStatus) {
        super(message, ERROR_CODE, httpStatus);
    }
    
    public BusinessLogicException(String message, String customErrorCode, HttpStatus httpStatus) {
        super(message, customErrorCode, httpStatus);
    }
}
