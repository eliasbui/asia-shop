package handlers

import (
	"fmt"
	"net/http"

	"github.com/MarceloPetrucio/go-scalar-api-reference"
	"github.com/gin-gonic/gin"

	"storage-service/internal/config"
)

// NewDocsHandler creates a handler for serving API documentation using Scalar
func NewDocsHandler(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Determine the base URL for the OpenAPI spec
		scheme := "http"
		if c.Request.TLS != nil {
			scheme = "https"
		}

		host := c.Request.Host
		if host == "" {
			host = "localhost:8080"
		}

		specURL := fmt.Sprintf("%s://%s/docs/openapi.json", scheme, host)

		// Generate the HTML content using Scalar
		htmlContent, err := scalar.ApiReferenceHTML(&scalar.Options{
			SpecURL: specURL,
			CustomOptions: scalar.CustomOptions{
				PageTitle: "AsiaShop Storage Service API Documentation",
			},
			DarkMode: true,
			Theme:    scalar.ThemeKepler,
			Layout:   scalar.LayoutModern,
		})

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "DOCS_ERROR",
					"message": "Failed to generate API documentation",
					"details": err.Error(),
				},
			})
			return
		}

		// Set content type and return HTML
		c.Header("Content-Type", "text/html; charset=utf-8")
		c.String(http.StatusOK, htmlContent)
	}
}

// NewOpenAPISpecHandler serves the OpenAPI specification JSON file
func NewOpenAPISpecHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Serve the OpenAPI spec file directly
		c.File("./docs/openapi.json")
	}
}
