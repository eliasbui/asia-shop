using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserManagerServices.Infrastructure.Migrations.User
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Gender = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastLogoutAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastLoginIp = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    LastLogoutIp = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Users_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    IsSystemRole = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Roles_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Roles_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "UserActivityLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Action = table.Column<int>(type: "int", nullable: false),
                    Entity = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    EntityId = table.Column<Guid>(type: "uuid", nullable: true),
                    Details = table.Column<string>(type: "jsonb", nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserActivityLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserActivityLogs_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserActivityLogs_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserActivityLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "UserApiKeys",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    KeyName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    KeyValue = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Permissions = table.Column<string>(type: "jsonb", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastUsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RequestLimit = table.Column<int>(type: "integer", nullable: false, defaultValue: 1000),
                    RequestCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IpWhitelist = table.Column<string>(type: "jsonb", nullable: true),
                    IpBlacklist = table.Column<string[]>(type: "jsonb", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserApiKeys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserApiKeys_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserApiKeys_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserApiKeys_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClaimType = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ClaimValue = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserClaims_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserClaims_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserClaims_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserEmailOtps",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    OtpHash = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    EmailAddress = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Purpose = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UsedFromIp = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    UsedFromUserAgent = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AttemptCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    MaxAttempts = table.Column<int>(type: "integer", nullable: false, defaultValue: 3),
                    IsBlocked = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    BlockedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SessionId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserEmailOtps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserEmailOtps_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserEmailOtps_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserEmailOtps_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLockoutHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    LockoutType = table.Column<int>(type: "int", nullable: false),
                    LockoutReason = table.Column<int>(type: "int", nullable: false),
                    LockoutStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    LockoutEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DurationMinutes = table.Column<int>(type: "integer", nullable: true),
                    FailedAttemptCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    LockoutLevel = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    TriggeringIpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    IsManualLockout = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    LockedByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ReleasedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReleaseReason = table.Column<int>(type: "int", nullable: true),
                    ReleasedByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    Details = table.Column<string>(type: "jsonb", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UserId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLockoutHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserLockoutHistory_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserLockoutHistory_Users_UserId1",
                        column: x => x.UserId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserLoginAttempts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    EmailOrUsername = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    IsSuccessful = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    FailureReason = table.Column<int>(type: "int", nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: false),
                    UserAgent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    LocationInfo = table.Column<string>(type: "jsonb", nullable: true),
                    DeviceFingerprint = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    RiskScore = table.Column<decimal>(type: "numeric(3,2)", nullable: false, defaultValue: 0.0m),
                    IsSuspicious = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    TriggeredLockout = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    SessionId = table.Column<Guid>(type: "uuid", nullable: true),
                    Details = table.Column<string>(type: "jsonb", nullable: true),
                    AttemptedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UserId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLoginAttempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserLoginAttempts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserLoginAttempts_Users_UserId1",
                        column: x => x.UserId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    LoginProvider = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    ProviderKey = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserLogins_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserLogins_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserLogins_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserMfaSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsTotpEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsEmailOtpEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsBackupCodesEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    TotpSecretKey = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    BackupCodesRemaining = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    LastUsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EnabledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DisabledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DisabledReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsEnforced = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    EnforcementGracePeriodEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMfaSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserMfaSettings_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserMfaSettings_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserMfaSettings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserNotificationSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    EmailEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    EmailSecurityAlerts = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    EmailAccountUpdates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    EmailMarketing = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    EmailNewsletter = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    EmailSystemNotifications = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    SmsEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    SmsSecurityAlerts = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    SmsAccountUpdates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    SmsTwoFactorAuth = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    PushEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    PushSecurityAlerts = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    PushAccountUpdates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    PushSystemNotifications = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    InAppEnabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    InAppSecurityAlerts = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    InAppAccountUpdates = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    InAppSystemNotifications = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    DoNotDisturb = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DoNotDisturbStart = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    DoNotDisturbEnd = table.Column<TimeOnly>(type: "time without time zone", nullable: true),
                    TimeZone = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true, defaultValue: "UTC"),
                    Frequency = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true, defaultValue: "immediate"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UserId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserNotificationSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserNotificationSettings_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserNotificationSettings_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserNotificationSettings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserNotificationSettings_Users_UserId1",
                        column: x => x.UserId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    DataType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPreferences_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserPreferences_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserPreferences_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    PostalCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Province = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    State = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    District = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    TimeZone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true, defaultValue: "UTC"),
                    Language = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true, defaultValue: "en"),
                    Preferences = table.Column<string>(type: "jsonb", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfiles_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserProfiles_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserSecuritySettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsGlobalDefault = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    MaxFailedLoginAttempts = table.Column<int>(type: "integer", nullable: false, defaultValue: 5),
                    InitialLockoutDurationMinutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 15),
                    MaxLockoutDurationMinutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 1440),
                    LockoutDurationMultiplier = table.Column<decimal>(type: "numeric(3,1)", nullable: false, defaultValue: 2.0m),
                    FailedAttemptWindowMinutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 60),
                    EnableProgressiveLockout = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    EnableSuspiciousActivityDetection = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    SuspiciousActivityThreshold = table.Column<decimal>(type: "numeric(3,2)", nullable: false, defaultValue: 0.7m),
                    EnableGeolocationTracking = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    BlockNewLocationLogins = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    RequireEmailVerificationForNewLocations = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    MaxConcurrentSessions = table.Column<int>(type: "integer", nullable: false, defaultValue: 5),
                    SessionTimeoutMinutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 60),
                    EnableDeviceFingerprinting = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    SendSecurityAlerts = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    LogSecurityEvents = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    SecurityLogRetentionDays = table.Column<int>(type: "integer", nullable: false, defaultValue: 90),
                    AutoUnlockAfterLockoutPeriod = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    AdditionalSettings = table.Column<string>(type: "jsonb", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UserId1 = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSecuritySettings", x => x.Id);
                    table.CheckConstraint("CK_UserSecuritySettings_InitialLockoutDurationMinutes", "\"InitialLockoutDurationMinutes\" > 0");
                    table.CheckConstraint("CK_UserSecuritySettings_LockoutDurationMultiplier", "\"LockoutDurationMultiplier\" >= 1.0");
                    table.CheckConstraint("CK_UserSecuritySettings_MaxConcurrentSessions", "\"MaxConcurrentSessions\" > 0");
                    table.CheckConstraint("CK_UserSecuritySettings_MaxFailedLoginAttempts", "\"MaxFailedLoginAttempts\" > 0");
                    table.CheckConstraint("CK_UserSecuritySettings_MaxLockoutDurationMinutes", "\"MaxLockoutDurationMinutes\" >= \"InitialLockoutDurationMinutes\"");
                    table.CheckConstraint("CK_UserSecuritySettings_SessionTimeoutMinutes", "\"SessionTimeoutMinutes\" > 0");
                    table.CheckConstraint("CK_UserSecuritySettings_SuspiciousActivityThreshold", "\"SuspiciousActivityThreshold\" >= 0.0 AND \"SuspiciousActivityThreshold\" <= 1.0");
                    table.ForeignKey(
                        name: "FK_UserSecuritySettings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserSecuritySettings_Users_UserId1",
                        column: x => x.UserId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SessionToken = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    RefreshToken = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    OperatingSystem = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Browser = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Location = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DeviceInfo = table.Column<string>(type: "jsonb", nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: false),
                    UserAgent = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastAccessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSessions_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserSessions_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserSessions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    LoginProvider = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Value = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserTokens_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserTokens_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClaimType = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ClaimValue = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaims_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoleClaims_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserRoles_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserRoles_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserMfaAuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MfaSettingsId = table.Column<Guid>(type: "uuid", nullable: true),
                    Action = table.Column<int>(type: "int", nullable: false),
                    Method = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    IsSuccess = table.Column<bool>(type: "boolean", nullable: false),
                    FailureReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    LocationInfo = table.Column<string>(type: "jsonb", nullable: true),
                    Details = table.Column<string>(type: "jsonb", nullable: true),
                    SessionId = table.Column<Guid>(type: "uuid", nullable: true),
                    RiskScore = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    TriggeredAlert = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DisabledReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMfaAuditLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserMfaAuditLogs_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserMfaAuditLogs_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserMfaAuditLogs_UserMfaSettings_MfaSettingsId",
                        column: x => x.MfaSettingsId,
                        principalTable: "UserMfaSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserMfaAuditLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "UserMfaBackupCodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    MfaSettingsId = table.Column<Guid>(type: "uuid", nullable: false),
                    CodeHash = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UsedFromIp = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    UsedFromUserAgent = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GenerationBatchId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMfaBackupCodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserMfaBackupCodes_CreatedBy_Users_Id",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserMfaBackupCodes_UpdatedBy_Users_Id",
                        column: x => x.UpdatedBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserMfaBackupCodes_UserMfaSettings_MfaSettingsId",
                        column: x => x.MfaSettingsId,
                        principalTable: "UserMfaSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserMfaBackupCodes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "idx_role_claims_claim_type",
                table: "RoleClaims",
                column: "ClaimType");

            migrationBuilder.CreateIndex(
                name: "idx_role_claims_created_at",
                table: "RoleClaims",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_role_claims_is_deleted",
                table: "RoleClaims",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_role_claims_role_claim_type",
                table: "RoleClaims",
                columns: new[] { "RoleId", "ClaimType" });

            migrationBuilder.CreateIndex(
                name: "idx_role_claims_role_id",
                table: "RoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_CreatedBy",
                table: "RoleClaims",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_UpdatedBy",
                table: "RoleClaims",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_roles_created_at",
                table: "Roles",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_roles_is_active",
                table: "Roles",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "idx_roles_is_deleted",
                table: "Roles",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_roles_is_system_role",
                table: "Roles",
                column: "IsSystemRole");

            migrationBuilder.CreateIndex(
                name: "idx_roles_name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_roles_normalized_name",
                table: "Roles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_CreatedBy",
                table: "Roles",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_UpdatedBy",
                table: "Roles",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_user_activity_logs_action",
                table: "UserActivityLogs",
                column: "Action");

            migrationBuilder.CreateIndex(
                name: "idx_user_activity_logs_created_at",
                table: "UserActivityLogs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_activity_logs_entity",
                table: "UserActivityLogs",
                column: "Entity");

            migrationBuilder.CreateIndex(
                name: "idx_user_activity_logs_entity_id",
                table: "UserActivityLogs",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "idx_user_activity_logs_ip_address",
                table: "UserActivityLogs",
                column: "IpAddress");

            migrationBuilder.CreateIndex(
                name: "idx_user_activity_logs_is_deleted",
                table: "UserActivityLogs",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_user_activity_logs_timestamp",
                table: "UserActivityLogs",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "idx_user_activity_logs_user_action_time",
                table: "UserActivityLogs",
                columns: new[] { "UserId", "Action", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "idx_user_activity_logs_user_id",
                table: "UserActivityLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserActivityLogs_CreatedBy",
                table: "UserActivityLogs",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserActivityLogs_UpdatedBy",
                table: "UserActivityLogs",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_user_api_keys_created_at",
                table: "UserApiKeys",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_api_keys_expires_at",
                table: "UserApiKeys",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_api_keys_is_active",
                table: "UserApiKeys",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "idx_user_api_keys_is_deleted",
                table: "UserApiKeys",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_user_api_keys_key_name",
                table: "UserApiKeys",
                column: "KeyName");

            migrationBuilder.CreateIndex(
                name: "idx_user_api_keys_key_value",
                table: "UserApiKeys",
                column: "KeyValue",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_user_api_keys_last_used_at",
                table: "UserApiKeys",
                column: "LastUsedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_api_keys_user_id",
                table: "UserApiKeys",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "idx_user_api_keys_user_name",
                table: "UserApiKeys",
                columns: new[] { "UserId", "KeyName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserApiKeys_CreatedBy",
                table: "UserApiKeys",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserApiKeys_UpdatedBy",
                table: "UserApiKeys",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_user_claims_claim_type",
                table: "UserClaims",
                column: "ClaimType");

            migrationBuilder.CreateIndex(
                name: "idx_user_claims_created_at",
                table: "UserClaims",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_claims_is_deleted",
                table: "UserClaims",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_user_claims_user_claim_type",
                table: "UserClaims",
                columns: new[] { "UserId", "ClaimType" });

            migrationBuilder.CreateIndex(
                name: "idx_user_claims_user_id",
                table: "UserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserClaims_CreatedBy",
                table: "UserClaims",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserClaims_UpdatedBy",
                table: "UserClaims",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_user_email_otps_email_address",
                table: "UserEmailOtps",
                column: "EmailAddress");

            migrationBuilder.CreateIndex(
                name: "idx_user_email_otps_expires_at",
                table: "UserEmailOtps",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_email_otps_expires_used",
                table: "UserEmailOtps",
                columns: new[] { "ExpiresAt", "IsUsed" });

            migrationBuilder.CreateIndex(
                name: "idx_user_email_otps_is_blocked",
                table: "UserEmailOtps",
                column: "IsBlocked");

            migrationBuilder.CreateIndex(
                name: "idx_user_email_otps_is_used",
                table: "UserEmailOtps",
                column: "IsUsed");

            migrationBuilder.CreateIndex(
                name: "idx_user_email_otps_purpose",
                table: "UserEmailOtps",
                column: "Purpose");

            migrationBuilder.CreateIndex(
                name: "idx_user_email_otps_session_id",
                table: "UserEmailOtps",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "idx_user_email_otps_user_id",
                table: "UserEmailOtps",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "idx_user_email_otps_user_purpose_used",
                table: "UserEmailOtps",
                columns: new[] { "UserId", "Purpose", "IsUsed" });

            migrationBuilder.CreateIndex(
                name: "IX_UserEmailOtps_CreatedBy",
                table: "UserEmailOtps",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserEmailOtps_UpdatedBy",
                table: "UserEmailOtps",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_IsActive",
                table: "UserLockoutHistory",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_LockoutEnd",
                table: "UserLockoutHistory",
                column: "LockoutEnd");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_LockoutReason",
                table: "UserLockoutHistory",
                column: "LockoutReason");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_LockoutStart",
                table: "UserLockoutHistory",
                column: "LockoutStart");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_LockoutType",
                table: "UserLockoutHistory",
                column: "LockoutType");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_UserId",
                table: "UserLockoutHistory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_UserId_IsActive",
                table: "UserLockoutHistory",
                columns: new[] { "UserId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_UserId_LockoutStart",
                table: "UserLockoutHistory",
                columns: new[] { "UserId", "LockoutStart" });

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_UserId1",
                table: "UserLockoutHistory",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_AttemptedAt",
                table: "UserLoginAttempts",
                column: "AttemptedAt");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_EmailOrUsername",
                table: "UserLoginAttempts",
                column: "EmailOrUsername");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_IpAddress",
                table: "UserLoginAttempts",
                column: "IpAddress");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_IpAddress_AttemptedAt",
                table: "UserLoginAttempts",
                columns: new[] { "IpAddress", "AttemptedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_IsSuccessful",
                table: "UserLoginAttempts",
                column: "IsSuccessful");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_IsSuspicious",
                table: "UserLoginAttempts",
                column: "IsSuspicious");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_UserId",
                table: "UserLoginAttempts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_UserId_AttemptedAt",
                table: "UserLoginAttempts",
                columns: new[] { "UserId", "AttemptedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_UserId1",
                table: "UserLoginAttempts",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "idx_user_logins_created_at",
                table: "UserLogins",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_logins_is_deleted",
                table: "UserLogins",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_user_logins_provider",
                table: "UserLogins",
                column: "LoginProvider");

            migrationBuilder.CreateIndex(
                name: "idx_user_logins_provider_key",
                table: "UserLogins",
                columns: new[] { "LoginProvider", "ProviderKey" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_user_logins_user_id",
                table: "UserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_CreatedBy",
                table: "UserLogins",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_UpdatedBy",
                table: "UserLogins",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_audit_logs_action",
                table: "UserMfaAuditLogs",
                column: "Action");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_audit_logs_action_success_timestamp",
                table: "UserMfaAuditLogs",
                columns: new[] { "Action", "IsSuccess", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_audit_logs_is_success",
                table: "UserMfaAuditLogs",
                column: "IsSuccess");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_audit_logs_mfa_settings_id",
                table: "UserMfaAuditLogs",
                column: "MfaSettingsId");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_audit_logs_session_id",
                table: "UserMfaAuditLogs",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_audit_logs_timestamp",
                table: "UserMfaAuditLogs",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_audit_logs_triggered_alert",
                table: "UserMfaAuditLogs",
                column: "TriggeredAlert");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_audit_logs_user_id",
                table: "UserMfaAuditLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_audit_logs_user_timestamp",
                table: "UserMfaAuditLogs",
                columns: new[] { "UserId", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_UserMfaAuditLogs_CreatedBy",
                table: "UserMfaAuditLogs",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserMfaAuditLogs_UpdatedBy",
                table: "UserMfaAuditLogs",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_backup_codes_expires_at",
                table: "UserMfaBackupCodes",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_backup_codes_generation_batch_id",
                table: "UserMfaBackupCodes",
                column: "GenerationBatchId");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_backup_codes_is_used",
                table: "UserMfaBackupCodes",
                column: "IsUsed");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_backup_codes_mfa_settings_id",
                table: "UserMfaBackupCodes",
                column: "MfaSettingsId");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_backup_codes_user_id",
                table: "UserMfaBackupCodes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMfaBackupCodes_CreatedBy",
                table: "UserMfaBackupCodes",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserMfaBackupCodes_UpdatedBy",
                table: "UserMfaBackupCodes",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_settings_is_enabled",
                table: "UserMfaSettings",
                column: "IsEnabled");

            migrationBuilder.CreateIndex(
                name: "idx_user_mfa_settings_is_enforced",
                table: "UserMfaSettings",
                column: "IsEnforced");

            migrationBuilder.CreateIndex(
                name: "IX_UserMfaSettings_CreatedBy",
                table: "UserMfaSettings",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserMfaSettings_UpdatedBy",
                table: "UserMfaSettings",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "uq_user_mfa_settings_user_id",
                table: "UserMfaSettings",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_user_notification_settings_created_at",
                table: "UserNotificationSettings",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_notification_settings_email_enabled",
                table: "UserNotificationSettings",
                column: "EmailEnabled");

            migrationBuilder.CreateIndex(
                name: "idx_user_notification_settings_inapp_enabled",
                table: "UserNotificationSettings",
                column: "InAppEnabled");

            migrationBuilder.CreateIndex(
                name: "idx_user_notification_settings_is_deleted",
                table: "UserNotificationSettings",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_user_notification_settings_push_enabled",
                table: "UserNotificationSettings",
                column: "PushEnabled");

            migrationBuilder.CreateIndex(
                name: "idx_user_notification_settings_sms_enabled",
                table: "UserNotificationSettings",
                column: "SmsEnabled");

            migrationBuilder.CreateIndex(
                name: "idx_user_notification_settings_user_id",
                table: "UserNotificationSettings",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserNotificationSettings_CreatedBy",
                table: "UserNotificationSettings",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserNotificationSettings_UpdatedBy",
                table: "UserNotificationSettings",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserNotificationSettings_UserId1",
                table: "UserNotificationSettings",
                column: "UserId1",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_user_preferences_category",
                table: "UserPreferences",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "idx_user_preferences_created_at",
                table: "UserPreferences",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_preferences_is_active",
                table: "UserPreferences",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "idx_user_preferences_is_deleted",
                table: "UserPreferences",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_user_preferences_key",
                table: "UserPreferences",
                column: "Key");

            migrationBuilder.CreateIndex(
                name: "idx_user_preferences_user_category",
                table: "UserPreferences",
                columns: new[] { "UserId", "Category" });

            migrationBuilder.CreateIndex(
                name: "idx_user_preferences_user_id",
                table: "UserPreferences",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "idx_user_preferences_user_key",
                table: "UserPreferences",
                columns: new[] { "UserId", "Key" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferences_CreatedBy",
                table: "UserPreferences",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferences_UpdatedBy",
                table: "UserPreferences",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_user_profiles_city",
                table: "UserProfiles",
                column: "City");

            migrationBuilder.CreateIndex(
                name: "idx_user_profiles_country",
                table: "UserProfiles",
                column: "Country");

            migrationBuilder.CreateIndex(
                name: "idx_user_profiles_created_at",
                table: "UserProfiles",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_profiles_is_deleted",
                table: "UserProfiles",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_user_profiles_language",
                table: "UserProfiles",
                column: "Language");

            migrationBuilder.CreateIndex(
                name: "idx_user_profiles_postal_code",
                table: "UserProfiles",
                column: "PostalCode");

            migrationBuilder.CreateIndex(
                name: "idx_user_profiles_timezone",
                table: "UserProfiles",
                column: "TimeZone");

            migrationBuilder.CreateIndex(
                name: "idx_user_profiles_user_id",
                table: "UserProfiles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_CreatedBy",
                table: "UserProfiles",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UpdatedBy",
                table: "UserProfiles",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_user_roles_created_at",
                table: "UserRoles",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_roles_expires_at",
                table: "UserRoles",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_roles_is_deleted",
                table: "UserRoles",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_user_roles_role_id",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "idx_user_roles_user_id",
                table: "UserRoles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "idx_user_roles_user_role",
                table: "UserRoles",
                columns: new[] { "UserId", "RoleId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_CreatedBy",
                table: "UserRoles",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UpdatedBy",
                table: "UserRoles",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "Users",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "idx_users_created_at",
                table: "Users",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_users_email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_users_is_active",
                table: "Users",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "idx_users_is_deleted",
                table: "Users",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_users_phone_number",
                table: "Users",
                column: "PhoneNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_users_updated_at",
                table: "Users",
                column: "UpdatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_users_username",
                table: "Users",
                column: "UserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_CreatedBy",
                table: "Users",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UpdatedBy",
                table: "Users",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "Users",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserSecuritySettings_IsGlobalDefault",
                table: "UserSecuritySettings",
                column: "IsGlobalDefault");

            migrationBuilder.CreateIndex(
                name: "IX_UserSecuritySettings_UserId",
                table: "UserSecuritySettings",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserSecuritySettings_UserId1",
                table: "UserSecuritySettings",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "idx_user_sessions_created_at",
                table: "UserSessions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_sessions_expires_at",
                table: "UserSessions",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_sessions_ip_address",
                table: "UserSessions",
                column: "IpAddress");

            migrationBuilder.CreateIndex(
                name: "idx_user_sessions_is_active",
                table: "UserSessions",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "idx_user_sessions_is_deleted",
                table: "UserSessions",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_user_sessions_last_accessed_at",
                table: "UserSessions",
                column: "LastAccessedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_sessions_refresh_token",
                table: "UserSessions",
                column: "RefreshToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_user_sessions_session_token",
                table: "UserSessions",
                column: "SessionToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "idx_user_sessions_user_id",
                table: "UserSessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSessions_CreatedBy",
                table: "UserSessions",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserSessions_UpdatedBy",
                table: "UserSessions",
                column: "UpdatedBy");

            migrationBuilder.CreateIndex(
                name: "idx_user_tokens_created_at",
                table: "UserTokens",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "idx_user_tokens_is_deleted",
                table: "UserTokens",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "idx_user_tokens_name",
                table: "UserTokens",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "idx_user_tokens_provider",
                table: "UserTokens",
                column: "LoginProvider");

            migrationBuilder.CreateIndex(
                name: "idx_user_tokens_user_id",
                table: "UserTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "idx_user_tokens_user_provider_name",
                table: "UserTokens",
                columns: new[] { "UserId", "LoginProvider", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserTokens_CreatedBy",
                table: "UserTokens",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserTokens_UpdatedBy",
                table: "UserTokens",
                column: "UpdatedBy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoleClaims");

            migrationBuilder.DropTable(
                name: "UserActivityLogs");

            migrationBuilder.DropTable(
                name: "UserApiKeys");

            migrationBuilder.DropTable(
                name: "UserClaims");

            migrationBuilder.DropTable(
                name: "UserEmailOtps");

            migrationBuilder.DropTable(
                name: "UserLockoutHistory");

            migrationBuilder.DropTable(
                name: "UserLoginAttempts");

            migrationBuilder.DropTable(
                name: "UserLogins");

            migrationBuilder.DropTable(
                name: "UserMfaAuditLogs");

            migrationBuilder.DropTable(
                name: "UserMfaBackupCodes");

            migrationBuilder.DropTable(
                name: "UserNotificationSettings");

            migrationBuilder.DropTable(
                name: "UserPreferences");

            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "UserSecuritySettings");

            migrationBuilder.DropTable(
                name: "UserSessions");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropTable(
                name: "UserMfaSettings");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
