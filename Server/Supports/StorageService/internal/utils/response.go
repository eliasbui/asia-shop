package utils

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// APIResponse represents a standard API response
type APIResponse struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data,omitempty"`
	Error     *APIError   `json:"error,omitempty"`
	Timestamp string      `json:"timestamp"`
	RequestID string      `json:"request_id,omitempty"`
}

// APIError represents an error response
type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

// PaginationMeta represents pagination metadata
type PaginationMeta struct {
	Page       int   `json:"page"`
	PageSize   int   `json:"page_size"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
	HasNext    bool  `json:"has_next"`
	HasPrev    bool  `json:"has_prev"`
}

// PaginatedResponse represents a paginated response
type PaginatedResponse struct {
	Success    bool           `json:"success"`
	Data       interface{}    `json:"data"`
	Pagination PaginationMeta `json:"pagination"`
	Timestamp  string         `json:"timestamp"`
	RequestID  string         `json:"request_id,omitempty"`
}

// SuccessResponse sends a successful response
func SuccessResponse(c *gin.Context, data interface{}) {
	requestID := GetRequestID(c)

	response := APIResponse{
		Success:   true,
		Data:      data,
		Timestamp: time.Now().Format(time.RFC3339),
		RequestID: requestID,
	}

	c.JSON(http.StatusOK, response)
}

// SuccessResponseWithStatus sends a successful response with custom status code
func SuccessResponseWithStatus(c *gin.Context, statusCode int, data interface{}) {
	requestID := GetRequestID(c)

	response := APIResponse{
		Success:   true,
		Data:      data,
		Timestamp: time.Now().Format(time.RFC3339),
		RequestID: requestID,
	}

	c.JSON(statusCode, response)
}

// ErrorResponse sends an error response
func ErrorResponse(c *gin.Context, statusCode int, code, message string, details ...string) {
	requestID := GetRequestID(c)

	apiError := &APIError{
		Code:    code,
		Message: message,
	}

	if len(details) > 0 {
		apiError.Details = details[0]
	}

	response := APIResponse{
		Success:   false,
		Error:     apiError,
		Timestamp: time.Now().Format(time.RFC3339),
		RequestID: requestID,
	}

	c.JSON(statusCode, response)
}

// PaginatedSuccessResponse sends a paginated successful response
func PaginatedSuccessResponse(c *gin.Context, data interface{}, pagination PaginationMeta) {
	requestID := GetRequestID(c)

	response := PaginatedResponse{
		Success:    true,
		Data:       data,
		Pagination: pagination,
		Timestamp:  time.Now().Format(time.RFC3339),
		RequestID:  requestID,
	}

	c.JSON(http.StatusOK, response)
}

// BadRequestError sends a 400 Bad Request error
func BadRequestError(c *gin.Context, message string, details ...string) {
	ErrorResponse(c, http.StatusBadRequest, "BAD_REQUEST", message, details...)
}

// UnauthorizedError sends a 401 Unauthorized error
func UnauthorizedError(c *gin.Context, message string, details ...string) {
	ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", message, details...)
}

// ForbiddenError sends a 403 Forbidden error
func ForbiddenError(c *gin.Context, message string, details ...string) {
	ErrorResponse(c, http.StatusForbidden, "FORBIDDEN", message, details...)
}

// NotFoundError sends a 404 Not Found error
func NotFoundError(c *gin.Context, message string, details ...string) {
	ErrorResponse(c, http.StatusNotFound, "NOT_FOUND", message, details...)
}

// ConflictError sends a 409 Conflict error
func ConflictError(c *gin.Context, message string, details ...string) {
	ErrorResponse(c, http.StatusConflict, "CONFLICT", message, details...)
}

// InternalServerError sends a 500 Internal Server Error
func InternalServerError(c *gin.Context, message string, details ...string) {
	ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", message, details...)
}

// ValidationError sends a 422 Unprocessable Entity error for validation failures
func ValidationError(c *gin.Context, message string, details ...string) {
	ErrorResponse(c, http.StatusUnprocessableEntity, "VALIDATION_ERROR", message, details...)
}

// GetRequestID extracts request ID from context
func GetRequestID(c *gin.Context) string {
	if requestID, exists := c.Get("request_id"); exists {
		if id, ok := requestID.(string); ok {
			return id
		}
	}
	return ""
}

// GetUserID extracts user ID from context and converts to UUID
func GetUserID(c *gin.Context) uuid.UUID {
	if userID, exists := c.Get("user_id"); exists {
		switch id := userID.(type) {
		case uuid.UUID:
			// Already a UUID
			return id
		case string:
			// Convert string to UUID
			if parsed, err := uuid.Parse(id); err == nil {
				return parsed
			}
		}
	}
	return uuid.Nil
}

// GetUserIDString extracts user ID from context as string
func GetUserIDString(c *gin.Context) string {
	if userID, exists := c.Get("user_id"); exists {
		switch id := userID.(type) {
		case string:
			// Already a string
			return id
		case uuid.UUID:
			// Convert UUID to string
			return id.String()
		}
	}
	return ""
}

// GetUserEmail extracts user email from context
func GetUserEmail(c *gin.Context) string {
	if email, exists := c.Get("user_email"); exists {
		if emailStr, ok := email.(string); ok {
			return emailStr
		}
	}
	return ""
}

// GetUserUsername extracts username from context
func GetUserUsername(c *gin.Context) string {
	if username, exists := c.Get("user_username"); exists {
		if usernameStr, ok := username.(string); ok {
			return usernameStr
		}
	}
	return ""
}

// GetUserRoles extracts user roles from context
func GetUserRoles(c *gin.Context) []string {
	if roles, exists := c.Get("user_roles"); exists {
		if roleSlice, ok := roles.([]string); ok {
			return roleSlice
		}
	}
	return []string{}
}

// GetUserFullName extracts user full name from context
func GetUserFullName(c *gin.Context) string {
	if fullName, exists := c.Get("user_full_name"); exists {
		if nameStr, ok := fullName.(string); ok {
			return nameStr
		}
	}
	return ""
}

// IsEmailConfirmed checks if user email is confirmed
func IsEmailConfirmed(c *gin.Context) bool {
	if confirmed, exists := c.Get("email_confirmed"); exists {
		if confirmedBool, ok := confirmed.(bool); ok {
			return confirmedBool
		}
	}
	return false
}

// HasRole checks if user has a specific role
func HasRole(c *gin.Context, role string) bool {
	roles := GetUserRoles(c)
	for _, userRole := range roles {
		if userRole == role {
			return true
		}
	}
	return false
}

// HasAnyRole checks if user has any of the specified roles
func HasAnyRole(c *gin.Context, roles ...string) bool {
	userRoles := GetUserRoles(c)
	for _, userRole := range userRoles {
		for _, requiredRole := range roles {
			if userRole == requiredRole {
				return true
			}
		}
	}
	return false
}

// IsAuthenticated checks if user is authenticated (has valid user_id)
func IsAuthenticated(c *gin.Context) bool {
	userID := GetUserIDString(c)
	return userID != ""
}

// RequireAuthentication middleware to ensure user is authenticated
func RequireAuthentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !IsAuthenticated(c) {
			UnauthorizedError(c, "User not authenticated")
			c.Abort()
			return
		}
		c.Next()
	}
}

// CalculatePagination calculates pagination metadata
func CalculatePagination(page, pageSize int, total int64) PaginationMeta {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	totalPages := int((total + int64(pageSize) - 1) / int64(pageSize))
	if totalPages < 1 {
		totalPages = 1
	}

	return PaginationMeta{
		Page:       page,
		PageSize:   pageSize,
		Total:      total,
		TotalPages: totalPages,
		HasNext:    page < totalPages,
		HasPrev:    page > 1,
	}
}
