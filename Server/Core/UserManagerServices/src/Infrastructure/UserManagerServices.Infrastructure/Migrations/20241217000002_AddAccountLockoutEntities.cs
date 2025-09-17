using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserManagerServices.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAccountLockoutEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create UserSecuritySettings table
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
                    LockoutDurationMultiplier = table.Column<decimal>(type: "decimal(3,1)", nullable: false, defaultValue: 2.0m),
                    FailedAttemptWindowMinutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 60),
                    EnableProgressiveLockout = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    EnableSuspiciousActivityDetection = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    SuspiciousActivityThreshold = table.Column<decimal>(type: "decimal(3,2)", nullable: false, defaultValue: 0.7m),
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
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSecuritySettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSecuritySettings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.CheckConstraint("CK_UserSecuritySettings_MaxFailedLoginAttempts", "\"MaxFailedLoginAttempts\" > 0");
                    table.CheckConstraint("CK_UserSecuritySettings_InitialLockoutDurationMinutes", "\"InitialLockoutDurationMinutes\" > 0");
                    table.CheckConstraint("CK_UserSecuritySettings_MaxLockoutDurationMinutes", "\"MaxLockoutDurationMinutes\" >= \"InitialLockoutDurationMinutes\"");
                    table.CheckConstraint("CK_UserSecuritySettings_LockoutDurationMultiplier", "\"LockoutDurationMultiplier\" >= 1.0");
                    table.CheckConstraint("CK_UserSecuritySettings_SuspiciousActivityThreshold", "\"SuspiciousActivityThreshold\" >= 0.0 AND \"SuspiciousActivityThreshold\" <= 1.0");
                    table.CheckConstraint("CK_UserSecuritySettings_MaxConcurrentSessions", "\"MaxConcurrentSessions\" > 0");
                    table.CheckConstraint("CK_UserSecuritySettings_SessionTimeoutMinutes", "\"SessionTimeoutMinutes\" > 0");
                });

            // Create UserLoginAttempts table
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
                    RiskScore = table.Column<decimal>(type: "decimal(3,2)", nullable: false, defaultValue: 0.0m),
                    IsSuspicious = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    TriggeredLockout = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    SessionId = table.Column<Guid>(type: "uuid", nullable: true),
                    Details = table.Column<string>(type: "jsonb", nullable: true),
                    AttemptedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
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
                });

            // Create UserLockoutHistory table
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
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
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
                });

            // Create indexes for UserSecuritySettings
            migrationBuilder.CreateIndex(
                name: "IX_UserSecuritySettings_UserId",
                table: "UserSecuritySettings",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserSecuritySettings_IsGlobalDefault",
                table: "UserSecuritySettings",
                column: "IsGlobalDefault");

            // Create indexes for UserLoginAttempts
            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_UserId",
                table: "UserLoginAttempts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_EmailOrUsername",
                table: "UserLoginAttempts",
                column: "EmailOrUsername");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_IpAddress",
                table: "UserLoginAttempts",
                column: "IpAddress");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_AttemptedAt",
                table: "UserLoginAttempts",
                column: "AttemptedAt");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_IsSuccessful",
                table: "UserLoginAttempts",
                column: "IsSuccessful");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_IsSuspicious",
                table: "UserLoginAttempts",
                column: "IsSuspicious");

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_UserId_AttemptedAt",
                table: "UserLoginAttempts",
                columns: new[] { "UserId", "AttemptedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_IpAddress_AttemptedAt",
                table: "UserLoginAttempts",
                columns: new[] { "IpAddress", "AttemptedAt" });

            // Create indexes for UserLockoutHistory
            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_UserId",
                table: "UserLockoutHistory",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_LockoutStart",
                table: "UserLockoutHistory",
                column: "LockoutStart");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_LockoutEnd",
                table: "UserLockoutHistory",
                column: "LockoutEnd");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_IsActive",
                table: "UserLockoutHistory",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_LockoutType",
                table: "UserLockoutHistory",
                column: "LockoutType");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_LockoutReason",
                table: "UserLockoutHistory",
                column: "LockoutReason");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_UserId_IsActive",
                table: "UserLockoutHistory",
                columns: new[] { "UserId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_UserId_LockoutStart",
                table: "UserLockoutHistory",
                columns: new[] { "UserId", "LockoutStart" });

            // Insert default global security settings
            migrationBuilder.Sql(@"
                INSERT INTO ""UserSecuritySettings"" (
                    ""Id"", ""UserId"", ""IsGlobalDefault"", ""MaxFailedLoginAttempts"", 
                    ""InitialLockoutDurationMinutes"", ""MaxLockoutDurationMinutes"", 
                    ""LockoutDurationMultiplier"", ""FailedAttemptWindowMinutes"", 
                    ""EnableProgressiveLockout"", ""EnableSuspiciousActivityDetection"", 
                    ""SuspiciousActivityThreshold"", ""EnableGeolocationTracking"", 
                    ""BlockNewLocationLogins"", ""RequireEmailVerificationForNewLocations"", 
                    ""MaxConcurrentSessions"", ""SessionTimeoutMinutes"", 
                    ""EnableDeviceFingerprinting"", ""SendSecurityAlerts"", 
                    ""LogSecurityEvents"", ""SecurityLogRetentionDays"", 
                    ""AutoUnlockAfterLockoutPeriod"", ""CreatedAt"", ""IsDeleted""
                ) VALUES (
                    gen_random_uuid(), NULL, true, 5, 15, 1440, 2.0, 60, 
                    true, true, 0.7, true, false, true, 5, 60, 
                    true, true, true, 90, true, CURRENT_TIMESTAMP, false
                );
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "UserLoginAttempts");
            migrationBuilder.DropTable(name: "UserLockoutHistory");
            migrationBuilder.DropTable(name: "UserSecuritySettings");
        }
    }
}
