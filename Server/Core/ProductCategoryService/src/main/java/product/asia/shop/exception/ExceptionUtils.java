package product.asia.shop.exception;

import java.util.UUID;

/**
 * Utility class for exception handling operations
 */
public final class ExceptionUtils {
    
    private ExceptionUtils() {
        // Utility class
    }
    
    /**
     * Creates a correlation ID for tracking exceptions
     */
    public static String generateCorrelationId() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Extracts the root cause message from a throwable chain
     */
    public static String getRootCauseMessage(Throwable throwable) {
        if (throwable == null) {
            return null;
        }
        
        Throwable rootCause = throwable;
        while (rootCause.getCause() != null && rootCause.getCause() != rootCause) {
            rootCause = rootCause.getCause();
        }
        
        return rootCause.getMessage();
    }
    
    /**
     * Checks if the throwable chain contains a specific exception type
     */
    public static boolean containsException(Throwable throwable, Class<? extends Throwable> exceptionType) {
        if (throwable == null || exceptionType == null) {
            return false;
        }
        
        Throwable current = throwable;
        while (current != null) {
            if (exceptionType.isInstance(current)) {
                return true;
            }
            current = current.getCause();
            if (current == throwable) { // Avoid infinite loop
                break;
            }
        }
        
        return false;
    }
    
    /**
     * Finds the first exception of the specified type in the throwable chain
     */
    @SuppressWarnings("unchecked")
    public static <T extends Throwable> T findException(Throwable throwable, Class<T> exceptionType) {
        if (throwable == null || exceptionType == null) {
            return null;
        }
        
        Throwable current = throwable;
        while (current != null) {
            if (exceptionType.isInstance(current)) {
                return (T) current;
            }
            current = current.getCause();
            if (current == throwable) { // Avoid infinite loop
                break;
            }
        }
        
        return null;
    }
    
    /**
     * Creates a sanitized error message for public consumption
     */
    public static String sanitizeErrorMessage(String message) {
        if (message == null) {
            return "An error occurred";
        }
        
        // Remove potentially sensitive information
        String sanitized = message
            .replaceAll("(?i)password[=:]\\s*\\S+", "password=***")
            .replaceAll("(?i)token[=:]\\s*\\S+", "token=***")
            .replaceAll("(?i)key[=:]\\s*\\S+", "key=***");
            
        return sanitized;
    }
    
    /**
     * Determines if an exception should be logged at ERROR level
     */
    public static boolean shouldLogAsError(Throwable throwable) {
        if (throwable instanceof BaseException) {
            BaseException baseEx = (BaseException) throwable;
            // Don't log client errors (4xx) as ERROR, use WARN instead
            return baseEx.getHttpStatus().is5xxServerError();
        }
        
        // For non-custom exceptions, log as error by default
        return true;
    }
    
    /**
     * Creates a user-friendly error message based on the exception type
     */
    public static String createUserFriendlyMessage(Throwable throwable) {
        if (throwable instanceof ValidationException) {
            return "Please check your input and try again";
        } else if (throwable instanceof EntityNotFoundException) {
            return "The requested resource was not found";
        } else if (throwable instanceof EntityAlreadyExistsException) {
            return "The resource already exists";
        } else if (throwable instanceof UnauthorizedException) {
            return "Please log in to access this resource";
        } else if (throwable instanceof ForbiddenException) {
            return "You don't have permission to access this resource";
        } else if (throwable instanceof DatabaseException) {
            return "A database error occurred. Please try again later";
        } else {
            return "An unexpected error occurred. Please try again later";
        }
    }
}
