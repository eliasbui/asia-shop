package config

import (
	"strings"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	App       AppConfig         `mapstructure:"app"`
	Database  DatabaseConfig    `mapstructure:"database"`
	MinIO     MinIOConfig       `mapstructure:"minio"`
	JWT       ExternalJWTConfig `mapstructure:"jwt"`
	RateLimit RateLimitConfig   `mapstructure:"rate_limit"`
	Log       LogConfig         `mapstructure:"log"`
}

type AppConfig struct {
	Environment string `mapstructure:"environment"`
	Port        string `mapstructure:"port"`
	Version     string `mapstructure:"version"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Username string `mapstructure:"username"`
	Password string `mapstructure:"password"`
	Database string `mapstructure:"database"`
}

type MinIOConfig struct {
	Endpoint   string `mapstructure:"endpoint"`
	AccessKey  string `mapstructure:"access_key"`
	SecretKey  string `mapstructure:"secret_key"`
	UseSSL     bool   `mapstructure:"use_ssl"`
	BucketName string `mapstructure:"bucket_name"`
	Region     string `mapstructure:"region"`
}

type ExternalJWTConfig struct {
	Issuers           []IdentityProvider `mapstructure:"issuers"`
	JWKSCacheTTL      time.Duration      `mapstructure:"jwks_cache_ttl"`
	AllowedAlgorithms []string           `mapstructure:"allowed_algorithms"`
	ClockSkew         time.Duration      `mapstructure:"clock_skew"`
}

type IdentityProvider struct {
	Name          string   `mapstructure:"name"`
	Issuer        string   `mapstructure:"issuer"`
	Audience      []string `mapstructure:"audience"`
	JWKSURL       string   `mapstructure:"jwks_url"`
	UsernameClaim string   `mapstructure:"username_claim"`
	RolesClaim    string   `mapstructure:"roles_claim"`
}

type RateLimitConfig struct {
	RequestsPerMinute int      `mapstructure:"requests_per_minute"`
	BurstSize         int      `mapstructure:"burst_size"`
	IPWhitelist       []string `mapstructure:"ip_whitelist"`
	EnableRedis       bool     `mapstructure:"enable_redis"`
	UserBasedLimit    bool     `mapstructure:"user_based_limit"`
}

type LogConfig struct {
	Level         string `mapstructure:"level"`
	Format        string `mapstructure:"format"`
	OutputFile    string `mapstructure:"output_file"`
	OutputConsole bool   `mapstructure:"output_console"`
	MaxSize       int    `mapstructure:"max_size"`
	MaxAge        int    `mapstructure:"max_age"`
	MaxBackups    int    `mapstructure:"max_backups"`
	Compress      bool   `mapstructure:"compress"`
}

func Load() (*Config, error) {
	// Set defaults first
	setDefaults()

	// Load from .env file
	loadEnvFile()

	// Load from YAML config file
	viper.SetConfigName("app")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath(".")

	// Read config file (optional - will use defaults and env if not found)
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, err
		}
	}

	// Setup environment variable binding with prefixes
	setupEnvBinding()

	// Bind environment variables automatically
	viper.AutomaticEnv()

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	return &config, nil
}

// loadEnvFile loads environment variables from .env file
func loadEnvFile() {
	// Try to load .env file
	viper.SetConfigFile(".env")
	viper.SetConfigType("env")

	// Read .env file if it exists (optional)
	if err := viper.ReadInConfig(); err == nil {
		// Successfully loaded .env file
		return
	}

	// If .env file doesn't exist, try other locations
	viper.AddConfigPath(".")
	viper.AddConfigPath("./configs")
	viper.SetConfigName(".env")
	viper.ReadInConfig() // Ignore errors - .env is optional
}

// setupEnvBinding sets up environment variable binding with proper prefixes
func setupEnvBinding() {
	// Replace dots and dashes with underscores for environment variables
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_", "-", "_"))

	// Bind specific environment variables with different naming conventions
	envMappings := map[string]string{
		// App config
		"app.environment": "APP_ENV",
		"app.port":        "PORT",
		"app.version":     "APP_VERSION",

		// Database config
		"database.host":     "DB_HOST",
		"database.port":     "DB_PORT",
		"database.username": "DB_USER",
		"database.password": "DB_PASSWORD",
		"database.database": "DB_NAME",

		// MinIO config
		"minio.endpoint":    "MINIO_ENDPOINT",
		"minio.access_key":  "MINIO_ACCESS_KEY",
		"minio.secret_key":  "MINIO_SECRET_KEY",
		"minio.use_ssl":     "MINIO_USE_SSL",
		"minio.bucket_name": "MINIO_BUCKET_NAME",
		"minio.region":      "MINIO_REGION",

		// JWT config
		"jwt.jwks_cache_ttl": "JWT_JWKS_CACHE_TTL",
		"jwt.jwks_timeout":   "JWT_JWKS_TIMEOUT",
		"jwt.clock_skew":     "JWT_CLOCK_SKEW",

		// Rate limit config
		"rate_limit.requests_per_minute": "RATE_LIMIT_REQUESTS_PER_MINUTE",
		"rate_limit.burst_size":          "RATE_LIMIT_BURST_SIZE",
		"rate_limit.enable_redis":        "RATE_LIMIT_ENABLE_REDIS",
		"rate_limit.user_based_limit":    "RATE_LIMIT_USER_BASED_LIMIT",

		// Log config
		"log.level":          "LOG_LEVEL",
		"log.format":         "LOG_FORMAT",
		"log.output_file":    "LOG_OUTPUT_FILE",
		"log.output_console": "LOG_OUTPUT_CONSOLE",
		"log.max_size":       "LOG_MAX_SIZE",
		"log.max_age":        "LOG_MAX_AGE",
		"log.max_backups":    "LOG_MAX_BACKUPS",
		"log.compress":       "LOG_COMPRESS",
	}

	// Bind each environment variable
	for configKey, envKey := range envMappings {
		viper.BindEnv(configKey, envKey)
	}
}

func setDefaults() {
	// App defaults
	viper.SetDefault("app.environment", "development")
	viper.SetDefault("app.port", "8080")
	viper.SetDefault("app.version", "1.0.0")

	// Database defaults
	viper.SetDefault("database.host", "localhost")
	viper.SetDefault("database.port", 3306)
	viper.SetDefault("database.username", "root")
	viper.SetDefault("database.password", "password")
	viper.SetDefault("database.database", "storage_service")

	// MinIO defaults
	viper.SetDefault("minio.endpoint", "localhost:9000")
	viper.SetDefault("minio.access_key", "minioadmin")
	viper.SetDefault("minio.secret_key", "minioadmin")
	viper.SetDefault("minio.use_ssl", false)
	viper.SetDefault("minio.bucket_name", "files")
	viper.SetDefault("minio.region", "us-east-1")

	// JWT defaults
	viper.SetDefault("jwt.jwks_cache_ttl", "1h")
	viper.SetDefault("jwt.jwks_timeout", "10s")
	viper.SetDefault("jwt.allowed_algorithms", []string{"RS256", "ES256"})
	viper.SetDefault("jwt.clock_skew", "5m")

	// Rate limit defaults
	viper.SetDefault("rate_limit.requests_per_minute", 100)
	viper.SetDefault("rate_limit.burst_size", 10)
	viper.SetDefault("rate_limit.user_based_limit", true)

	// Log defaults
	viper.SetDefault("log.level", "info")
	viper.SetDefault("log.format", "json")
	viper.SetDefault("log.output_file", "logs/app.log")
	viper.SetDefault("log.output_console", true)
	viper.SetDefault("log.max_size", 100)
	viper.SetDefault("log.max_age", 30)
	viper.SetDefault("log.max_backups", 5)
	viper.SetDefault("log.compress", true)
}
