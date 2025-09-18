#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.Reflection;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using UserManagerServices.Application.Common.Behaviors;
using UserManagerServices.Application.Common.Mappings;

namespace UserManagerServices.Application.Extensions;

/// <summary>
/// Extension methods for configuring Application layer services in dependency injection container
/// Follows Clean Architecture principles by keeping application concerns separate
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds Application layer services to the dependency injection container
    /// </summary>
    /// <param name="services">The service collection</param>
    /// <returns>The service collection for chaining</returns>
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        var autoMapperLicenseKey = Environment.GetEnvironmentVariable("AutoMapperLicenseKey") ??
                                  configuration.GetSection("AutoMapperLicenseKey").Value;

        // Add MediatR
        services.AddMediatR(cfg =>
        {
            cfg.LicenseKey = autoMapperLicenseKey;
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());

            // Add pipeline behaviors in order of execution
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));
        });

        // Add FluentValidation
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // Add AutoMapper

        services.AddAutoMapper(cfg =>
        {
            cfg.LicenseKey = autoMapperLicenseKey;
            cfg.AddProfile<MappingProfile>();
        });

        return services;
    }

    /// <summary>
    /// Adds application-specific configurations
    /// </summary>
    /// <param name="services">The service collection</param>
    /// <returns>The service collection for chaining</returns>
    public static IServiceCollection AddApplicationConfiguration(this IServiceCollection services)
    {
        // Configure MediatR settings
        services.Configure<MediatRServiceConfiguration>(options =>
        {
            options.RequestExceptionActionProcessorStrategy =
                RequestExceptionActionProcessorStrategy.ApplyForUnhandledExceptions;
        });

        return services;
    }
}
