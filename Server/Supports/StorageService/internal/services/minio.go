package services

import (
	"context"
	"fmt"
	"io"
	"path/filepath"
	"strings"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"

	"storage-service/internal/config"
	"storage-service/pkg/logger"
)

type MinIOService struct {
	client     *minio.Client
	bucketName string
	config     config.MinIOConfig
	logger     *logger.Logger
}

type FileUploadResult struct {
	ObjectName string
	Size       int64
	ETag       string
	Location   string
}

func NewMinIOService(config config.MinIOConfig, logger *logger.Logger) (*MinIOService, error) {
	// Initialize MinIO client
	client, err := minio.New(config.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(config.AccessKey, config.SecretKey, ""),
		Secure: config.UseSSL,
		Region: config.Region,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize MinIO client: %w", err)
	}

	service := &MinIOService{
		client:     client,
		bucketName: config.BucketName,
		config:     config,
		logger:     logger,
	}

	// Ensure bucket exists
	if err := service.ensureBucket(context.Background()); err != nil {
		return nil, fmt.Errorf("failed to ensure bucket exists: %w", err)
	}

	return service, nil
}

func (s *MinIOService) ensureBucket(ctx context.Context) error {
	exists, err := s.client.BucketExists(ctx, s.bucketName)
	if err != nil {
		return fmt.Errorf("failed to check bucket existence: %w", err)
	}

	if !exists {
		err = s.client.MakeBucket(ctx, s.bucketName, minio.MakeBucketOptions{
			Region: s.config.Region,
		})
		if err != nil {
			return fmt.Errorf("failed to create bucket: %w", err)
		}
		s.logger.WithField("bucket", s.bucketName).Info("MinIO bucket created")
	}

	return nil
}

func (s *MinIOService) UploadFile(ctx context.Context, objectName string, reader io.Reader, size int64, contentType string, metadata map[string]string) (*FileUploadResult, error) {
	// Set default content type if not provided
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	// Prepare upload options
	options := minio.PutObjectOptions{
		ContentType:  contentType,
		UserMetadata: metadata,
	}

	// Upload the file
	info, err := s.client.PutObject(ctx, s.bucketName, objectName, reader, size, options)
	if err != nil {
		s.logger.WithFields(map[string]interface{}{
			"object_name":  objectName,
			"bucket":       s.bucketName,
			"content_type": contentType,
			"size":         size,
			"error":        err.Error(),
		}).Error("Failed to upload file to MinIO")
		return nil, fmt.Errorf("failed to upload file: %w", err)
	}

	result := &FileUploadResult{
		ObjectName: objectName,
		Size:       info.Size,
		ETag:       info.ETag,
		Location:   fmt.Sprintf("%s/%s/%s", s.getEndpointURL(), s.bucketName, objectName),
	}

	s.logger.WithFields(map[string]interface{}{
		"object_name": objectName,
		"bucket":      s.bucketName,
		"size":        info.Size,
		"etag":        info.ETag,
	}).Info("File uploaded successfully to MinIO")

	return result, nil
}

func (s *MinIOService) DownloadFile(ctx context.Context, objectName string) (*minio.Object, error) {
	object, err := s.client.GetObject(ctx, s.bucketName, objectName, minio.GetObjectOptions{})
	if err != nil {
		s.logger.WithFields(map[string]interface{}{
			"object_name": objectName,
			"bucket":      s.bucketName,
			"error":       err.Error(),
		}).Error("Failed to download file from MinIO")
		return nil, fmt.Errorf("failed to download file: %w", err)
	}

	return object, nil
}

func (s *MinIOService) DeleteFile(ctx context.Context, objectName string) error {
	err := s.client.RemoveObject(ctx, s.bucketName, objectName, minio.RemoveObjectOptions{})
	if err != nil {
		s.logger.WithFields(map[string]interface{}{
			"object_name": objectName,
			"bucket":      s.bucketName,
			"error":       err.Error(),
		}).Error("Failed to delete file from MinIO")
		return fmt.Errorf("failed to delete file: %w", err)
	}

	s.logger.WithFields(map[string]interface{}{
		"object_name": objectName,
		"bucket":      s.bucketName,
	}).Info("File deleted successfully from MinIO")

	return nil
}

