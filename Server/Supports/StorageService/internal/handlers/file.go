package handlers

import (
	"crypto/md5"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"

	"storage-service/internal/models"
	"storage-service/internal/services"
	"storage-service/internal/utils"
	"storage-service/pkg/logger"
)

type FileUploadRequest struct {
	IsPublic bool   `form:"is_public"`
	Metadata string `form:"metadata"`
}

type FileResponse struct {
	ID           string                 `json:"id"`
	OriginalName string                 `json:"original_name"`
	StoredName   string                 `json:"stored_name"`
	FileSize     int64                  `json:"file_size"`
	MimeType     string                 `json:"mime_type"`
	IsPublic     bool                   `json:"is_public"`
	Metadata     map[string]interface{} `json:"metadata"`
	CreatedAt    string                 `json:"created_at"`
	UpdatedAt    string                 `json:"updated_at"`
	DownloadURL  string                 `json:"download_url,omitempty"`
}

type FileListResponse struct {
	Files []FileResponse `json:"files"`
}

func NewFileUploadHandler(minioService *services.MinIOService, db *gorm.DB, logger *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)
		if userID == uuid.Nil {
			utils.UnauthorizedError(c, "User not authenticated")
			return
		}

		// Parse multipart form
		err := c.Request.ParseMultipartForm(minioService.GetMaxFileSize())
		if err != nil {
			logger.WithField("error", err.Error()).Error("Failed to parse multipart form")
			utils.BadRequestError(c, "Failed to parse form data", err.Error())
			return
		}

		// Get file from form
		fileHeader, err := c.FormFile("file")
		if err != nil {
			utils.BadRequestError(c, "Missing file in form data", err.Error())
			return
		}

		// Validate file
		if err := validateFileUpload(fileHeader, minioService); err != nil {
			utils.BadRequestError(c, "File validation failed", err.Error())
			return
		}

		// Parse additional form data
		var request FileUploadRequest
		if err := c.ShouldBind(&request); err != nil {
			utils.BadRequestError(c, "Invalid form data", err.Error())
			return
		}

		// Open uploaded file
		file, err := fileHeader.Open()
		if err != nil {
			logger.WithField("error", err.Error()).Error("Failed to open uploaded file")
			utils.InternalServerError(c, "Failed to process uploaded file")
			return
		}
		defer file.Close()

		// Calculate checksum
		checksum, err := calculateChecksum(file)
		if err != nil {
			logger.WithField("error", err.Error()).Error("Failed to calculate file checksum")
			utils.InternalServerError(c, "Failed to process file")
			return
		}

		// Reset file pointer
		file.Seek(0, io.SeekStart)

		// Generate object name
		objectName := minioService.GenerateObjectName(userID.String(), fileHeader.Filename)

		// Prepare metadata
		metadata := map[string]string{
			"user_id":       userID.String(),
			"original_name": fileHeader.Filename,
			"checksum":      checksum,
		}

		// Upload to MinIO
		uploadResult, err := minioService.UploadFile(
			c.Request.Context(),
			objectName,
			file,
			fileHeader.Size,
			fileHeader.Header.Get("Content-Type"),
			metadata,
		)
		if err != nil {
			logger.WithFields(map[string]interface{}{
				"user_id":  userID,
				"filename": fileHeader.Filename,
				"error":    err.Error(),
			}).Error("Failed to upload file to MinIO")
			utils.InternalServerError(c, "Failed to upload file")
			return
		}

		// Create file record in database
		fileModel := &models.File{
			ID:           uuid.New(),
			UserID:       userID,
			OriginalName: fileHeader.Filename,
			StoredName:   objectName,
			FilePath:     uploadResult.Location,
			FileSize:     uploadResult.Size,
			MimeType:     fileHeader.Header.Get("Content-Type"),
			Checksum:     checksum,
			BucketName:   minioService.GetBucketName(),
			IsPublic:     request.IsPublic,
		}

		// Parse metadata JSON if provided
		if request.Metadata != "" {
			// Validate JSON and convert to json.RawMessage
			var temp interface{}
			if err := json.Unmarshal([]byte(request.Metadata), &temp); err != nil {
				logger.WithFields(map[string]interface{}{
					"user_id":  userID,
					"metadata": request.Metadata,
					"error":    err.Error(),
				}).Warn("Invalid metadata JSON provided")
				utils.BadRequestError(c, "Invalid metadata JSON", err.Error())
				return
			}
			fileModel.Metadata = datatypes.JSON(json.RawMessage(request.Metadata))
		}

		if err := db.Create(fileModel).Error; err != nil {
			// Clean up uploaded file from MinIO on database error
			if deleteErr := minioService.DeleteFile(c.Request.Context(), objectName); deleteErr != nil {
				logger.WithField("cleanup_error", deleteErr.Error()).Warn("Failed to cleanup uploaded file after database error")
			}
			logger.WithFields(map[string]interface{}{
				"user_id":  userID,
				"filename": fileHeader.Filename,
				"error":    err.Error(),
			}).Error("Failed to save file metadata to database")
			utils.InternalServerError(c, "Failed to save file metadata")
			return
		}

		// Prepare response
		response := mapFileToResponse(fileModel, "")

		logger.WithFields(map[string]interface{}{
			"user_id":   userID,
			"file_id":   fileModel.ID,
			"filename":  fileHeader.Filename,
			"file_size": uploadResult.Size,
		}).Info("File uploaded successfully")

		utils.SuccessResponseWithStatus(c, http.StatusCreated, response)
	}
}

