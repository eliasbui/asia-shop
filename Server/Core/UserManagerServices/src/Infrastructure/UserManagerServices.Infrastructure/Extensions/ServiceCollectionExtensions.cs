using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using UserManagerServices.Application.Common.Interfaces;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Interfaces;
using UserManagerServices.Infrastructure.Data;
using UserManagerServices.Infrastructure.Repositories;
using UserManagerServices.Infrastructure.Services;
using Role = UserManagerServices.Domain.Entities.Role;

namespace UserManagerServices.Infrastructure.Extensions;

/// <summary>
/// Extension methods for configuring Infrastructure services in dependency injection container
/// Follows Clean Architecture principles by keeping infrastructure concerns separate
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds Infrastructure layer services to the dependency injection container
    /// </summary>
    /// <param name="services">The service collection</param>
    /// <param name="configuration">Application configuration</param>
    /// <returns>The service collection for chaining</returns>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Add database context with PostgreSQL
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                npgsqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorCodesToAdd: null);
            });

            // Enable sensitive data logging in development
            if (configuration.GetValue<bool>("Logging:EnableSensitiveDataLogging"))
            {
                options.EnableSensitiveDataLogging();
            }

            // Enable detailed errors in development
            if (configuration.GetValue<bool>("Logging:EnableDetailedErrors"))
            {
                options.EnableDetailedErrors();
            }
        });

        // Add Identity services
        services.AddIdentity<User, Role>(options =>
        {
            // Password settings
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequireUppercase = true;
            options.Password.RequiredLength = 8;
            options.Password.RequiredUniqueChars = 1;

            // Lockout settings
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.AllowedForNewUsers = true;

            // User settings
            options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
            options.User.RequireUniqueEmail = true;

            // Sign-in settings
            options.SignIn.RequireConfirmedEmail = true;
            options.SignIn.RequireConfirmedPhoneNumber = false;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        // Add Redis for caching and token blacklisting
        var redisConnectionString = configuration.GetConnectionString("Redis");
        if (!string.IsNullOrEmpty(redisConnectionString))
        {
            services.AddSingleton<IConnectionMultiplexer>(provider =>
            {
                var configurationOptions = ConfigurationOptions.Parse(redisConnectionString);
                configurationOptions.AbortOnConnectFail = false;
                configurationOptions.ConnectRetry = 3;
                configurationOptions.ConnectTimeout = 5000;
                return ConnectionMultiplexer.Connect(configurationOptions);
            });

            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConnectionString;
                options.InstanceName = "UserManagerServices";
            });

            // Configure Data Protection with Redis
            services.AddDataProtection()
                .SetApplicationName("UserManagerServices")
                .PersistKeysToStackExchangeRedis(ConnectionMultiplexer.Connect(redisConnectionString), "DataProtection-Keys");
        }
        else
        {
            // Fallback to in-memory cache if Redis is not configured
            services.AddMemoryCache();

            // Configure Data Protection with local storage
            services.AddDataProtection()
                .SetApplicationName("UserManagerServices");
        }

        // Register repositories and Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IUserSessionRepository, UserSessionRepository>();
        services.AddScoped<IUserActivityLogRepository, UserActivityLogRepository>();
        services.AddScoped<IUserMfaSettingsRepository, UserMfaSettingsRepository>();
        services.AddScoped<IUserMfaBackupCodeRepository, UserMfaBackupCodeRepository>();
        services.AddScoped<IUserMfaAuditLogRepository, UserMfaAuditLogRepository>();
        services.AddScoped<IUserEmailOtpRepository, UserEmailOtpRepository>();

        // Register Dapper connection factory
        services.AddScoped<IDapperConnectionFactory, DapperConnectionFactory>();

        // Register security services
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IPasswordHashingService, PasswordHashingService>();
        services.AddScoped<ICacheService, CacheService>();
        services.AddScoped<ITotpService, TotpService>();
        services.AddScoped<IMfaService, MfaService>();

        // Register HTTP client and email service
        services.AddHttpClient<ZohoEmailService>(client =>
        {
            var zohoConfig = configuration.GetSection("Zoho:Email").Get<Services.ZohoEmailConfiguration>();
            if (zohoConfig != null)
            {
                client.Timeout = TimeSpan.FromSeconds(zohoConfig.TimeoutSeconds);
            }
        });
        services.AddScoped<IEmailService, ZohoEmailService>();

        return services;
    }


    /// <summary>
    /// Configures Entity Framework specific settings
    /// </summary>
    /// <param name="services">The service collection</param>
    /// <param name="configuration">Application configuration</param>
    /// <returns>The service collection for chaining</returns>
    public static IServiceCollection ConfigureEntityFramework(this IServiceCollection services, IConfiguration configuration)
    {
        // Configure connection pool settings
        services.Configure<DbContextOptions>(options =>
        {
            // Configure connection pooling
            var maxPoolSize = configuration.GetValue<int>("Database:MaxPoolSize", 100);
            var minPoolSize = configuration.GetValue<int>("Database:MinPoolSize", 5);

            // These would be applied in the DbContext configuration
        });

        return services;
    }
}
