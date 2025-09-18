#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Infrastructure.Data;
using UserManagerServices.Infrastructure.Data.SeedData;

namespace UserManagerServices.Infrastructure.Extensions;

public static class DatabaseSeederExtensions
{
    /// <summary>
    /// Seeds the database with sample data
    /// </summary>
    /// <param name="serviceProvider">The service provider</param>
    /// <returns>A task representing the asynchronous operation</returns>
    public static async Task SeedDatabaseAsync(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var services = scope.ServiceProvider;

        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            var userManager = services.GetRequiredService<UserManager<User>>();
            var roleManager = services.GetRequiredService<RoleManager<Role>>();
            var logger = services.GetRequiredService<ILogger<DatabaseSeeder>>();

            var seeder = new DatabaseSeeder(context, userManager, roleManager, logger);
            await seeder.SeedAsync();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while seeding the database", ex);
        }
    }

    /// <summary>
    /// Seeds the database with sample data if in development environment
    /// </summary>
    /// <param name="serviceProvider">The service provider</param>
    /// <param name="isDevelopment">Whether the environment is development</param>
    /// <returns>A task representing the asynchronous operation</returns>
    public static async Task SeedDatabaseIfDevelopmentAsync(this IServiceProvider serviceProvider, bool isDevelopment)
    {
        if (isDevelopment) await serviceProvider.SeedDatabaseAsync();
    }
}