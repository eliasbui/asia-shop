package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"storage-service/pkg/logger"
)

func Logger(log *logger.Logger) gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		// Generate request ID if not exists
		requestID := param.Keys["request_id"]
		if requestID == nil {
			requestID = uuid.New().String()
		}

		// Extract user context if available
		userID := param.Keys["user_id"]
		issuer := param.Keys["issuer"]

		entry := log.WithHTTPContext(
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency.String(),
		)

		entry = entry.WithField("request_id", requestID.(string))

		if userID != nil && issuer != nil {
			entry = entry.WithFields(map[string]interface{}{
				"user_id": userID.(string),
				"issuer":  issuer.(string),
			})
		}

		entry.Info("HTTP Request")
		return ""
	})
}

func Recovery() gin.HandlerFunc {
	return gin.Recovery()
}

func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String()
		}
		c.Set("request_id", requestID)
		c.Header("X-Request-ID", requestID)
		c.Next()
	}
}