func NewMultiFileUploadHandler(minioService *services.MinIOService, db *gorm.DB, logger *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)
		if userID == uuid.Nil {
			utils.UnauthorizedError(c, "User not authenticated")
			return
		}

		// Parse multipart form
		err := c.Request.ParseMultipartForm(minioService.GetMaxFileSize())
		if err != nil {
			utils.BadRequestError(c, "Failed to parse form data", err.Error())
			return
		}

		form := c.Request.MultipartForm
		files := form.File["files"]

		if len(files) == 0 {
			utils.BadRequestError(c, "No files provided")
			return
		}

		if len(files) > 10 { // Limit to 10 files per request
			utils.BadRequestError(c, "Too many files. Maximum 10 files per request")
			return
		}

		var uploadedFiles []FileResponse
		var failedFiles []string

		// Parse form data
		isPublic, _ := strconv.ParseBool(c.PostForm("is_public"))

		for _, fileHeader := range files {
			// Validate file
			if err := validateFileUpload(fileHeader, minioService); err != nil {
				failedFiles = append(failedFiles, fmt.Sprintf("%s: %s", fileHeader.Filename, err.Error()))
				continue
			}

			// Process each file
			fileResponse, err := processFileUpload(c, fileHeader, userID, isPublic, minioService, db, logger)
			if err != nil {
				failedFiles = append(failedFiles, fmt.Sprintf("%s: %s", fileHeader.Filename, err.Error()))
				continue
			}

			uploadedFiles = append(uploadedFiles, *fileResponse)
		}

		response := gin.H{
			"uploaded_files": uploadedFiles,
			"uploaded_count": len(uploadedFiles),
			"total_files":    len(files),
		}

		if len(failedFiles) > 0 {
			response["failed_files"] = failedFiles
			response["failed_count"] = len(failedFiles)
		}

		logger.WithFields(map[string]interface{}{
			"user_id":        userID,
			"uploaded_count": len(uploadedFiles),
			"failed_count":   len(failedFiles),
		}).Info("Multi-file upload completed")

		utils.SuccessResponseWithStatus(c, http.StatusCreated, response)
	}
}

