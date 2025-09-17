using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Data.SeedData;

/// <summary>
/// Background service to seed database on startup
/// </summary>
public class SeedDataCommand : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<SeedDataCommand> _logger;

    public SeedDataCommand(IServiceProvider serviceProvider, ILogger<SeedDataCommand> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var services = scope.ServiceProvider;

        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            var userManager = services.GetRequiredService<UserManager<User>>();
            var roleManager = services.GetRequiredService<RoleManager<Role>>();
            var logger = services.GetRequiredService<ILogger<DatabaseSeeder>>();

            // Ensure database is created
            await context.Database.EnsureCreatedAsync(cancellationToken);

            var seeder = new DatabaseSeeder(context, userManager, roleManager, logger);
            await seeder.SeedAsync();

            _logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
