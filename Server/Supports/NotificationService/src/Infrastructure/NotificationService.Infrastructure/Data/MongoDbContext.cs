#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/19
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using Microsoft.EntityFrameworkCore;
using NotificationService.Domain.Entities;

namespace NotificationService.Infrastructure.Data;

public class MongoDbContext(DbContextOptions<MongoDbContext> options) : DbContext(options)
{
    public DbSet<Notification> Notifications { get; set; } = null!;
    public DbSet<NotificationTemplate> NotificationTemplates { get; set; } = null!;


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        ConfigureIdentityTableNames(modelBuilder);
    }

    private static void ConfigureIdentityTableNames(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Notification>().ToTable("Notifications");
        modelBuilder.Entity<NotificationTemplate>().ToTable("NotificationTemplates");
    }
}