func NewFileListHandler(db *gorm.DB, logger *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)
		if userID == uuid.Nil {
			utils.UnauthorizedError(c, "User not authenticated")
			return
		}

		// Parse query parameters
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
		search := c.Query("search")
		mimeType := c.Query("mime_type")

		// Validate pagination parameters
		if page < 1 {
			page = 1
		}
		if pageSize < 1 || pageSize > 100 {
			pageSize = 20
		}

		// Build query
		query := db.Model(&models.File{}).Where("user_id = ?", userID)

		// Apply filters
		if search != "" {
			query = query.Where("original_name LIKE ?", "%"+search+"%")
		}

		if mimeType != "" {
			if strings.Contains(mimeType, "/") {
				// Exact mime type
				query = query.Where("mime_type = ?", mimeType)
			} else {
				// Mime type category (e.g., "image")
				query = query.Where("mime_type LIKE ?", mimeType+"/%")
			}
		}

		// Get total count
		var total int64
		if err := query.Count(&total).Error; err != nil {
			logger.WithField("error", err.Error()).Error("Failed to count files")
			utils.InternalServerError(c, "Failed to retrieve files")
			return
		}

		// Get files with pagination
		var files []models.File
		offset := (page - 1) * pageSize
		if err := query.Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&files).Error; err != nil {
			logger.WithField("error", err.Error()).Error("Failed to retrieve files")
			utils.InternalServerError(c, "Failed to retrieve files")
			return
		}

		// Map to response format
		var fileResponses []FileResponse
		for _, file := range files {
			fileResponses = append(fileResponses, mapFileToResponse(&file, ""))
		}

		// Calculate pagination
		pagination := utils.CalculatePagination(page, pageSize, total)

		logger.WithFields(map[string]interface{}{
			"user_id":    userID,
			"page":       page,
			"page_size":  pageSize,
			"total":      total,
			"file_count": len(fileResponses),
		}).Info("File list retrieved")

		utils.PaginatedSuccessResponse(c, FileListResponse{Files: fileResponses}, pagination)
	}
}

func NewFileGetHandler(minioService *services.MinIOService, db *gorm.DB, logger *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		fileID := c.Param("id")

		if fileID == "" {
			utils.BadRequestError(c, "File ID is required")
			return
		}

		// Find file
		var file models.File
		query := db.Where("id = ?", fileID)

		if err := query.First(&file).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				utils.NotFoundError(c, "File not found")
				return
			}
			logger.WithField("error", err.Error()).Error("Failed to retrieve file")
			utils.InternalServerError(c, "Failed to retrieve file")
			return
		}

		// Generate download URL if requested
		var downloadURL string
		if c.Query("include_download_url") == "true" {
			url, err := minioService.GetPresignedURL(c.Request.Context(), file.StoredName, 3600) // 1 hour
			if err != nil {
				logger.WithField("error", err.Error()).Warn("Failed to generate download URL")
			} else {
				downloadURL = url
			}
		}

		response := mapFileToResponse(&file, downloadURL)

		utils.SuccessResponse(c, response)
	}
}

func NewFileDownloadHandler(minioService *services.MinIOService, db *gorm.DB, logger *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)
		fileID := c.Param("id")

		if fileID == "" {
			utils.BadRequestError(c, "File ID is required")
			return
		}

		// Find file
		var file models.File
		query := db.Where("id = ?", fileID)
		if err := query.First(&file).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				utils.NotFoundError(c, "File not found")
				return
			}
			utils.InternalServerError(c, "Failed to retrieve file")
			return
		}

		// Get file from MinIO
		object, err := minioService.DownloadFile(c.Request.Context(), file.StoredName)
		if err != nil {
			logger.WithFields(map[string]interface{}{
				"file_id":     fileID,
				"stored_name": file.StoredName,
				"error":       err.Error(),
			}).Error("Failed to download file from storage")
			utils.InternalServerError(c, "Failed to download file")
			return
		}
		defer object.Close()

		// Set response headers
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", file.OriginalName))
		c.Header("Content-Type", file.MimeType)
		c.Header("Content-Length", strconv.FormatInt(file.FileSize, 10))

		// Stream file content
		if _, err := io.Copy(c.Writer, object); err != nil {
			logger.WithField("error", err.Error()).Error("Failed to stream file content")
			return
		}

		logger.WithFields(map[string]interface{}{
			"user_id":   userID,
			"file_id":   fileID,
			"filename":  file.OriginalName,
			"file_size": file.FileSize,
		}).Info("File downloaded successfully")
	}
}