func (s *MinIOService) GetFileInfo(ctx context.Context, objectName string) (*minio.ObjectInfo, error) {
	info, err := s.client.StatObject(ctx, s.bucketName, objectName, minio.StatObjectOptions{})
	if err != nil {
		s.logger.WithFields(map[string]interface{}{
			"object_name": objectName,
			"bucket":      s.bucketName,
			"error":       err.Error(),
		}).Error("Failed to get file info from MinIO")
		return nil, fmt.Errorf("failed to get file info: %w", err)
	}

	return &info, nil
}

func (s *MinIOService) GetPresignedURL(ctx context.Context, objectName string, expirySeconds int64) (string, error) {
	expiry := time.Duration(expirySeconds) * time.Second
	presignedURL, err := s.client.PresignedGetObject(ctx, s.bucketName, objectName, expiry, nil)
	if err != nil {
		s.logger.WithFields(map[string]interface{}{
			"object_name": objectName,
			"bucket":      s.bucketName,
			"expiry":      expiry.String(),
			"error":       err.Error(),
		}).Error("Failed to generate presigned URL")
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	return presignedURL.String(), nil
}

func (s *MinIOService) ListFiles(ctx context.Context, prefix string, recursive bool) ([]minio.ObjectInfo, error) {
	var objects []minio.ObjectInfo

	objectCh := s.client.ListObjects(ctx, s.bucketName, minio.ListObjectsOptions{
		Prefix:    prefix,
		Recursive: recursive,
	})

	for object := range objectCh {
		if object.Err != nil {
			s.logger.WithFields(map[string]interface{}{
				"bucket": s.bucketName,
				"prefix": prefix,
				"error":  object.Err.Error(),
			}).Error("Error listing files from MinIO")
			return nil, fmt.Errorf("failed to list files: %w", object.Err)
		}
		objects = append(objects, object)
	}

	return objects, nil
}

func (s *MinIOService) GenerateObjectName(userID, originalName string) string {
	// Generate a safe object name with user prefix
	ext := filepath.Ext(originalName)
	baseName := strings.TrimSuffix(originalName, ext)

	// Sanitize the base name
	safeName := s.sanitizeFileName(baseName)

	// Add timestamp to prevent conflicts
	timestamp := time.Now().Format("20060102150405")

	return fmt.Sprintf("users/%s/%s_%s%s", userID, safeName, timestamp, ext)
}

func (s *MinIOService) sanitizeFileName(fileName string) string {
	// Remove potentially dangerous characters
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
	)

	return replacer.Replace(fileName)
}

func (s *MinIOService) getEndpointURL() string {
	scheme := "http"
	if s.config.UseSSL {
		scheme = "https"
	}
	return fmt.Sprintf("%s://%s", scheme, s.config.Endpoint)
}

func (s *MinIOService) IsHealthy(ctx context.Context) bool {
	// Simple health check by listing buckets
	_, err := s.client.ListBuckets(ctx)
	return err == nil
}

func (s *MinIOService) GetBucketName() string {
	return s.bucketName
}

// ValidateContentType checks if the content type is allowed
func (s *MinIOService) ValidateContentType(contentType string) bool {
	allowedTypes := []string{
		"image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
		"application/pdf",
		"text/plain", "text/csv",
		"application/json", "application/xml",
		"application/zip", "application/x-zip-compressed",
		"application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	}

	// Handle empty or default content type
	if contentType == "" || contentType == "application/octet-stream" {
		return false // Require explicit content type
	}

	for _, allowedType := range allowedTypes {
		if contentType == allowedType {
			return true
		}
	}
	return false
}

// GetMaxFileSize returns the maximum allowed file size (in bytes)
func (s *MinIOService) GetMaxFileSize() int64 {
	return 100 * 1024 * 1024 // 100MB default
}
