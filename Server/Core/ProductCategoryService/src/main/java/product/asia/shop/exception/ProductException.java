package product.asia.shop.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception specific to Product entity operations
 */
public class ProductException extends BaseException {
    
    private static final String ERROR_CODE_PREFIX = "PRODUCT_";
    
    public ProductException(String message) {
        super(message, ERROR_CODE_PREFIX + "ERROR", HttpStatus.BAD_REQUEST);
    }
    
    public ProductException(String message, HttpStatus httpStatus) {
        super(message, ERROR_CODE_PREFIX + "ERROR", httpStatus);
    }
    
    public ProductException(String message, String specificErrorCode, HttpStatus httpStatus) {
        super(message, ERROR_CODE_PREFIX + specificErrorCode, httpStatus);
    }
    
    public ProductException(String message, Throwable cause) {
        super(message, ERROR_CODE_PREFIX + "ERROR", HttpStatus.BAD_REQUEST, cause);
    }
    
    // Specific product exceptions
    public static class ProductNotFound extends ProductException {
        public ProductNotFound(Object productId) {
            super(String.format("Product with id '%s' not found", productId), "NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }
    
    public static class ProductAlreadyExists extends ProductException {
        public ProductAlreadyExists(String identifier) {
            super(String.format("Product with identifier '%s' already exists", identifier), "ALREADY_EXISTS", HttpStatus.CONFLICT);
        }
    }
    
    public static class InvalidProductData extends ProductException {
        public InvalidProductData(String message) {
            super(message, "INVALID_DATA", HttpStatus.BAD_REQUEST);
        }
    }
    
    public static class ProductOutOfStock extends ProductException {
        public ProductOutOfStock(Object productId) {
            super(String.format("Product with id '%s' is out of stock", productId), "OUT_OF_STOCK", HttpStatus.BAD_REQUEST);
        }
    }
}