func NewFileUpdateHandler(db *gorm.DB, logger *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)
		fileID := c.Param("id")

		if fileID == "" {
			utils.BadRequestError(c, "File ID is required")
			return
		}

		var request struct {
			OriginalName *string                `json:"original_name"`
			IsPublic     *bool                  `json:"is_public"`
			Metadata     map[string]interface{} `json:"metadata"`
		}

		if err := c.ShouldBindJSON(&request); err != nil {
			utils.BadRequestError(c, "Invalid request data", err.Error())
			return
		}

		// Find file
		var file models.File
		query := db.Where("id = ? AND user_id = ?", fileID, userID)

		if err := query.First(&file).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				utils.NotFoundError(c, "File not found")
				return
			}
			utils.InternalServerError(c, "Failed to retrieve file")
			return
		}

		// Update fields
		updates := make(map[string]interface{})

		if request.OriginalName != nil {
			updates["original_name"] = *request.OriginalName
		}

		if request.IsPublic != nil {
			updates["is_public"] = *request.IsPublic
		}

		if request.Metadata != nil {
			updates["metadata"] = request.Metadata
		}

		if len(updates) == 0 {
			utils.BadRequestError(c, "No fields to update")
			return
		}

		// Update file
		if err := db.Model(&file).Updates(updates).Error; err != nil {
			logger.WithField("error", err.Error()).Error("Failed to update file")
			utils.InternalServerError(c, "Failed to update file")
			return
		}

		// Reload file to get updated data
		db.First(&file, "id = ?", fileID)

		response := mapFileToResponse(&file, "")

		logger.WithFields(map[string]interface{}{
			"user_id": userID,
			"file_id": fileID,
			"updates": updates,
		}).Info("File updated successfully")

		utils.SuccessResponse(c, response)
	}
}

func NewFileDeleteHandler(minioService *services.MinIOService, db *gorm.DB, logger *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := utils.GetUserID(c)
		fileID := c.Param("id")

		if fileID == "" {
			utils.BadRequestError(c, "File ID is required")
			return
		}

		// Find file
		var file models.File
		query := db.Where("id = ? AND user_id = ?", fileID, userID)

		if err := query.First(&file).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				utils.NotFoundError(c, "File not found")
				return
			}
			utils.InternalServerError(c, "Failed to retrieve file")
			return
		}

		// Delete from MinIO first
		if err := minioService.DeleteFile(c.Request.Context(), file.StoredName); err != nil {
			logger.WithFields(map[string]interface{}{
				"file_id":     fileID,
				"stored_name": file.StoredName,
				"error":       err.Error(),
			}).Error("Failed to delete file from storage")
			utils.InternalServerError(c, "Failed to delete file")
			return
		}

		// Delete from database
		if err := db.Delete(&file).Error; err != nil {
			logger.WithField("error", err.Error()).Error("Failed to delete file from database")
			utils.InternalServerError(c, "Failed to delete file")
			return
		}

		logger.WithFields(map[string]interface{}{
			"user_id":  userID,
			"file_id":  fileID,
			"filename": file.OriginalName,
		}).Info("File deleted successfully")

		utils.SuccessResponse(c, gin.H{
			"message": "File deleted successfully",
			"file_id": fileID,
		})
	}
}

