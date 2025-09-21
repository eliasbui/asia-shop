package logger

import (
	"io"
	"os"
	"path/filepath"

	"github.com/sirupsen/logrus"
	"gopkg.in/natefinch/lumberjack.v2"

	"storage-service/internal/config"
)

type Logger struct {
	*logrus.Logger
}

func NewLogger(config config.LogConfig) (*Logger, error) {
	log := logrus.New()

	// Set log level
	level, err := logrus.ParseLevel(config.Level)
	if err != nil {
		return nil, err
	}
	log.SetLevel(level)

	// Set format
	if config.Format == "json" {
		log.SetFormatter(&logrus.JSONFormatter{
			TimestampFormat: "2006-01-02T15:04:05.000Z07:00",
		})
	} else {
		log.SetFormatter(&logrus.TextFormatter{
			FullTimestamp:   true,
			TimestampFormat: "2006-01-02 15:04:05",
		})
	}

	// Create logs directory if it doesn't exist
	if config.OutputFile != "" {
		if err := os.MkdirAll(filepath.Dir(config.OutputFile), 0755); err != nil {
			return nil, err
		}

		// Setup log rotation
		logFile := &lumberjack.Logger{
			Filename:   config.OutputFile,
			MaxSize:    config.MaxSize,    // MB
			MaxAge:     config.MaxAge,     // days
			MaxBackups: config.MaxBackups, // files
			Compress:   config.Compress,
		}

		if config.OutputConsole {
			// Output to both file and console
			log.SetOutput(io.MultiWriter(os.Stdout, logFile))
		} else {
			// Output only to file
			log.SetOutput(logFile)
		}
	}

	return &Logger{log}, nil
}

func (l *Logger) WithRequestID(requestID string) *logrus.Entry {
	return l.WithField("request_id", requestID)
}

func (l *Logger) WithUserContext(userID, issuer string) *logrus.Entry {
	return l.WithFields(logrus.Fields{
		"user_id": userID,
		"issuer":  issuer,
	})
}

func (l *Logger) WithHTTPContext(method, path string, statusCode int, responseTime string) *logrus.Entry {
	return l.WithFields(logrus.Fields{
		"method":        method,
		"path":          path,
		"status_code":   statusCode,
		"response_time": responseTime,
	})
}
