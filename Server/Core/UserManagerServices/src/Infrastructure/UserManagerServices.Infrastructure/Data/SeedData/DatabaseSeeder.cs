using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;
using UserManagerServices.Infrastructure.Data;

namespace UserManagerServices.Infrastructure.Data.SeedData;

public class DatabaseSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(
        ApplicationDbContext context,
        UserManager<User> userManager,
        RoleManager<Role> roleManager,
        ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("Starting database seeding...");

            // Seed in order of dependencies
            await SeedRolesAsync();
            await SeedUsersAsync();
            await SeedUserRolesAsync();
            await SeedUserProfilesAsync();
            await SeedUserClaimsAsync();
            await SeedUserPreferencesAsync();
            await SeedUserNotificationSettingsAsync();
            await SeedUserSecuritySettingsAsync();
            await SeedUserMfaSettingsAsync();
            await SeedUserMfaBackupCodesAsync();
            await SeedUserSessionsAsync();
            await SeedUserApiKeysAsync();
            await SeedUserActivityLogsAsync();
            await SeedUserLoginAttemptsAsync();
            await SeedUserLockoutHistoryAsync();
            await SeedUserEmailOtpsAsync();
            await SeedUserMfaAuditLogsAsync();
            await SeedUserConsentsAsync();

            await _context.SaveChangesAsync();
            _logger.LogInformation("Database seeding completed successfully!");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during database seeding");
            throw;
        }
    }

    private async Task SeedRolesAsync()
    {
        if (await _roleManager.Roles.AnyAsync()) return;

        _logger.LogInformation("Seeding roles...");

        var roles = new[]
        {
            new Role
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "SuperAdmin",
                NormalizedName = "SUPERADMIN",
                Description = "Super Administrator with full system access",
                IsActive = true,
                IsSystemRole = true
            },
            new Role
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Admin",
                NormalizedName = "ADMIN",
                Description = "System Administrator",
                IsActive = true,
                IsSystemRole = true
            },
            new Role
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Manager",
                NormalizedName = "MANAGER",
                Description = "Manager with limited admin access",
                IsActive = true,
                IsSystemRole = false
            },
            new Role
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "User",
                NormalizedName = "USER",
                Description = "Standard User",
                IsActive = true,
                IsSystemRole = false
            },
            new Role
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "Guest",
                NormalizedName = "GUEST",
                Description = "Guest User with limited access",
                IsActive = true,
                IsSystemRole = false
            }
        };

        foreach (var role in roles)
        {
            await _roleManager.CreateAsync(role);
        }
    }

    private async Task SeedUsersAsync()
    {
        if (await _userManager.Users.AnyAsync()) return;

        _logger.LogInformation("Seeding users...");

        var users = new[]
        {
            new User
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                UserName = "superadmin@asiashop.com",
                NormalizedUserName = "SUPERADMIN@ASIASHOP.COM",
                Email = "superadmin@asiashop.com",
                NormalizedEmail = "SUPERADMIN@ASIASHOP.COM",
                EmailConfirmed = true,
                FirstName = "Super",
                LastName = "Admin",
                DateOfBirth = DateTime.SpecifyKind(new DateTime(1990, 1, 1), DateTimeKind.Utc),
                Gender = GenderEnum.Male,
                IsActive = true,
                PhoneNumber = "+1234567890",
                PhoneNumberConfirmed = true,
                TwoFactorEnabled = true,
                LockoutEnabled = false,
                AccessFailedCount = 0
            },
            new User
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                UserName = "admin@asiashop.com",
                NormalizedUserName = "ADMIN@ASIASHOP.COM",
                Email = "admin@asiashop.com",
                NormalizedEmail = "ADMIN@ASIASHOP.COM",
                EmailConfirmed = true,
                FirstName = "System",
                LastName = "Admin",
                DateOfBirth = DateTime.SpecifyKind(new DateTime(1985, 5, 15), DateTimeKind.Utc),
                Gender = GenderEnum.Female,
                IsActive = true,
                PhoneNumber = "+1234567891",
                PhoneNumberConfirmed = true,
                TwoFactorEnabled = true,
                LockoutEnabled = true,
                AccessFailedCount = 0
            },
            new User
            {
                Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                UserName = "manager@asiashop.com",
                NormalizedUserName = "MANAGER@ASIASHOP.COM",
                Email = "manager@asiashop.com",
                NormalizedEmail = "MANAGER@ASIASHOP.COM",
                EmailConfirmed = true,
                FirstName = "John",
                LastName = "Manager",
                DateOfBirth = DateTime.SpecifyKind(new DateTime(1988, 8, 22), DateTimeKind.Utc),
                Gender = GenderEnum.Male,
                IsActive = true,
                PhoneNumber = "+1234567892",
                PhoneNumberConfirmed = true,
                TwoFactorEnabled = false,
                LockoutEnabled = true,
                AccessFailedCount = 0
            },
            new User
            {
                Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                UserName = "user1@asiashop.com",
                NormalizedUserName = "USER1@ASIASHOP.COM",
                Email = "user1@asiashop.com",
                NormalizedEmail = "USER1@ASIASHOP.COM",
                EmailConfirmed = true,
                FirstName = "Alice",
                LastName = "Johnson",
                DateOfBirth = DateTime.SpecifyKind(new DateTime(1992, 3, 10), DateTimeKind.Utc),
                Gender = GenderEnum.Female,
                IsActive = true,
                PhoneNumber = "+1234567893",
                PhoneNumberConfirmed = true,
                TwoFactorEnabled = false,
                LockoutEnabled = true,
                AccessFailedCount = 0
            },
            new User
            {
                Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                UserName = "user2@asiashop.com",
                NormalizedUserName = "USER2@ASIASHOP.COM",
                Email = "user2@asiashop.com",
                NormalizedEmail = "USER2@ASIASHOP.COM",
                EmailConfirmed = true,
                FirstName = "Bob",
                LastName = "Smith",
                DateOfBirth = DateTime.SpecifyKind(new DateTime(1995, 7, 18), DateTimeKind.Utc),
                Gender = GenderEnum.Male,
                IsActive = true,
                PhoneNumber = "+1234567894",
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                LockoutEnabled = true,
                AccessFailedCount = 0
            },
            new User
            {
                Id = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                UserName = "guest@asiashop.com",
                NormalizedUserName = "GUEST@ASIASHOP.COM",
                Email = "guest@asiashop.com",
                NormalizedEmail = "GUEST@ASIASHOP.COM",
                EmailConfirmed = false,
                FirstName = "Guest",
                LastName = "User",
                DateOfBirth = DateTime.SpecifyKind(new DateTime(2000, 12, 25), DateTimeKind.Utc),
                Gender = GenderEnum.Other,
                IsActive = true,
                PhoneNumber = null,
                PhoneNumberConfirmed = false,
                TwoFactorEnabled = false,
                LockoutEnabled = true,
                AccessFailedCount = 0
            }
        };

        foreach (var user in users)
        {
            // Set a default password for all users
            var result = await _userManager.CreateAsync(user, "AsiaShop123!");
            if (!result.Succeeded)
            {
                _logger.LogWarning("Failed to create user {Email}: {Errors}", 
                    user.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }

    private async Task SeedUserRolesAsync()
    {
        if (await _context.UserRoles.AnyAsync()) return;

        _logger.LogInformation("Seeding user roles...");

        var userRoles = new[]
        {
            new UserRole
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), // SuperAdmin
                RoleId = Guid.Parse("11111111-1111-1111-1111-111111111111"), // SuperAdmin role
                ExpiresAt = null // Never expires
            },
            new UserRole
            {
                UserId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), // Admin
                RoleId = Guid.Parse("22222222-2222-2222-2222-222222222222"), // Admin role
                ExpiresAt = DateTime.UtcNow.AddYears(2)
            },
            new UserRole
            {
                UserId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"), // Manager
                RoleId = Guid.Parse("33333333-3333-3333-3333-333333333333"), // Manager role
                ExpiresAt = DateTime.UtcNow.AddYears(1)
            },
            new UserRole
            {
                UserId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"), // User1
                RoleId = Guid.Parse("44444444-4444-4444-4444-444444444444"), // User role
                ExpiresAt = DateTime.UtcNow.AddYears(1)
            },
            new UserRole
            {
                UserId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), // User2
                RoleId = Guid.Parse("44444444-4444-4444-4444-444444444444"), // User role
                ExpiresAt = DateTime.UtcNow.AddYears(1)
            },
            new UserRole
            {
                UserId = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"), // Guest
                RoleId = Guid.Parse("55555555-5555-5555-5555-555555555555"), // Guest role
                ExpiresAt = DateTime.UtcNow.AddMonths(6)
            }
        };

        await _context.UserRoles.AddRangeAsync(userRoles);
    }

    private async Task SeedUserProfilesAsync()
    {
        if (await _context.UserProfiles.AnyAsync()) return;

        _logger.LogInformation("Seeding user profiles...");

        var preferences = JsonSerializer.Serialize(new
        {
            theme = "dark",
            language = "en",
            notifications = true,
            emailFrequency = "daily"
        });

        var userProfiles = new[]
        {
            new UserProfile
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                Address = "123 Admin Street",
                PostalCode = "12345",
                City = "New York",
                Country = "USA",
                Province = "NY",
                State = "New York",
                District = "Manhattan",
                TimeZone = "America/New_York",
                Language = "en",
                Preferences = preferences
            },
            new UserProfile
            {
                UserId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                Address = "456 System Avenue",
                PostalCode = "23456",
                City = "Los Angeles",
                Country = "USA",
                Province = "CA",
                State = "California",
                District = "Downtown",
                TimeZone = "America/Los_Angeles",
                Language = "en",
                Preferences = preferences
            },
            new UserProfile
            {
                UserId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                Address = "789 Manager Road",
                PostalCode = "34567",
                City = "Chicago",
                Country = "USA",
                Province = "IL",
                State = "Illinois",
                District = "Loop",
                TimeZone = "America/Chicago",
                Language = "en",
                Preferences = preferences
            },
            new UserProfile
            {
                UserId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                Address = "321 User Lane",
                PostalCode = "45678",
                City = "Miami",
                Country = "USA",
                Province = "FL",
                State = "Florida",
                District = "South Beach",
                TimeZone = "America/New_York",
                Language = "en",
                Preferences = preferences
            },
            new UserProfile
            {
                UserId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                Address = "654 Customer Boulevard",
                PostalCode = "56789",
                City = "Seattle",
                Country = "USA",
                Province = "WA",
                State = "Washington",
                District = "Capitol Hill",
                TimeZone = "America/Los_Angeles",
                Language = "en",
                Preferences = preferences
            }
        };

        await _context.UserProfiles.AddRangeAsync(userProfiles);
    }

    private async Task SeedUserClaimsAsync()
    {
        if (await _context.UserClaims.AnyAsync()) return;

        _logger.LogInformation("Seeding user claims...");

        var userClaims = new[]
        {
            new UserClaim
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                ClaimType = "permission",
                ClaimValue = "users.manage"
            },
            new UserClaim
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                ClaimType = "permission",
                ClaimValue = "roles.manage"
            },
            new UserClaim
            {
                UserId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                ClaimType = "permission",
                ClaimValue = "users.view"
            },
            new UserClaim
            {
                UserId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                ClaimType = "permission",
                ClaimValue = "reports.view"
            },
            new UserClaim
            {
                UserId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                ClaimType = "permission",
                ClaimValue = "profile.edit"
            }
        };

        await _context.UserClaims.AddRangeAsync(userClaims);
    }

    private async Task SeedUserPreferencesAsync()
    {
        if (await _context.UserPreferences.AnyAsync()) return;

        _logger.LogInformation("Seeding user preferences...");

        var userPreferences = new List<UserPreference>();

        var userIds = new[]
        {
            Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
            Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
            Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
            Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee")
        };

        foreach (var userId in userIds)
        {
            userPreferences.AddRange(new[]
            {
                new UserPreference
                {
                    UserId = userId,
                    Category = "UI",
                    Key = "Theme",
                    Value = "Dark",
                    DataType = "string",
                    IsActive = true
                },
                new UserPreference
                {
                    UserId = userId,
                    Category = "UI",
                    Key = "Language",
                    Value = "en-US",
                    DataType = "string",
                    IsActive = true
                },
                new UserPreference
                {
                    UserId = userId,
                    Category = "Notification",
                    Key = "EmailEnabled",
                    Value = "true",
                    DataType = "boolean",
                    IsActive = true
                },
                new UserPreference
                {
                    UserId = userId,
                    Category = "Privacy",
                    Key = "ProfileVisibility",
                    Value = "Friends",
                    DataType = "string",
                    IsActive = true
                }
            });
        }

        await _context.UserPreferences.AddRangeAsync(userPreferences);
    }

    private async Task SeedUserNotificationSettingsAsync()
    {
        if (await _context.UserNotificationSettings.AnyAsync()) return;

        _logger.LogInformation("Seeding user notification settings...");

        var userIds = new[]
        {
            Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
            Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
            Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
            Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee")
        };

        var notificationSettings = userIds.Select(userId => new UserNotificationSettings
        {
            UserId = userId,
            EmailEnabled = true,
            EmailSecurityAlerts = true,
            EmailAccountUpdates = true,
            EmailMarketing = false,
            EmailNewsletter = userId == Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), // Only admin gets newsletter
            EmailSystemNotifications = true,
            SmsEnabled = userId == Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa") || 
                        userId == Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), // Only admins get SMS
            SmsSecurityAlerts = userId == Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
            SmsAccountUpdates = false,
            SmsTwoFactorAuth = userId == Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa") || 
                              userId == Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            PushEnabled = true,
            PushSecurityAlerts = true,
            PushAccountUpdates = true,
            PushSystemNotifications = true,
            InAppEnabled = true,
            InAppSecurityAlerts = true,
            InAppAccountUpdates = true,
            InAppSystemNotifications = true,
            DoNotDisturb = false,
            DoNotDisturbStart = new TimeOnly(22, 0), // 10 PM
            DoNotDisturbEnd = new TimeOnly(8, 0), // 8 AM
            TimeZone = "UTC",
            Frequency = "immediate"
        }).ToArray();

        await _context.UserNotificationSettings.AddRangeAsync(notificationSettings);
    }

    private async Task SeedUserSecuritySettingsAsync()
    {
        if (await _context.UserSecuritySettings.AnyAsync()) return;

        _logger.LogInformation("Seeding user security settings...");

        // Global default settings
        var globalSettings = new UserSecuritySettings
        {
            UserId = null,
            IsGlobalDefault = true,
            MaxFailedLoginAttempts = 5,
            InitialLockoutDurationMinutes = 15,
            MaxLockoutDurationMinutes = 1440,
            LockoutDurationMultiplier = 2.0m,
            FailedAttemptWindowMinutes = 60,
            EnableProgressiveLockout = true,
            EnableSuspiciousActivityDetection = true,
            SuspiciousActivityThreshold = 0.7m,
            EnableGeolocationTracking = true,
            BlockNewLocationLogins = false,
            RequireEmailVerificationForNewLocations = true,
            MaxConcurrentSessions = 5,
            SessionTimeoutMinutes = 60,
            EnableDeviceFingerprinting = true,
            SendSecurityAlerts = true,
            LogSecurityEvents = true,
            SecurityLogRetentionDays = 90,
            AutoUnlockAfterLockoutPeriod = true
        };

        // Admin-specific settings (more restrictive)
        var adminSettings = new UserSecuritySettings
        {
            UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
            IsGlobalDefault = false,
            MaxFailedLoginAttempts = 3,
            InitialLockoutDurationMinutes = 30,
            MaxLockoutDurationMinutes = 2880, // 48 hours
            LockoutDurationMultiplier = 3.0m,
            FailedAttemptWindowMinutes = 30,
            EnableProgressiveLockout = true,
            EnableSuspiciousActivityDetection = true,
            SuspiciousActivityThreshold = 0.5m,
            EnableGeolocationTracking = true,
            BlockNewLocationLogins = true,
            RequireEmailVerificationForNewLocations = true,
            MaxConcurrentSessions = 2,
            SessionTimeoutMinutes = 30,
            EnableDeviceFingerprinting = true,
            SendSecurityAlerts = true,
            LogSecurityEvents = true,
            SecurityLogRetentionDays = 365,
            AutoUnlockAfterLockoutPeriod = false
        };

        await _context.UserSecuritySettings.AddRangeAsync(new[] { globalSettings, adminSettings });
    }

    private async Task SeedUserMfaSettingsAsync()
    {
        if (await _context.UserMfaSettings.AnyAsync()) return;

        _logger.LogInformation("Seeding user MFA settings...");

        var mfaSettings = new[]
        {
            new UserMfaSettings
            {
                Id = Guid.Parse("11111111-aaaa-aaaa-aaaa-111111111111"),
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), // SuperAdmin
                IsEnabled = true,
                IsTotpEnabled = true,
                IsEmailOtpEnabled = true,
                IsBackupCodesEnabled = true,
                TotpSecretKey = "JBSWY3DPEHPK3PXP", // Base32 encoded secret
                BackupCodesRemaining = 10,
                LastUsedAt = DateTime.UtcNow.AddDays(-1),
                EnabledAt = DateTime.UtcNow.AddDays(-30),
                IsEnforced = true
            },
            new UserMfaSettings
            {
                Id = Guid.Parse("22222222-bbbb-bbbb-bbbb-222222222222"),
                UserId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), // Admin
                IsEnabled = true,
                IsTotpEnabled = true,
                IsEmailOtpEnabled = false,
                IsBackupCodesEnabled = true,
                TotpSecretKey = "JBSWY3DPEHPK3PXQ", // Base32 encoded secret
                BackupCodesRemaining = 8,
                LastUsedAt = DateTime.UtcNow.AddDays(-3),
                EnabledAt = DateTime.UtcNow.AddDays(-15),
                IsEnforced = false
            }
        };

        await _context.UserMfaSettings.AddRangeAsync(mfaSettings);
    }

    private async Task SeedUserMfaBackupCodesAsync()
    {
        if (await _context.UserMfaBackupCodes.AnyAsync()) return;

        _logger.LogInformation("Seeding user MFA backup codes...");

        var batchId1 = Guid.NewGuid();
        var batchId2 = Guid.NewGuid();

        var backupCodes = new List<UserMfaBackupCode>();

        // Generate 10 backup codes for SuperAdmin
        for (int i = 0; i < 10; i++)
        {
            backupCodes.Add(new UserMfaBackupCode
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                MfaSettingsId = Guid.Parse("11111111-aaaa-aaaa-aaaa-111111111111"),
                CodeHash = BCrypt.Net.BCrypt.HashPassword($"BACKUP{i:D2}ABC{DateTime.UtcNow.Ticks % 1000}"),
                IsUsed = i < 2, // First 2 codes are used
                UsedAt = i < 2 ? DateTime.UtcNow.AddDays(-i * 5) : null,
                UsedFromIp = i < 2 ? "192.168.1.100" : null,
                GenerationBatchId = batchId1,
                ExpiresAt = DateTime.UtcNow.AddYears(1)
            });
        }

        // Generate 10 backup codes for Admin
        for (int i = 0; i < 10; i++)
        {
            backupCodes.Add(new UserMfaBackupCode
            {
                UserId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                MfaSettingsId = Guid.Parse("22222222-bbbb-bbbb-bbbb-222222222222"),
                CodeHash = BCrypt.Net.BCrypt.HashPassword($"BACKUP{i:D2}XYZ{DateTime.UtcNow.Ticks % 1000}"),
                IsUsed = i < 2, // First 2 codes are used
                UsedAt = i < 2 ? DateTime.UtcNow.AddDays(-i * 3) : null,
                UsedFromIp = i < 2 ? "192.168.1.101" : null,
                GenerationBatchId = batchId2,
                ExpiresAt = DateTime.UtcNow.AddYears(1)
            });
        }

        await _context.UserMfaBackupCodes.AddRangeAsync(backupCodes);
    }

    private async Task SeedUserSessionsAsync()
    {
        if (await _context.UserSessions.AnyAsync()) return;

        _logger.LogInformation("Seeding user sessions...");

        var deviceInfo = JsonSerializer.Serialize(new
        {
            deviceType = "Desktop",
            screen = "1920x1080",
            platform = "Windows",
            version = "11"
        });

        var userSessions = new[]
        {
            new UserSession
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                SessionToken = "session_token_superadmin_1",
                RefreshToken = "refresh_token_superadmin_1",
                OperatingSystem = "Windows 11",
                Browser = "Chrome 120",
                Location = "New York, USA",
                DeviceInfo = deviceInfo,
                IpAddress = "192.168.1.100",
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                IsActive = true,
                ExpiresAt = DateTime.UtcNow.AddDays(15),
                LastAccessedAt = DateTime.UtcNow.AddMinutes(-30)
            },
            new UserSession
            {
                UserId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                SessionToken = "session_token_admin_1",
                RefreshToken = "refresh_token_admin_1",
                OperatingSystem = "macOS 14",
                Browser = "Safari 17",
                Location = "Los Angeles, USA",
                DeviceInfo = deviceInfo,
                IpAddress = "192.168.1.101",
                UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
                IsActive = true,
                ExpiresAt = DateTime.UtcNow.AddDays(15),
                LastAccessedAt = DateTime.UtcNow.AddHours(-2)
            },
            new UserSession
            {
                UserId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                SessionToken = "session_token_user1_1",
                RefreshToken = "refresh_token_user1_1",
                OperatingSystem = "Android 14",
                Browser = "Chrome Mobile 120",
                Location = "Miami, USA",
                DeviceInfo = JsonSerializer.Serialize(new
                {
                    deviceType = "Mobile",
                    screen = "1080x2400",
                    platform = "Android",
                    version = "14"
                }),
                IpAddress = "192.168.1.102",
                UserAgent = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36",
                IsActive = true,
                ExpiresAt = DateTime.UtcNow.AddDays(15),
                LastAccessedAt = DateTime.UtcNow.AddMinutes(-10)
            }
        };

        await _context.UserSessions.AddRangeAsync(userSessions);
    }

    private async Task SeedUserApiKeysAsync()
    {
        if (await _context.UserApiKeys.AnyAsync()) return;

        _logger.LogInformation("Seeding user API keys...");

        var permissions = JsonSerializer.Serialize(new[] { "users.read", "users.write", "profiles.read" });

        var userApiKeys = new[]
        {
            new UserApiKey
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                KeyName = "SuperAdmin API Key",
                KeyValue = "ak_superadmin_" + Guid.NewGuid().ToString("N")[..16],
                IsActive = true,
                Permissions = permissions,
                ExpiresAt = DateTime.UtcNow.AddYears(1),
                LastUsedAt = DateTime.UtcNow.AddDays(-1),
                RequestLimit = 10000,
                RequestCount = 1250,
                IpWhitelist = JsonSerializer.Serialize(new[] { "192.168.1.0/24", "10.0.0.0/8" })
            },
            new UserApiKey
            {
                UserId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                KeyName = "Admin API Key",
                KeyValue = "ak_admin_" + Guid.NewGuid().ToString("N")[..16],
                IsActive = true,
                Permissions = JsonSerializer.Serialize(new[] { "users.read", "profiles.read" }),
                ExpiresAt = DateTime.UtcNow.AddMonths(6),
                LastUsedAt = DateTime.UtcNow.AddDays(-3),
                RequestLimit = 5000,
                RequestCount = 890,
                IpWhitelist = JsonSerializer.Serialize(new[] { "192.168.1.0/24" })
            }
        };

        await _context.UserApiKeys.AddRangeAsync(userApiKeys);
    }

    private async Task SeedUserActivityLogsAsync()
    {
        if (await _context.UserActivityLogs.AnyAsync()) return;

        _logger.LogInformation("Seeding user activity logs...");

        var activityLogs = new[]
        {
            new UserActivityLog
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                Action = ActionEnum.Login,
                Entity = "User",
                EntityId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                Details = JsonSerializer.Serialize(new { method = "password", mfa = true }),
                IpAddress = "192.168.1.100",
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Timestamp = DateTime.UtcNow.AddMinutes(-30)
            },
            new UserActivityLog
            {
                UserId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                Action = ActionEnum.ProfileUpdate,
                Entity = "UserProfile",
                EntityId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                Details = JsonSerializer.Serialize(new { field = "phone", oldValue = "***", newValue = "***" }),
                IpAddress = "192.168.1.101",
                UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
                Timestamp = DateTime.UtcNow.AddHours(-2)
            },
            new UserActivityLog
            {
                UserId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                Action = ActionEnum.PasswordChange,
                Entity = "User",
                EntityId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                Details = JsonSerializer.Serialize(new { reason = "user_initiated" }),
                IpAddress = "192.168.1.102",
                UserAgent = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36",
                Timestamp = DateTime.UtcNow.AddDays(-1)
            }
        };

        await _context.UserActivityLogs.AddRangeAsync(activityLogs);
    }

    private async Task SeedUserLoginAttemptsAsync()
    {
        if (await _context.UserLoginAttempts.AnyAsync()) return;

        _logger.LogInformation("Seeding user login attempts...");

        var locationInfo = JsonSerializer.Serialize(new
        {
            country = "USA",
            region = "New York",
            city = "New York",
            latitude = 40.7128,
            longitude = -74.0060
        });

        var loginAttempts = new[]
        {
            new UserLoginAttempt
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                EmailOrUsername = "superadmin@asiashop.com",
                IsSuccessful = true,
                FailureReason = null,
                IpAddress = "192.168.1.100",
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                LocationInfo = locationInfo,
                DeviceFingerprint = "fp_windows_chrome_" + Guid.NewGuid().ToString("N")[..8],
                RiskScore = 0.1m,
                IsSuspicious = false,
                TriggeredLockout = false,
                SessionId = Guid.NewGuid(),
                AttemptedAt = DateTime.UtcNow.AddMinutes(-30)
            },
            new UserLoginAttempt
            {
                UserId = null, // Failed attempt with invalid username
                EmailOrUsername = "hacker@example.com",
                IsSuccessful = false,
                FailureReason = LoginFailureReasonEnum.InvalidUsername,
                IpAddress = "203.0.113.42",
                UserAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
                LocationInfo = JsonSerializer.Serialize(new
                {
                    country = "Unknown",
                    region = "Unknown",
                    city = "Unknown"
                }),
                DeviceFingerprint = "fp_linux_chrome_suspicious",
                RiskScore = 0.9m,
                IsSuspicious = true,
                TriggeredLockout = false,
                AttemptedAt = DateTime.UtcNow.AddHours(-1)
            },
            new UserLoginAttempt
            {
                UserId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                EmailOrUsername = "user1@asiashop.com",
                IsSuccessful = false,
                FailureReason = LoginFailureReasonEnum.InvalidPassword,
                IpAddress = "192.168.1.102",
                UserAgent = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36",
                LocationInfo = JsonSerializer.Serialize(new
                {
                    country = "USA",
                    region = "Florida",
                    city = "Miami"
                }),
                DeviceFingerprint = "fp_android_chrome_user1",
                RiskScore = 0.3m,
                IsSuspicious = false,
                TriggeredLockout = false,
                AttemptedAt = DateTime.UtcNow.AddHours(-6)
            }
        };

        await _context.UserLoginAttempts.AddRangeAsync(loginAttempts);
    }

    private async Task SeedUserLockoutHistoryAsync()
    {
        if (await _context.UserLockoutHistory.AnyAsync()) return;

        _logger.LogInformation("Seeding user lockout history...");

        var lockoutHistory = new[]
        {
            new UserLockoutHistory
            {
                UserId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"), // User2 had a lockout
                LockoutType = LockoutTypeEnum.Automatic,
                LockoutReason = LockoutReasonEnum.FailedLoginAttempts,
                LockoutStart = DateTime.UtcNow.AddDays(-7),
                LockoutEnd = DateTime.UtcNow.AddDays(-7).AddMinutes(15),
                DurationMinutes = 15,
                FailedAttemptCount = 5,
                LockoutLevel = 1,
                TriggeringIpAddress = "192.168.1.103",
                IsManualLockout = false,
                ReleasedAt = DateTime.UtcNow.AddDays(-7).AddMinutes(15),
                ReleaseReason = LockoutReleaseReasonEnum.AutomaticTimeout,
                Details = JsonSerializer.Serialize(new { reason = "Too many failed password attempts" }),
                IsActive = false
            },
            new UserLockoutHistory
            {
                UserId = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff"), // Guest had suspicious activity
                LockoutType = LockoutTypeEnum.SuspiciousActivity,
                LockoutReason = LockoutReasonEnum.SuspiciousLoginPattern,
                LockoutStart = DateTime.UtcNow.AddDays(-3),
                LockoutEnd = DateTime.UtcNow.AddDays(-3).AddHours(1),
                DurationMinutes = 60,
                FailedAttemptCount = 0,
                LockoutLevel = 1,
                TriggeringIpAddress = "203.0.113.50",
                IsManualLockout = false,
                ReleasedAt = DateTime.UtcNow.AddDays(-3).AddMinutes(45),
                ReleaseReason = LockoutReleaseReasonEnum.EmailVerification,
                Details = JsonSerializer.Serialize(new { reason = "Login from unusual location" }),
                IsActive = false
            }
        };

        await _context.UserLockoutHistory.AddRangeAsync(lockoutHistory);
    }

    private async Task SeedUserEmailOtpsAsync()
    {
        if (await _context.UserEmailOtps.AnyAsync()) return;

        _logger.LogInformation("Seeding user email OTPs...");

        var emailOtps = new[]
        {
            new UserEmailOtp
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                OtpHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                EmailAddress = "superadmin@asiashop.com",
                Purpose = "MFA",
                IsUsed = true,
                UsedAt = DateTime.UtcNow.AddMinutes(-25),
                UsedFromIp = "192.168.1.100",
                UsedFromUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                ExpiresAt = DateTime.UtcNow.AddMinutes(10),
                AttemptCount = 1,
                MaxAttempts = 3,
                IsBlocked = false,
                SessionId = Guid.NewGuid()
            },
            new UserEmailOtp
            {
                UserId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                OtpHash = BCrypt.Net.BCrypt.HashPassword("789012"),
                EmailAddress = "admin@asiashop.com",
                Purpose = "PasswordReset",
                IsUsed = false,
                ExpiresAt = DateTime.UtcNow.AddMinutes(8),
                AttemptCount = 0,
                MaxAttempts = 3,
                IsBlocked = false,
                SessionId = Guid.NewGuid()
            },
            new UserEmailOtp
            {
                UserId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
                OtpHash = BCrypt.Net.BCrypt.HashPassword("345678"),
                EmailAddress = "user1@asiashop.com",
                Purpose = "EmailVerification",
                IsUsed = false,
                ExpiresAt = DateTime.UtcNow.AddMinutes(-5), // Expired
                AttemptCount = 2,
                MaxAttempts = 3,
                IsBlocked = false,
                SessionId = Guid.NewGuid()
            }
        };

        await _context.UserEmailOtps.AddRangeAsync(emailOtps);
    }

    private async Task SeedUserMfaAuditLogsAsync()
    {
        if (await _context.UserMfaAuditLogs.AnyAsync()) return;

        _logger.LogInformation("Seeding user MFA audit logs...");

        var mfaAuditLogs = new[]
        {
            new UserMfaAuditLog
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                MfaSettingsId = Guid.Parse("11111111-aaaa-aaaa-aaaa-111111111111"),
                Action = MfaActionEnum.TotpVerified,
                Method = "TOTP",
                IsSuccess = true,
                IpAddress = "192.168.1.100",
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                LocationInfo = JsonSerializer.Serialize(new { country = "USA", city = "New York" }),
                Details = JsonSerializer.Serialize(new { code_length = 6, attempt_count = 1 }),
                SessionId = Guid.NewGuid(),
                RiskScore = 0.1m,
                TriggeredAlert = false,
                Timestamp = DateTime.UtcNow.AddMinutes(-30)
            },
            new UserMfaAuditLog
            {
                UserId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                MfaSettingsId = Guid.Parse("22222222-bbbb-bbbb-bbbb-222222222222"),
                Action = MfaActionEnum.TotpFailed,
                Method = "TOTP",
                IsSuccess = false,
                FailureReason = "Invalid code",
                IpAddress = "192.168.1.101",
                UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
                LocationInfo = JsonSerializer.Serialize(new { country = "USA", city = "Los Angeles" }),
                Details = JsonSerializer.Serialize(new { code_length = 6, attempt_count = 2 }),
                SessionId = Guid.NewGuid(),
                RiskScore = 0.4m,
                TriggeredAlert = false,
                Timestamp = DateTime.UtcNow.AddHours(-2)
            },
            new UserMfaAuditLog
            {
                UserId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                MfaSettingsId = Guid.Parse("11111111-aaaa-aaaa-aaaa-111111111111"),
                Action = MfaActionEnum.BackupCodeUsed,
                Method = "BackupCode",
                IsSuccess = true,
                IpAddress = "192.168.1.100",
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                LocationInfo = JsonSerializer.Serialize(new { country = "USA", city = "New York" }),
                Details = JsonSerializer.Serialize(new { codes_remaining = 9 }),
                SessionId = Guid.NewGuid(),
                RiskScore = 0.2m,
                TriggeredAlert = false,
                Timestamp = DateTime.UtcNow.AddDays(-1)
            }
        };

        await _context.UserMfaAuditLogs.AddRangeAsync(mfaAuditLogs);
    }

    private async Task SeedUserConsentsAsync()
    {
        if (await _context.UserConsents.AnyAsync()) return;

        _logger.LogInformation("Seeding user consents...");

        var userIds = new[]
        {
            Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
            Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
            Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd"),
            Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee")
        };

        var consents = new List<UserConsent>();

        foreach (var userId in userIds)
        {
            // Marketing consent
            consents.Add(new UserConsent
            {
                UserId = userId,
                ConsentType = ConsentType.Marketing,
                Purpose = "Marketing Communications",
                Description = "Consent to receive marketing emails and promotional content",
                Status = userId == userIds[0] || userId == userIds[1] ? ConsentStatus.Given : ConsentStatus.Withdrawn,
                ConsentVersion = "1.0",
                ConsentGivenAt = DateTime.UtcNow.AddDays(-30),
                ConsentWithdrawnAt = userId != userIds[0] && userId != userIds[1] ? DateTime.UtcNow.AddDays(-10) : null,
                ConsentMethod = ConsentMethod.WebForm,
                ConsentIpAddress = "192.168.1.100",
                ConsentUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                ConsentSource = "Registration Form",
                IsMandatory = false,
                IsWithdrawable = true,
                DataCategories = JsonSerializer.Serialize(new[] { "email", "name", "preferences" }),
                ProcessingActivities = JsonSerializer.Serialize(new[] { "email_marketing", "personalization" }),
                RetentionPeriod = "2 years",
                WasInformed = true,
                ConsentLanguage = "en-US"
            });

            // Analytics consent
            consents.Add(new UserConsent
            {
                UserId = userId,
                ConsentType = ConsentType.Analytics,
                Purpose = "Website Analytics",
                Description = "Consent to track website usage for analytics purposes",
                Status = ConsentStatus.Given,
                ConsentVersion = "1.0",
                ConsentGivenAt = DateTime.UtcNow.AddDays(-30),
                ConsentMethod = ConsentMethod.WebForm,
                ConsentIpAddress = "192.168.1.100",
                ConsentUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                ConsentSource = "Cookie Banner",
                IsMandatory = false,
                IsWithdrawable = true,
                DataCategories = JsonSerializer.Serialize(new[] { "usage_data", "technical_data" }),
                ProcessingActivities = JsonSerializer.Serialize(new[] { "analytics", "performance_monitoring" }),
                RetentionPeriod = "2 years",
                WasInformed = true,
                ConsentLanguage = "en-US"
            });
        }

        await _context.UserConsents.AddRangeAsync(consents);
    }
}
