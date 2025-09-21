package utils

import (
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"
)

// FileValidationConfig holds file validation rules
type FileValidationConfig struct {
	MaxFileSize      int64
	AllowedMimeTypes []string
	AllowedExtensions []string
}

// DefaultFileValidationConfig returns default validation configuration
func DefaultFileValidationConfig() FileValidationConfig {
	return FileValidationConfig{
		MaxFileSize: 100 * 1024 * 1024, // 100MB
		AllowedMimeTypes: []string{
			"image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
			"application/pdf",
			"text/plain", "text/csv",
			"application/json", "application/xml",
			"application/zip", "application/x-zip-compressed",
			"application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		},
		AllowedExtensions: []string{
			".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
			".pdf", ".txt", ".csv", ".json", ".xml",
			".zip", ".doc", ".docx", ".xls", ".xlsx",
		},
	}
}

// ValidateFileUpload validates uploaded file against configuration
func ValidateFileUpload(fileHeader *multipart.FileHeader, config FileValidationConfig) error {
	// Check file size
	if fileHeader.Size > config.MaxFileSize {
		return fmt.Errorf("file size %d bytes exceeds maximum allowed size of %d bytes", 
			fileHeader.Size, config.MaxFileSize)
	}

	if fileHeader.Size == 0 {
		return fmt.Errorf("file is empty")
	}

	// Check content type
	contentType := fileHeader.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	if !isContentTypeAllowed(contentType, config.AllowedMimeTypes) {
		return fmt.Errorf("file type '%s' is not allowed", contentType)
	}

	// Check file extension
	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	if !isExtensionAllowed(ext, config.AllowedExtensions) {
		return fmt.Errorf("file extension '%s' is not allowed", ext)
	}

	// Basic filename validation
	if err := validateFilename(fileHeader.Filename); err != nil {
		return fmt.Errorf("invalid filename: %w", err)
	}

	return nil
}

// isContentTypeAllowed checks if content type is in allowed list
func isContentTypeAllowed(contentType string, allowedTypes []string) bool {
	for _, allowed := range allowedTypes {
		if contentType == allowed {
			return true
		}
	}
	return false
}

// isExtensionAllowed checks if file extension is in allowed list
func isExtensionAllowed(ext string, allowedExtensions []string) bool {
	for _, allowed := range allowedExtensions {
		if ext == allowed {
			return true
		}
	}
	return false
}

// validateFilename checks filename for dangerous characters
func validateFilename(filename string) error {
	if filename == "" {
		return fmt.Errorf("filename cannot be empty")
	}

	if len(filename) > 255 {
		return fmt.Errorf("filename too long (max 255 characters)")
	}

	// Check for dangerous characters
	dangerousChars := []string{"../", "..\\", "<", ">", ":", "\"", "|", "?", "*"}
	for _, char := range dangerousChars {
		if strings.Contains(filename, char) {
			return fmt.Errorf("filename contains illegal character: %s", char)
		}
	}

	// Check for reserved names (Windows)
	reservedNames := []string{
		"CON", "PRN", "AUX", "NUL",
		"COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
		"LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9",
	}

	baseName := strings.ToUpper(strings.TrimSuffix(filename, filepath.Ext(filename)))
	for _, reserved := range reservedNames {
		if baseName == reserved {
			return fmt.Errorf("filename uses reserved name: %s", reserved)
		}
	}

	return nil
}

// SanitizeFilename removes dangerous characters from filename
func SanitizeFilename(filename string) string {
	// Replace dangerous characters with underscores
	replacer := strings.NewReplacer(
		" ", "_",
		"/", "_",
		"\\", "_",
		":", "_",
		"*", "_",
		"?", "_",
		"\"", "_",
		"<", "_",
		">", "_",
		"|", "_",
		"\n", "_",
		"\r", "_",
		"\t", "_",
	)

	sanitized := replacer.Replace(filename)

	// Remove any remaining control characters
	var result strings.Builder
	for _, r := range sanitized {
		if r >= 32 && r < 127 { // Printable ASCII characters
			result.WriteRune(r)
		} else {
			result.WriteRune('_')
		}
	}

	sanitized = result.String()

	// Ensure it doesn't start or end with dots or spaces
	sanitized = strings.Trim(sanitized, ". ")

	// Ensure it's not empty after sanitization
	if sanitized == "" {
		sanitized = "unnamed_file"
	}

	return sanitized
}

// GetContentTypeFromExtension returns MIME type based on file extension
func GetContentTypeFromExtension(ext string) string {
	ext = strings.ToLower(ext)
	mimeTypes := map[string]string{
		".jpg":  "image/jpeg",
		".jpeg": "image/jpeg",
		".png":  "image/png",
		".gif":  "image/gif",
		".webp": "image/webp",
		".svg":  "image/svg+xml",
		".pdf":  "application/pdf",
		".txt":  "text/plain",
		".csv":  "text/csv",
		".json": "application/json",
		".xml":  "application/xml",
		".zip":  "application/zip",
		".doc":  "application/msword",
		".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".xls":  "application/vnd.ms-excel",
		".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	}

	if mimeType, exists := mimeTypes[ext]; exists {
		return mimeType
	}

	return "application/octet-stream"
}

// ValidatePageSize ensures page size is within acceptable bounds
func ValidatePageSize(pageSize int) int {
	if pageSize < 1 {
		return 10 // default
	}
	if pageSize > 100 {
		return 100 // maximum
	}
	return pageSize
}

// ValidatePage ensures page number is positive
func ValidatePage(page int) int {
	if page < 1 {
		return 1
	}
	return page
}
