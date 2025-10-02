package config

import (
	"fmt"
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
	JWKSTimeout       time.Duration      `mapstructure:"jwks_timeout"`
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
	// Set config file
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./configs")

	// Read config file
	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	// Enable automatic environment variable reading
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return &config, nil
}

