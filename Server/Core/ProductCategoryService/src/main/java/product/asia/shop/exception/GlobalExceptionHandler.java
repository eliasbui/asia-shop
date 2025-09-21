package product.asia.shop.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.messaging.handler.annotation.support.MethodArgumentTypeMismatchException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import jakarta.persistence.EntityExistsException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import product.asia.shop.dto.ApiResponse;
import product.asia.shop.dto.ValidationErrorResponse;

import java.nio.file.AccessDeniedException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.naming.AuthenticationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Value("${app.debug.include-stack-trace:false}")
    private boolean includeStackTrace;

    // ==================== Custom Application Exceptions ====================

    /**
     * Handle BaseException and its subclasses
     */
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleBaseException(
            BaseException ex, WebRequest request) {

        logger.error("Application exception [{}]: {}", ex.getErrorCode(), ex.getMessage(), ex);

        ApiResponse<ErrorResponse> response = ApiResponse.error(ex.getMessage());

        return new ResponseEntity<>(response, ex.getHttpStatus());
    }

    /**
     * Handle custom EntityNotFoundException
     */
    @ExceptionHandler(product.asia.shop.exception.EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleEntityNotFoundException(
            product.asia.shop.exception.EntityNotFoundException ex, WebRequest request) {

        logger.warn("Entity not found: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error(ex.getMessage());

        return new ResponseEntity<>(response, ex.getHttpStatus());
    }

    /**
     * Handle custom ValidationException
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<ValidationErrorResponse>> handleValidationException(
            ValidationException ex, WebRequest request) {

        logger.warn("Validation exception: {}", ex.getMessage());

        ApiResponse<ValidationErrorResponse> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, ex.getHttpStatus());
    }

    // ==================== Spring Framework Exceptions ====================

    /**
     * Handle validation errors from @Valid annotation
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<ValidationErrorResponse>> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {

        logger.warn("Validation error: {}", ex.getMessage());

        ValidationErrorResponse errorResponse = ValidationErrorResponse.of("Validation failed");

        ex.getBindingResult().getFieldErrors().forEach(error -> errorResponse.addFieldError(error.getField(),
                error.getDefaultMessage(), error.getRejectedValue()));

        ex.getBindingResult().getGlobalErrors()
                .forEach(error -> errorResponse.addGlobalError(error.getDefaultMessage()));

        ApiResponse<ValidationErrorResponse> response = ApiResponse.error("Validation failed");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle constraint violation exceptions
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<ValidationErrorResponse>> handleConstraintViolationException(
            ConstraintViolationException ex, WebRequest request) {

        logger.warn("Constraint violation: {}", ex.getMessage());

        ValidationErrorResponse errorResponse = ValidationErrorResponse.of("Constraint violation");

        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String fieldName = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            Object invalidValue = violation.getInvalidValue();
            errorResponse.addFieldError(fieldName, message, invalidValue);
        }

        ApiResponse<ValidationErrorResponse> response = ApiResponse.error("Constraint violation");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle missing request parameters
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException ex, WebRequest request) {

        logger.warn("Missing request parameter: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error("Missing required parameter");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle method argument type mismatch
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException ex, WebRequest request) {

        logger.warn("Method argument type mismatch: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error("Invalid parameter type");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle HTTP message not readable
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException ex, WebRequest request) {

        logger.warn("HTTP message not readable: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error("Invalid request format");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle HTTP request method not supported
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException ex, WebRequest request) {

        logger.warn("HTTP method not supported: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error("Method not supported");
        return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
    }

    // ==================== Security Exceptions ====================

    /**
     * Handle authentication exceptions
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleAuthenticationException(
            AuthenticationException ex, WebRequest request) {

        logger.warn("Authentication failed: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error("Authentication required");
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle access denied exceptions
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {

        logger.warn("Access denied: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error("Access forbidden");
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    // ==================== Database Exceptions ====================

    /**
     * Handle JPA EntityNotFoundException
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleJpaEntityNotFoundException(
            EntityNotFoundException ex, WebRequest request) {

        logger.warn("JPA Entity not found: {}", ex.getMessage());
        ApiResponse<ErrorResponse> response = ApiResponse.error("Entity not found");
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle JPA EntityExistsException
     */
    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleJpaEntityExistsException(
            EntityExistsException ex, WebRequest request) {

        logger.warn("JPA Entity already exists: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error("Entity already exists");
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    /**
     * Handle data integrity violation
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex, WebRequest request) {

        logger.error("Data integrity violation: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error("Data integrity violation");
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    /**
     * Handle duplicate key exceptions
     */
    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleDuplicateKeyException(
            DuplicateKeyException ex, WebRequest request) {

        logger.warn("Duplicate key violation: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error("Duplicate entry");
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    /**
     * Handle general data access exceptions
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleDataAccessException(
            DataAccessException ex, WebRequest request) {

        logger.error("Database access error: {}", ex.getMessage(), ex);

        ApiResponse<ErrorResponse> response = ApiResponse.error("Database error");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==================== Generic Exceptions ====================

    /**
     * Handle IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {

        logger.warn("Illegal argument: {}", ex.getMessage());

        ApiResponse<ErrorResponse> response = ApiResponse.error("Invalid argument");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle generic RuntimeException
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleRuntimeException(
            RuntimeException ex, WebRequest request) {

        logger.error("Runtime exception occurred: ", ex);

        ApiResponse<ErrorResponse> response = ApiResponse.error("Runtime error");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ErrorResponse>> handleGlobalException(
            Exception ex, WebRequest request) {

        logger.error("Unexpected error occurred: ", ex);

        ApiResponse<ErrorResponse> response = ApiResponse.error("Internal server error");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private List<String> getStackTraceAsList(Throwable ex) {
        return Arrays.stream(ex.getStackTrace())
                .map(StackTraceElement::toString)
                .collect(Collectors.toList());
    }
}
