package handlers

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"storage-service/internal/config"
	"storage-service/internal/middleware"
	"storage-service/internal/services"
	"storage-service/pkg/logger"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB, cfg *config.Config, log *logger.Logger) {
	// Initialize services
	minioService, err := services.NewMinIOService(cfg.MinIO, log)
	if err != nil {
		log.Fatal("Failed to initialize MinIO service:", err)
	}

	// Initialize JWT middleware
	jwtMiddleware := middleware.NewJWTMiddleware(&cfg.JWT, log)

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// JWT protected routes
		protected := v1.Group("/")
		protected.Use(jwtMiddleware.ValidateJWT())
		{
			files := protected.Group("/files")
			{
				files.POST("/upload", NewFileUploadHandler(minioService, db, log))
				files.POST("/multi-upload", NewMultiFileUploadHandler(minioService, db, log))
				files.GET("", NewFileListHandler(db, log))
				files.GET("/:id", NewFileGetHandler(minioService, db, log))
				files.GET("/:id/download", NewFileDownloadHandler(minioService, db, log))
				files.PUT("/:id", NewFileUpdateHandler(db, log))
				files.DELETE("/:id", NewFileDeleteHandler(minioService, db, log))
			}
		}
	}

	// Documentation endpoints (no JWT required)
	router.GET("/docs", NewDocsHandler(cfg))
	router.GET("/docs/openapi.json", NewOpenAPISpecHandler())
}
