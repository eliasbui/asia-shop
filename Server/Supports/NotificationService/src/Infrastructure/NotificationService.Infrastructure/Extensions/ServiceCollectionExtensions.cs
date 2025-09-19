#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/19
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NotificationService.Infrastructure.Data;

namespace NotificationService.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<MongoDbContext>(options =>
        {
            options.UseMongoDB(
                configuration.GetConnectionString("MongoDB:ConnectionString") ?? string.Empty,
                configuration["MongoDB:DatabaseName"] ?? "NotificationDB"
            );
        });
        
        //add kafka consumer
        
    }
}