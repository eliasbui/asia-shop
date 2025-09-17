using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserManagerServices.Infrastructure.Migrations.User
{
    /// <inheritdoc />
    public partial class updateuserconsent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserConsents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ConsentType = table.Column<int>(type: "integer", nullable: false),
                    Purpose = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    ConsentVersion = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "1.0"),
                    ConsentGivenAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ConsentUpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ConsentWithdrawnAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ConsentMethod = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    ConsentIpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    ConsentUserAgent = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ConsentSource = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    IsMandatory = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    IsWithdrawable = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    LegalBasis = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DataCategories = table.Column<string>(type: "jsonb", nullable: false),
                    ProcessingActivities = table.Column<string>(type: "jsonb", nullable: false),
                    ThirdParties = table.Column<string>(type: "jsonb", nullable: true),
                    RetentionPeriod = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Metadata = table.Column<string>(type: "jsonb", nullable: true),
                    ConsentProof = table.Column<string>(type: "jsonb", nullable: true),
                    WasInformed = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    InformationProvided = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ConsentLanguage = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    ParentConsentId = table.Column<Guid>(type: "uuid", nullable: true),
                    WithdrawalReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    WithdrawalMethod = table.Column<int>(type: "integer", nullable: true),
                    WithdrawalIpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    WithdrawalUserAgent = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    UpdatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserConsents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserConsents_ParentConsent",
                        column: x => x.ParentConsentId,
                        principalTable: "UserConsents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserConsents_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserConsents_ConsentGivenAt",
                table: "UserConsents",
                column: "ConsentGivenAt");

            migrationBuilder.CreateIndex(
                name: "IX_UserConsents_ExpiresAt",
                table: "UserConsents",
                column: "ExpiresAt",
                filter: "\"ExpiresAt\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_UserConsents_ParentConsentId",
                table: "UserConsents",
                column: "ParentConsentId");

            migrationBuilder.CreateIndex(
                name: "IX_UserConsents_Status",
                table: "UserConsents",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_UserConsents_UserId",
                table: "UserConsents",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserConsents_UserId_ConsentType",
                table: "UserConsents",
                columns: new[] { "UserId", "ConsentType" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserConsents");
        }
    }
}