// Helper functions
func validateFileUpload(fileHeader *multipart.FileHeader, minioService *services.MinIOService) error {
	// Check file size
	if fileHeader.Size > minioService.GetMaxFileSize() {
		return fmt.Errorf("file size exceeds maximum allowed size of %d bytes", minioService.GetMaxFileSize())
	}

	if fileHeader.Size == 0 {
		return fmt.Errorf("file is empty")
	}

	// Check content type
	contentType := fileHeader.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	if !minioService.ValidateContentType(contentType) {
		return fmt.Errorf("file type '%s' is not allowed", contentType)
	}

	// Check file extension
	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	allowedExts := []string{
		".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
		".pdf", ".txt", ".csv", ".json", ".xml",
		".zip", ".doc", ".docx", ".xls", ".xlsx",
	}

	validExt := false
	for _, allowedExt := range allowedExts {
		if ext == allowedExt {
			validExt = true
			break
		}
	}

	if !validExt {
		return fmt.Errorf("file extension '%s' is not allowed", ext)
	}

	return nil
}

func calculateChecksum(file multipart.File) (string, error) {
	hash := md5.New()
	if _, err := io.Copy(hash, file); err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", hash.Sum(nil)), nil
}

func processFileUpload(c *gin.Context, fileHeader *multipart.FileHeader, userID uuid.UUID, isPublic bool, minioService *services.MinIOService, db *gorm.DB, logger *logger.Logger) (*FileResponse, error) {
	// Open file
	file, err := fileHeader.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer func(file multipart.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)

	// Calculate checksum
	checksum, err := calculateChecksum(file)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate checksum: %w", err)
	}

	// Reset file pointer
	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		return nil, err
	}

	// Generate object name
	objectName := minioService.GenerateObjectName(userID.String(), fileHeader.Filename)

	// Prepare metadata
	metadata := map[string]string{
		"user_id":       userID.String(),
		"original_name": fileHeader.Filename,
		"checksum":      checksum,
	}

	// Upload to MinIO
	uploadResult, err := minioService.UploadFile(
		c.Request.Context(),
		objectName,
		file,
		fileHeader.Size,
		fileHeader.Header.Get("Content-Type"),
		metadata,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to upload to storage: %w", err)
	}

	// Create file record
	fileModel := &models.File{
		ID:           uuid.New(),
		UserID:       userID,
		OriginalName: fileHeader.Filename,
		StoredName:   objectName,
		FilePath:     uploadResult.Location,
		FileSize:     uploadResult.Size,
		MimeType:     fileHeader.Header.Get("Content-Type"),
		Checksum:     checksum,
		BucketName:   minioService.GetBucketName(),
		IsPublic:     isPublic,
	}

	if err := db.Create(fileModel).Error; err != nil {
		// Clean up uploaded file
		err := minioService.DeleteFile(c.Request.Context(), objectName)
		if err != nil {
			return nil, err
		}
		return nil, fmt.Errorf("failed to save metadata: %w", err)
	}

	response := mapFileToResponse(fileModel, "")
	return &response, nil
}

func mapFileToResponse(file *models.File, downloadURL string) FileResponse {
	response := FileResponse{
		ID:           file.ID.String(),
		OriginalName: file.OriginalName,
		StoredName:   file.StoredName,
		FileSize:     file.FileSize,
		MimeType:     file.MimeType,
		IsPublic:     file.IsPublic,
		CreatedAt:    file.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:    file.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}

	if downloadURL != "" {
		response.DownloadURL = downloadURL
	}

	// Handle metadata JSON - initialize empty map if nil
	response.Metadata = make(map[string]interface{})
	if file.Metadata != nil {
		// GORM datatypes.JSON will automatically unmarshal into interface{}
		// We just need to type assert if needed
		var metadata map[string]interface{}
		if err := json.Unmarshal(file.Metadata, &metadata); err == nil {
			response.Metadata = metadata
		}
	}

	return response
}
