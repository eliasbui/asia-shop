#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserManagerServices.Infrastructure.Migrations.User;

/// <inheritdoc />
public partial class Initial : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            "Users",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                FirstName = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                LastName = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                DateOfBirth = table.Column<DateTime>("timestamp with time zone", nullable: true),
                Gender = table.Column<int>("int", nullable: true),
                IsActive = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                LastLoginAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                LastLogoutAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                LastLoginIp = table.Column<string>("character varying(45)", maxLength: 45, nullable: true),
                LastLogoutIp = table.Column<string>("character varying(45)", maxLength: 45, nullable: true),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                UserName = table.Column<string>("character varying(256)", maxLength: 256, nullable: false),
                NormalizedUserName = table.Column<string>("character varying(256)", maxLength: 256, nullable: true),
                Email = table.Column<string>("character varying(256)", maxLength: 256, nullable: false),
                NormalizedEmail = table.Column<string>("character varying(256)", maxLength: 256, nullable: true),
                EmailConfirmed = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                PasswordHash = table.Column<string>("text", nullable: true),
                SecurityStamp = table.Column<string>("text", nullable: true),
                ConcurrencyStamp = table.Column<string>("text", nullable: true),
                PhoneNumber = table.Column<string>("text", nullable: true),
                PhoneNumberConfirmed = table.Column<bool>("boolean", nullable: false),
                TwoFactorEnabled = table.Column<bool>("boolean", nullable: false),
                LockoutEnd = table.Column<DateTimeOffset>("timestamp with time zone", nullable: true),
                LockoutEnabled = table.Column<bool>("boolean", nullable: false),
                AccessFailedCount = table.Column<int>("integer", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Users", x => x.Id);
                table.ForeignKey(
                    "FK_Users_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_Users_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
            });

        migrationBuilder.CreateTable(
            "Roles",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                Description = table.Column<string>("character varying(500)", maxLength: 500, nullable: false),
                IsActive = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                IsSystemRole = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                Name = table.Column<string>("character varying(256)", maxLength: 256, nullable: false),
                NormalizedName = table.Column<string>("character varying(256)", maxLength: 256, nullable: true),
                ConcurrencyStamp = table.Column<string>("text", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Roles", x => x.Id);
                table.ForeignKey(
                    "FK_Roles_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_Roles_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
            });

        migrationBuilder.CreateTable(
            "UserActivityLogs",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                Action = table.Column<int>("int", nullable: false),
                Entity = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                EntityId = table.Column<Guid>("uuid", nullable: true),
                Details = table.Column<string>("jsonb", nullable: false),
                IpAddress = table.Column<string>("character varying(45)", maxLength: 45, nullable: true),
                UserAgent = table.Column<string>("character varying(1024)", maxLength: 1024, nullable: true),
                Timestamp = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserActivityLogs", x => x.Id);
                table.ForeignKey(
                    "FK_UserActivityLogs_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserActivityLogs_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserActivityLogs_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
            });

        migrationBuilder.CreateTable(
            "UserApiKeys",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                KeyName = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                KeyValue = table.Column<string>("character varying(512)", maxLength: 512, nullable: false),
                IsActive = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                Permissions = table.Column<string>("jsonb", nullable: false),
                ExpiresAt = table.Column<DateTime>("timestamp with time zone", nullable: false),
                LastUsedAt = table.Column<DateTime>("timestamp with time zone", nullable: false),
                RequestLimit = table.Column<int>("integer", nullable: false, defaultValue: 1000),
                RequestCount = table.Column<int>("integer", nullable: false, defaultValue: 0),
                IpWhitelist = table.Column<string>("jsonb", nullable: true),
                IpBlacklist = table.Column<string[]>("jsonb", nullable: true),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserApiKeys", x => x.Id);
                table.ForeignKey(
                    "FK_UserApiKeys_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserApiKeys_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserApiKeys_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            "UserClaims",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                ClaimType = table.Column<string>("character varying(256)", maxLength: 256, nullable: true),
                ClaimValue = table.Column<string>("character varying(1024)", maxLength: 1024, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserClaims", x => x.Id);
                table.ForeignKey(
                    "FK_UserClaims_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserClaims_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserClaims_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            "UserEmailOtps",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                OtpHash = table.Column<string>("character varying(512)", maxLength: 512, nullable: false),
                EmailAddress = table.Column<string>("character varying(256)", maxLength: 256, nullable: false),
                Purpose = table.Column<string>("character varying(50)", maxLength: 50, nullable: false),
                IsUsed = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                UsedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                UsedFromIp = table.Column<string>("character varying(45)", maxLength: 45, nullable: true),
                UsedFromUserAgent = table.Column<string>("character varying(1024)", maxLength: 1024, nullable: true),
                ExpiresAt = table.Column<DateTime>("timestamp with time zone", nullable: false),
                AttemptCount = table.Column<int>("integer", nullable: false, defaultValue: 0),
                MaxAttempts = table.Column<int>("integer", nullable: false, defaultValue: 3),
                IsBlocked = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                BlockedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                SessionId = table.Column<Guid>("uuid", nullable: true),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserEmailOtps", x => x.Id);
                table.ForeignKey(
                    "FK_UserEmailOtps_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserEmailOtps_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserEmailOtps_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            "UserLockoutHistory",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                UserId = table.Column<Guid>("uuid", nullable: false),
                LockoutType = table.Column<int>("int", nullable: false),
                LockoutReason = table.Column<int>("int", nullable: false),
                LockoutStart = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                LockoutEnd = table.Column<DateTime>("timestamp with time zone", nullable: true),
                DurationMinutes = table.Column<int>("integer", nullable: true),
                FailedAttemptCount = table.Column<int>("integer", nullable: false, defaultValue: 0),
                LockoutLevel = table.Column<int>("integer", nullable: false, defaultValue: 1),
                TriggeringIpAddress = table.Column<string>("character varying(45)", maxLength: 45, nullable: true),
                IsManualLockout = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                LockedByUserId = table.Column<Guid>("uuid", nullable: true),
                ReleasedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                ReleaseReason = table.Column<int>("int", nullable: true),
                ReleasedByUserId = table.Column<Guid>("uuid", nullable: true),
                Details = table.Column<string>("jsonb", nullable: true),
                IsActive = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                UserId1 = table.Column<Guid>("uuid", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserLockoutHistory", x => x.Id);
                table.ForeignKey(
                    "FK_UserLockoutHistory_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    "FK_UserLockoutHistory_Users_UserId1",
                    x => x.UserId1,
                    "Users",
                    "Id");
            });

        migrationBuilder.CreateTable(
            "UserLoginAttempts",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                UserId = table.Column<Guid>("uuid", nullable: true),
                EmailOrUsername = table.Column<string>("character varying(256)", maxLength: 256, nullable: false),
                IsSuccessful = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                FailureReason = table.Column<int>("int", nullable: true),
                IpAddress = table.Column<string>("character varying(45)", maxLength: 45, nullable: false),
                UserAgent = table.Column<string>("character varying(500)", maxLength: 500, nullable: true),
                LocationInfo = table.Column<string>("jsonb", nullable: true),
                DeviceFingerprint = table.Column<string>("character varying(500)", maxLength: 500, nullable: true),
                RiskScore = table.Column<decimal>("numeric(3,2)", nullable: false, defaultValue: 0.0m),
                IsSuspicious = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                TriggeredLockout = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                SessionId = table.Column<Guid>("uuid", nullable: true),
                Details = table.Column<string>("jsonb", nullable: true),
                AttemptedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                UserId1 = table.Column<Guid>("uuid", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserLoginAttempts", x => x.Id);
                table.ForeignKey(
                    "FK_UserLoginAttempts_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserLoginAttempts_Users_UserId1",
                    x => x.UserId1,
                    "Users",
                    "Id");
            });

        migrationBuilder.CreateTable(
            "UserLogins",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                LoginProvider = table.Column<string>("character varying(128)", maxLength: 128, nullable: false),
                ProviderKey = table.Column<string>("character varying(128)", maxLength: 128, nullable: false),
                ProviderDisplayName = table.Column<string>("character varying(256)", maxLength: 256, nullable: true),
                UserId = table.Column<Guid>("uuid", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserLogins", x => x.Id);
                table.ForeignKey(
                    "FK_UserLogins_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserLogins_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserLogins_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            "UserMfaSettings",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                IsEnabled = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                IsTotpEnabled = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                IsEmailOtpEnabled = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                IsBackupCodesEnabled = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                TotpSecretKey = table.Column<string>("character varying(512)", maxLength: 512, nullable: true),
                BackupCodesRemaining = table.Column<int>("integer", nullable: false, defaultValue: 0),
                LastUsedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                EnabledAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                DisabledAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                DisabledReason = table.Column<string>("character varying(500)", maxLength: 500, nullable: true),
                IsEnforced = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                EnforcementGracePeriodEnd = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserMfaSettings", x => x.Id);
                table.ForeignKey(
                    "FK_UserMfaSettings_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserMfaSettings_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserMfaSettings_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            "UserNotificationSettings",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                EmailEnabled = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                EmailSecurityAlerts = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                EmailAccountUpdates = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                EmailMarketing = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                EmailNewsletter = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                EmailSystemNotifications = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                SmsEnabled = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                SmsSecurityAlerts = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                SmsAccountUpdates = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                SmsTwoFactorAuth = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                PushEnabled = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                PushSecurityAlerts = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                PushAccountUpdates = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                PushSystemNotifications = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                InAppEnabled = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                InAppSecurityAlerts = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                InAppAccountUpdates = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                InAppSystemNotifications = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                DoNotDisturb = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                DoNotDisturbStart = table.Column<TimeOnly>("time without time zone", nullable: true),
                DoNotDisturbEnd = table.Column<TimeOnly>("time without time zone", nullable: true),
                TimeZone = table.Column<string>("character varying(100)", maxLength: 100, nullable: true,
                    defaultValue: "UTC"),
                Frequency = table.Column<string>("character varying(50)", maxLength: 50, nullable: true,
                    defaultValue: "immediate"),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                UserId1 = table.Column<Guid>("uuid", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserNotificationSettings", x => x.Id);
                table.ForeignKey(
                    "FK_UserNotificationSettings_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserNotificationSettings_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserNotificationSettings_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    "FK_UserNotificationSettings_Users_UserId1",
                    x => x.UserId1,
                    "Users",
                    "Id");
            });

        migrationBuilder.CreateTable(
            "UserPreferences",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                Category = table.Column<string>("character varying(50)", maxLength: 50, nullable: false),
                Key = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                Value = table.Column<string>("character varying(2048)", maxLength: 2048, nullable: false),
                IsActive = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                DataType = table.Column<string>("character varying(50)", maxLength: 50, nullable: false),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserPreferences", x => x.Id);
                table.ForeignKey(
                    "FK_UserPreferences_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserPreferences_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserPreferences_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            "UserProfiles",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                Address = table.Column<string>("character varying(500)", maxLength: 500, nullable: true),
                PostalCode = table.Column<string>("character varying(20)", maxLength: 20, nullable: true),
                City = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                Country = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                Province = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                State = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                District = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                TimeZone = table.Column<string>("character varying(50)", maxLength: 50, nullable: true,
                    defaultValue: "UTC"),
                Language = table.Column<string>("character varying(10)", maxLength: 10, nullable: true,
                    defaultValue: "en"),
                Preferences = table.Column<string>("jsonb", nullable: true),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserProfiles", x => x.Id);
                table.ForeignKey(
                    "FK_UserProfiles_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserProfiles_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserProfiles_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            "UserSecuritySettings",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                UserId = table.Column<Guid>("uuid", nullable: true),
                IsGlobalDefault = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                MaxFailedLoginAttempts = table.Column<int>("integer", nullable: false, defaultValue: 5),
                InitialLockoutDurationMinutes = table.Column<int>("integer", nullable: false, defaultValue: 15),
                MaxLockoutDurationMinutes = table.Column<int>("integer", nullable: false, defaultValue: 1440),
                LockoutDurationMultiplier = table.Column<decimal>("numeric(3,1)", nullable: false, defaultValue: 2.0m),
                FailedAttemptWindowMinutes = table.Column<int>("integer", nullable: false, defaultValue: 60),
                EnableProgressiveLockout = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                EnableSuspiciousActivityDetection = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                SuspiciousActivityThreshold =
                    table.Column<decimal>("numeric(3,2)", nullable: false, defaultValue: 0.7m),
                EnableGeolocationTracking = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                BlockNewLocationLogins = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                RequireEmailVerificationForNewLocations =
                    table.Column<bool>("boolean", nullable: false, defaultValue: true),
                MaxConcurrentSessions = table.Column<int>("integer", nullable: false, defaultValue: 5),
                SessionTimeoutMinutes = table.Column<int>("integer", nullable: false, defaultValue: 60),
                EnableDeviceFingerprinting = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                SendSecurityAlerts = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                LogSecurityEvents = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                SecurityLogRetentionDays = table.Column<int>("integer", nullable: false, defaultValue: 90),
                AutoUnlockAfterLockoutPeriod = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                AdditionalSettings = table.Column<string>("jsonb", nullable: true),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                UserId1 = table.Column<Guid>("uuid", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserSecuritySettings", x => x.Id);
                table.CheckConstraint("CK_UserSecuritySettings_InitialLockoutDurationMinutes",
                    "\"InitialLockoutDurationMinutes\" > 0");
                table.CheckConstraint("CK_UserSecuritySettings_LockoutDurationMultiplier",
                    "\"LockoutDurationMultiplier\" >= 1.0");
                table.CheckConstraint("CK_UserSecuritySettings_MaxConcurrentSessions", "\"MaxConcurrentSessions\" > 0");
                table.CheckConstraint("CK_UserSecuritySettings_MaxFailedLoginAttempts",
                    "\"MaxFailedLoginAttempts\" > 0");
                table.CheckConstraint("CK_UserSecuritySettings_MaxLockoutDurationMinutes",
                    "\"MaxLockoutDurationMinutes\" >= \"InitialLockoutDurationMinutes\"");
                table.CheckConstraint("CK_UserSecuritySettings_SessionTimeoutMinutes", "\"SessionTimeoutMinutes\" > 0");
                table.CheckConstraint("CK_UserSecuritySettings_SuspiciousActivityThreshold",
                    "\"SuspiciousActivityThreshold\" >= 0.0 AND \"SuspiciousActivityThreshold\" <= 1.0");
                table.ForeignKey(
                    "FK_UserSecuritySettings_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    "FK_UserSecuritySettings_Users_UserId1",
                    x => x.UserId1,
                    "Users",
                    "Id");
            });

        migrationBuilder.CreateTable(
            "UserSessions",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                SessionToken = table.Column<string>("character varying(512)", maxLength: 512, nullable: false),
                RefreshToken = table.Column<string>("character varying(512)", maxLength: 512, nullable: false),
                OperatingSystem = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                Browser = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                Location = table.Column<string>("character varying(100)", maxLength: 100, nullable: false),
                DeviceInfo = table.Column<string>("jsonb", nullable: false),
                IpAddress = table.Column<string>("character varying(45)", maxLength: 45, nullable: false),
                UserAgent = table.Column<string>("character varying(1024)", maxLength: 1024, nullable: false),
                IsActive = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                ExpiresAt = table.Column<DateTime>("timestamp with time zone", nullable: false),
                LastAccessedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserSessions", x => x.Id);
                table.ForeignKey(
                    "FK_UserSessions_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserSessions_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserSessions_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            "UserTokens",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                LoginProvider = table.Column<string>("character varying(128)", maxLength: 128, nullable: false),
                Name = table.Column<string>("character varying(128)", maxLength: 128, nullable: false),
                Value = table.Column<string>("character varying(2048)", maxLength: 2048, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserTokens", x => x.Id);
                table.ForeignKey(
                    "FK_UserTokens_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserTokens_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserTokens_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            "RoleClaims",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                RoleId = table.Column<Guid>("uuid", nullable: false),
                ClaimType = table.Column<string>("character varying(256)", maxLength: 256, nullable: true),
                ClaimValue = table.Column<string>("character varying(1024)", maxLength: 1024, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_RoleClaims", x => x.Id);
                table.ForeignKey(
                    "FK_RoleClaims_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_RoleClaims_Roles_RoleId",
                    x => x.RoleId,
                    "Roles",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    "FK_RoleClaims_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
            });

        migrationBuilder.CreateTable(
            "UserRoles",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                ExpiresAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                RoleId = table.Column<Guid>("uuid", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserRoles", x => x.Id);
                table.ForeignKey(
                    "FK_UserRoles_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserRoles_Roles_RoleId",
                    x => x.RoleId,
                    "Roles",
                    "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    "FK_UserRoles_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserRoles_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            "UserMfaAuditLogs",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                MfaSettingsId = table.Column<Guid>("uuid", nullable: true),
                Action = table.Column<int>("int", nullable: false),
                Method = table.Column<string>("character varying(50)", maxLength: 50, nullable: true),
                IsSuccess = table.Column<bool>("boolean", nullable: false),
                FailureReason = table.Column<string>("character varying(500)", maxLength: 500, nullable: true),
                IpAddress = table.Column<string>("character varying(45)", maxLength: 45, nullable: true),
                UserAgent = table.Column<string>("character varying(1024)", maxLength: 1024, nullable: true),
                LocationInfo = table.Column<string>("jsonb", nullable: true),
                Details = table.Column<string>("jsonb", nullable: true),
                SessionId = table.Column<Guid>("uuid", nullable: true),
                RiskScore = table.Column<decimal>("numeric(5,2)", precision: 5, scale: 2, nullable: true),
                TriggeredAlert = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                DisabledReason = table.Column<string>("character varying(500)", maxLength: 500, nullable: true),
                Timestamp = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserMfaAuditLogs", x => x.Id);
                table.ForeignKey(
                    "FK_UserMfaAuditLogs_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserMfaAuditLogs_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserMfaAuditLogs_UserMfaSettings_MfaSettingsId",
                    x => x.MfaSettingsId,
                    "UserMfaSettings",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserMfaAuditLogs_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
            });

        migrationBuilder.CreateTable(
            "UserMfaBackupCodes",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                MfaSettingsId = table.Column<Guid>("uuid", nullable: false),
                CodeHash = table.Column<string>("character varying(512)", maxLength: 512, nullable: false),
                IsUsed = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                UsedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                UsedFromIp = table.Column<string>("character varying(45)", maxLength: 45, nullable: true),
                UsedFromUserAgent = table.Column<string>("character varying(1024)", maxLength: 1024, nullable: true),
                ExpiresAt = table.Column<DateTime>("timestamp with time zone", nullable: false),
                GenerationBatchId = table.Column<Guid>("uuid", nullable: false),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserMfaBackupCodes", x => x.Id);
                table.ForeignKey(
                    "FK_UserMfaBackupCodes_CreatedBy_Users_Id",
                    x => x.CreatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserMfaBackupCodes_UpdatedBy_Users_Id",
                    x => x.UpdatedBy,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    "FK_UserMfaBackupCodes_UserMfaSettings_MfaSettingsId",
                    x => x.MfaSettingsId,
                    "UserMfaSettings",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    "FK_UserMfaBackupCodes_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            "idx_role_claims_claim_type",
            "RoleClaims",
            "ClaimType");

        migrationBuilder.CreateIndex(
            "idx_role_claims_created_at",
            "RoleClaims",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_role_claims_is_deleted",
            "RoleClaims",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_role_claims_role_claim_type",
            "RoleClaims",
            new[] { "RoleId", "ClaimType" });

        migrationBuilder.CreateIndex(
            "idx_role_claims_role_id",
            "RoleClaims",
            "RoleId");

        migrationBuilder.CreateIndex(
            "IX_RoleClaims_CreatedBy",
            "RoleClaims",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_RoleClaims_UpdatedBy",
            "RoleClaims",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_roles_created_at",
            "Roles",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_roles_is_active",
            "Roles",
            "IsActive");

        migrationBuilder.CreateIndex(
            "idx_roles_is_deleted",
            "Roles",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_roles_is_system_role",
            "Roles",
            "IsSystemRole");

        migrationBuilder.CreateIndex(
            "idx_roles_name",
            "Roles",
            "Name",
            unique: true);

        migrationBuilder.CreateIndex(
            "idx_roles_normalized_name",
            "Roles",
            "NormalizedName",
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_Roles_CreatedBy",
            "Roles",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_Roles_UpdatedBy",
            "Roles",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_user_activity_logs_action",
            "UserActivityLogs",
            "Action");

        migrationBuilder.CreateIndex(
            "idx_user_activity_logs_created_at",
            "UserActivityLogs",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_user_activity_logs_entity",
            "UserActivityLogs",
            "Entity");

        migrationBuilder.CreateIndex(
            "idx_user_activity_logs_entity_id",
            "UserActivityLogs",
            "EntityId");

        migrationBuilder.CreateIndex(
            "idx_user_activity_logs_ip_address",
            "UserActivityLogs",
            "IpAddress");

        migrationBuilder.CreateIndex(
            "idx_user_activity_logs_is_deleted",
            "UserActivityLogs",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_user_activity_logs_timestamp",
            "UserActivityLogs",
            "Timestamp");

        migrationBuilder.CreateIndex(
            "idx_user_activity_logs_user_action_time",
            "UserActivityLogs",
            new[] { "UserId", "Action", "Timestamp" });

        migrationBuilder.CreateIndex(
            "idx_user_activity_logs_user_id",
            "UserActivityLogs",
            "UserId");

        migrationBuilder.CreateIndex(
            "IX_UserActivityLogs_CreatedBy",
            "UserActivityLogs",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserActivityLogs_UpdatedBy",
            "UserActivityLogs",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_user_api_keys_created_at",
            "UserApiKeys",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_user_api_keys_expires_at",
            "UserApiKeys",
            "ExpiresAt");

        migrationBuilder.CreateIndex(
            "idx_user_api_keys_is_active",
            "UserApiKeys",
            "IsActive");

        migrationBuilder.CreateIndex(
            "idx_user_api_keys_is_deleted",
            "UserApiKeys",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_user_api_keys_key_name",
            "UserApiKeys",
            "KeyName");

        migrationBuilder.CreateIndex(
            "idx_user_api_keys_key_value",
            "UserApiKeys",
            "KeyValue",
            unique: true);

        migrationBuilder.CreateIndex(
            "idx_user_api_keys_last_used_at",
            "UserApiKeys",
            "LastUsedAt");

        migrationBuilder.CreateIndex(
            "idx_user_api_keys_user_id",
            "UserApiKeys",
            "UserId");

        migrationBuilder.CreateIndex(
            "idx_user_api_keys_user_name",
            "UserApiKeys",
            new[] { "UserId", "KeyName" },
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_UserApiKeys_CreatedBy",
            "UserApiKeys",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserApiKeys_UpdatedBy",
            "UserApiKeys",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_user_claims_claim_type",
            "UserClaims",
            "ClaimType");

        migrationBuilder.CreateIndex(
            "idx_user_claims_created_at",
            "UserClaims",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_user_claims_is_deleted",
            "UserClaims",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_user_claims_user_claim_type",
            "UserClaims",
            new[] { "UserId", "ClaimType" });

        migrationBuilder.CreateIndex(
            "idx_user_claims_user_id",
            "UserClaims",
            "UserId");

        migrationBuilder.CreateIndex(
            "IX_UserClaims_CreatedBy",
            "UserClaims",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserClaims_UpdatedBy",
            "UserClaims",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_user_email_otps_email_address",
            "UserEmailOtps",
            "EmailAddress");

        migrationBuilder.CreateIndex(
            "idx_user_email_otps_expires_at",
            "UserEmailOtps",
            "ExpiresAt");

        migrationBuilder.CreateIndex(
            "idx_user_email_otps_expires_used",
            "UserEmailOtps",
            new[] { "ExpiresAt", "IsUsed" });

        migrationBuilder.CreateIndex(
            "idx_user_email_otps_is_blocked",
            "UserEmailOtps",
            "IsBlocked");

        migrationBuilder.CreateIndex(
            "idx_user_email_otps_is_used",
            "UserEmailOtps",
            "IsUsed");

        migrationBuilder.CreateIndex(
            "idx_user_email_otps_purpose",
            "UserEmailOtps",
            "Purpose");

        migrationBuilder.CreateIndex(
            "idx_user_email_otps_session_id",
            "UserEmailOtps",
            "SessionId");

        migrationBuilder.CreateIndex(
            "idx_user_email_otps_user_id",
            "UserEmailOtps",
            "UserId");

        migrationBuilder.CreateIndex(
            "idx_user_email_otps_user_purpose_used",
            "UserEmailOtps",
            new[] { "UserId", "Purpose", "IsUsed" });

        migrationBuilder.CreateIndex(
            "IX_UserEmailOtps_CreatedBy",
            "UserEmailOtps",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserEmailOtps_UpdatedBy",
            "UserEmailOtps",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserLockoutHistory_IsActive",
            "UserLockoutHistory",
            "IsActive");

        migrationBuilder.CreateIndex(
            "IX_UserLockoutHistory_LockoutEnd",
            "UserLockoutHistory",
            "LockoutEnd");

        migrationBuilder.CreateIndex(
            "IX_UserLockoutHistory_LockoutReason",
            "UserLockoutHistory",
            "LockoutReason");

        migrationBuilder.CreateIndex(
            "IX_UserLockoutHistory_LockoutStart",
            "UserLockoutHistory",
            "LockoutStart");

        migrationBuilder.CreateIndex(
            "IX_UserLockoutHistory_LockoutType",
            "UserLockoutHistory",
            "LockoutType");

        migrationBuilder.CreateIndex(
            "IX_UserLockoutHistory_UserId",
            "UserLockoutHistory",
            "UserId");

        migrationBuilder.CreateIndex(
            "IX_UserLockoutHistory_UserId_IsActive",
            "UserLockoutHistory",
            new[] { "UserId", "IsActive" });

        migrationBuilder.CreateIndex(
            "IX_UserLockoutHistory_UserId_LockoutStart",
            "UserLockoutHistory",
            new[] { "UserId", "LockoutStart" });

        migrationBuilder.CreateIndex(
            "IX_UserLockoutHistory_UserId1",
            "UserLockoutHistory",
            "UserId1");

        migrationBuilder.CreateIndex(
            "IX_UserLoginAttempts_AttemptedAt",
            "UserLoginAttempts",
            "AttemptedAt");

        migrationBuilder.CreateIndex(
            "IX_UserLoginAttempts_EmailOrUsername",
            "UserLoginAttempts",
            "EmailOrUsername");

        migrationBuilder.CreateIndex(
            "IX_UserLoginAttempts_IpAddress",
            "UserLoginAttempts",
            "IpAddress");

        migrationBuilder.CreateIndex(
            "IX_UserLoginAttempts_IpAddress_AttemptedAt",
            "UserLoginAttempts",
            new[] { "IpAddress", "AttemptedAt" });

        migrationBuilder.CreateIndex(
            "IX_UserLoginAttempts_IsSuccessful",
            "UserLoginAttempts",
            "IsSuccessful");

        migrationBuilder.CreateIndex(
            "IX_UserLoginAttempts_IsSuspicious",
            "UserLoginAttempts",
            "IsSuspicious");

        migrationBuilder.CreateIndex(
            "IX_UserLoginAttempts_UserId",
            "UserLoginAttempts",
            "UserId");

        migrationBuilder.CreateIndex(
            "IX_UserLoginAttempts_UserId_AttemptedAt",
            "UserLoginAttempts",
            new[] { "UserId", "AttemptedAt" });

        migrationBuilder.CreateIndex(
            "IX_UserLoginAttempts_UserId1",
            "UserLoginAttempts",
            "UserId1");

        migrationBuilder.CreateIndex(
            "idx_user_logins_created_at",
            "UserLogins",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_user_logins_is_deleted",
            "UserLogins",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_user_logins_provider",
            "UserLogins",
            "LoginProvider");

        migrationBuilder.CreateIndex(
            "idx_user_logins_provider_key",
            "UserLogins",
            new[] { "LoginProvider", "ProviderKey" },
            unique: true);

        migrationBuilder.CreateIndex(
            "idx_user_logins_user_id",
            "UserLogins",
            "UserId");

        migrationBuilder.CreateIndex(
            "IX_UserLogins_CreatedBy",
            "UserLogins",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserLogins_UpdatedBy",
            "UserLogins",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_audit_logs_action",
            "UserMfaAuditLogs",
            "Action");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_audit_logs_action_success_timestamp",
            "UserMfaAuditLogs",
            new[] { "Action", "IsSuccess", "Timestamp" });

        migrationBuilder.CreateIndex(
            "idx_user_mfa_audit_logs_is_success",
            "UserMfaAuditLogs",
            "IsSuccess");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_audit_logs_mfa_settings_id",
            "UserMfaAuditLogs",
            "MfaSettingsId");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_audit_logs_session_id",
            "UserMfaAuditLogs",
            "SessionId");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_audit_logs_timestamp",
            "UserMfaAuditLogs",
            "Timestamp");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_audit_logs_triggered_alert",
            "UserMfaAuditLogs",
            "TriggeredAlert");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_audit_logs_user_id",
            "UserMfaAuditLogs",
            "UserId");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_audit_logs_user_timestamp",
            "UserMfaAuditLogs",
            new[] { "UserId", "Timestamp" });

        migrationBuilder.CreateIndex(
            "IX_UserMfaAuditLogs_CreatedBy",
            "UserMfaAuditLogs",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserMfaAuditLogs_UpdatedBy",
            "UserMfaAuditLogs",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_backup_codes_expires_at",
            "UserMfaBackupCodes",
            "ExpiresAt");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_backup_codes_generation_batch_id",
            "UserMfaBackupCodes",
            "GenerationBatchId");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_backup_codes_is_used",
            "UserMfaBackupCodes",
            "IsUsed");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_backup_codes_mfa_settings_id",
            "UserMfaBackupCodes",
            "MfaSettingsId");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_backup_codes_user_id",
            "UserMfaBackupCodes",
            "UserId");

        migrationBuilder.CreateIndex(
            "IX_UserMfaBackupCodes_CreatedBy",
            "UserMfaBackupCodes",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserMfaBackupCodes_UpdatedBy",
            "UserMfaBackupCodes",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_settings_is_enabled",
            "UserMfaSettings",
            "IsEnabled");

        migrationBuilder.CreateIndex(
            "idx_user_mfa_settings_is_enforced",
            "UserMfaSettings",
            "IsEnforced");

        migrationBuilder.CreateIndex(
            "IX_UserMfaSettings_CreatedBy",
            "UserMfaSettings",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserMfaSettings_UpdatedBy",
            "UserMfaSettings",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "uq_user_mfa_settings_user_id",
            "UserMfaSettings",
            "UserId",
            unique: true);

        migrationBuilder.CreateIndex(
            "idx_user_notification_settings_created_at",
            "UserNotificationSettings",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_user_notification_settings_email_enabled",
            "UserNotificationSettings",
            "EmailEnabled");

        migrationBuilder.CreateIndex(
            "idx_user_notification_settings_inapp_enabled",
            "UserNotificationSettings",
            "InAppEnabled");

        migrationBuilder.CreateIndex(
            "idx_user_notification_settings_is_deleted",
            "UserNotificationSettings",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_user_notification_settings_push_enabled",
            "UserNotificationSettings",
            "PushEnabled");

        migrationBuilder.CreateIndex(
            "idx_user_notification_settings_sms_enabled",
            "UserNotificationSettings",
            "SmsEnabled");

        migrationBuilder.CreateIndex(
            "idx_user_notification_settings_user_id",
            "UserNotificationSettings",
            "UserId",
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_UserNotificationSettings_CreatedBy",
            "UserNotificationSettings",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserNotificationSettings_UpdatedBy",
            "UserNotificationSettings",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserNotificationSettings_UserId1",
            "UserNotificationSettings",
            "UserId1",
            unique: true);

        migrationBuilder.CreateIndex(
            "idx_user_preferences_category",
            "UserPreferences",
            "Category");

        migrationBuilder.CreateIndex(
            "idx_user_preferences_created_at",
            "UserPreferences",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_user_preferences_is_active",
            "UserPreferences",
            "IsActive");

        migrationBuilder.CreateIndex(
            "idx_user_preferences_is_deleted",
            "UserPreferences",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_user_preferences_key",
            "UserPreferences",
            "Key");

        migrationBuilder.CreateIndex(
            "idx_user_preferences_user_category",
            "UserPreferences",
            new[] { "UserId", "Category" });

        migrationBuilder.CreateIndex(
            "idx_user_preferences_user_id",
            "UserPreferences",
            "UserId");

        migrationBuilder.CreateIndex(
            "idx_user_preferences_user_key",
            "UserPreferences",
            new[] { "UserId", "Key" },
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_UserPreferences_CreatedBy",
            "UserPreferences",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserPreferences_UpdatedBy",
            "UserPreferences",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_user_profiles_city",
            "UserProfiles",
            "City");

        migrationBuilder.CreateIndex(
            "idx_user_profiles_country",
            "UserProfiles",
            "Country");

        migrationBuilder.CreateIndex(
            "idx_user_profiles_created_at",
            "UserProfiles",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_user_profiles_is_deleted",
            "UserProfiles",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_user_profiles_language",
            "UserProfiles",
            "Language");

        migrationBuilder.CreateIndex(
            "idx_user_profiles_postal_code",
            "UserProfiles",
            "PostalCode");

        migrationBuilder.CreateIndex(
            "idx_user_profiles_timezone",
            "UserProfiles",
            "TimeZone");

        migrationBuilder.CreateIndex(
            "idx_user_profiles_user_id",
            "UserProfiles",
            "UserId");

        migrationBuilder.CreateIndex(
            "IX_UserProfiles_CreatedBy",
            "UserProfiles",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserProfiles_UpdatedBy",
            "UserProfiles",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_user_roles_created_at",
            "UserRoles",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_user_roles_expires_at",
            "UserRoles",
            "ExpiresAt");

        migrationBuilder.CreateIndex(
            "idx_user_roles_is_deleted",
            "UserRoles",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_user_roles_role_id",
            "UserRoles",
            "RoleId");

        migrationBuilder.CreateIndex(
            "idx_user_roles_user_id",
            "UserRoles",
            "UserId");

        migrationBuilder.CreateIndex(
            "idx_user_roles_user_role",
            "UserRoles",
            new[] { "UserId", "RoleId" },
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_UserRoles_CreatedBy",
            "UserRoles",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserRoles_UpdatedBy",
            "UserRoles",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "EmailIndex",
            "Users",
            "NormalizedEmail");

        migrationBuilder.CreateIndex(
            "idx_users_created_at",
            "Users",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_users_email",
            "Users",
            "Email",
            unique: true);

        migrationBuilder.CreateIndex(
            "idx_users_is_active",
            "Users",
            "IsActive");

        migrationBuilder.CreateIndex(
            "idx_users_is_deleted",
            "Users",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_users_phone_number",
            "Users",
            "PhoneNumber",
            unique: true);

        migrationBuilder.CreateIndex(
            "idx_users_updated_at",
            "Users",
            "UpdatedAt");

        migrationBuilder.CreateIndex(
            "idx_users_username",
            "Users",
            "UserName",
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_Users_CreatedBy",
            "Users",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_Users_UpdatedBy",
            "Users",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "UserNameIndex",
            "Users",
            "NormalizedUserName",
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_UserSecuritySettings_IsGlobalDefault",
            "UserSecuritySettings",
            "IsGlobalDefault");

        migrationBuilder.CreateIndex(
            "IX_UserSecuritySettings_UserId",
            "UserSecuritySettings",
            "UserId",
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_UserSecuritySettings_UserId1",
            "UserSecuritySettings",
            "UserId1");

        migrationBuilder.CreateIndex(
            "idx_user_sessions_created_at",
            "UserSessions",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_user_sessions_expires_at",
            "UserSessions",
            "ExpiresAt");

        migrationBuilder.CreateIndex(
            "idx_user_sessions_ip_address",
            "UserSessions",
            "IpAddress");

        migrationBuilder.CreateIndex(
            "idx_user_sessions_is_active",
            "UserSessions",
            "IsActive");

        migrationBuilder.CreateIndex(
            "idx_user_sessions_is_deleted",
            "UserSessions",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_user_sessions_last_accessed_at",
            "UserSessions",
            "LastAccessedAt");

        migrationBuilder.CreateIndex(
            "idx_user_sessions_refresh_token",
            "UserSessions",
            "RefreshToken",
            unique: true);

        migrationBuilder.CreateIndex(
            "idx_user_sessions_session_token",
            "UserSessions",
            "SessionToken",
            unique: true);

        migrationBuilder.CreateIndex(
            "idx_user_sessions_user_id",
            "UserSessions",
            "UserId");

        migrationBuilder.CreateIndex(
            "IX_UserSessions_CreatedBy",
            "UserSessions",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserSessions_UpdatedBy",
            "UserSessions",
            "UpdatedBy");

        migrationBuilder.CreateIndex(
            "idx_user_tokens_created_at",
            "UserTokens",
            "CreatedAt");

        migrationBuilder.CreateIndex(
            "idx_user_tokens_is_deleted",
            "UserTokens",
            "IsDeleted");

        migrationBuilder.CreateIndex(
            "idx_user_tokens_name",
            "UserTokens",
            "Name");

        migrationBuilder.CreateIndex(
            "idx_user_tokens_provider",
            "UserTokens",
            "LoginProvider");

        migrationBuilder.CreateIndex(
            "idx_user_tokens_user_id",
            "UserTokens",
            "UserId");

        migrationBuilder.CreateIndex(
            "idx_user_tokens_user_provider_name",
            "UserTokens",
            new[] { "UserId", "LoginProvider", "Name" },
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_UserTokens_CreatedBy",
            "UserTokens",
            "CreatedBy");

        migrationBuilder.CreateIndex(
            "IX_UserTokens_UpdatedBy",
            "UserTokens",
            "UpdatedBy");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            "RoleClaims");

        migrationBuilder.DropTable(
            "UserActivityLogs");

        migrationBuilder.DropTable(
            "UserApiKeys");

        migrationBuilder.DropTable(
            "UserClaims");

        migrationBuilder.DropTable(
            "UserEmailOtps");

        migrationBuilder.DropTable(
            "UserLockoutHistory");

        migrationBuilder.DropTable(
            "UserLoginAttempts");

        migrationBuilder.DropTable(
            "UserLogins");

        migrationBuilder.DropTable(
            "UserMfaAuditLogs");

        migrationBuilder.DropTable(
            "UserMfaBackupCodes");

        migrationBuilder.DropTable(
            "UserNotificationSettings");

        migrationBuilder.DropTable(
            "UserPreferences");

        migrationBuilder.DropTable(
            "UserProfiles");

        migrationBuilder.DropTable(
            "UserRoles");

        migrationBuilder.DropTable(
            "UserSecuritySettings");

        migrationBuilder.DropTable(
            "UserSessions");

        migrationBuilder.DropTable(
            "UserTokens");

        migrationBuilder.DropTable(
            "UserMfaSettings");

        migrationBuilder.DropTable(
            "Roles");

        migrationBuilder.DropTable(
            "Users");
    }
}