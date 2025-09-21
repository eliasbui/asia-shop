package product.asia.shop.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception specific to Category entity operations
 */
public class CategoryException extends BaseException {
    
    private static final String ERROR_CODE_PREFIX = "CATEGORY_";
    
    public CategoryException(String message) {
        super(message, ERROR_CODE_PREFIX + "ERROR", HttpStatus.BAD_REQUEST);
    }
    
    public CategoryException(String message, HttpStatus httpStatus) {
        super(message, ERROR_CODE_PREFIX + "ERROR", httpStatus);
    }
    
    public CategoryException(String message, String specificErrorCode, HttpStatus httpStatus) {
        super(message, ERROR_CODE_PREFIX + specificErrorCode, httpStatus);
    }
    
    public CategoryException(String message, Throwable cause) {
        super(message, ERROR_CODE_PREFIX + "ERROR", HttpStatus.BAD_REQUEST, cause);
    }
    
    // Specific category exceptions
    public static class CategoryNotFound extends CategoryException {
        public CategoryNotFound(Object categoryId) {
            super(String.format("Category with id '%s' not found", categoryId), "NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }
    
    public static class CategoryAlreadyExists extends CategoryException {
        public CategoryAlreadyExists(String identifier) {
            super(String.format("Category with identifier '%s' already exists", identifier), "ALREADY_EXISTS", HttpStatus.CONFLICT);
        }
    }
    
    public static class InvalidCategoryHierarchy extends CategoryException {
        public InvalidCategoryHierarchy(String message) {
            super(message, "INVALID_HIERARCHY", HttpStatus.BAD_REQUEST);
        }
    }
    
    public static class CategoryHasChildren extends CategoryException {
        public CategoryHasChildren(Object categoryId) {
            super(String.format("Category with id '%s' has child categories and cannot be deleted", categoryId), "HAS_CHILDREN", HttpStatus.BAD_REQUEST);
        }
    }
    
    public static class CategoryHasProducts extends CategoryException {
        public CategoryHasProducts(Object categoryId) {
            super(String.format("Category with id '%s' has associated products and cannot be deleted", categoryId), "HAS_PRODUCTS", HttpStatus.BAD_REQUEST);
        }
    }
}
