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
public partial class updateuserconsent : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            "UserConsents",
            table => new
            {
                Id = table.Column<Guid>("uuid", nullable: false),
                UserId = table.Column<Guid>("uuid", nullable: false),
                ConsentType = table.Column<int>("integer", nullable: false),
                Purpose = table.Column<string>("character varying(200)", maxLength: 200, nullable: false),
                Description = table.Column<string>("character varying(1000)", maxLength: 1000, nullable: false),
                Status = table.Column<int>("integer", nullable: false, defaultValue: 0),
                ConsentVersion = table.Column<string>("character varying(20)", maxLength: 20, nullable: false,
                    defaultValue: "1.0"),
                ConsentGivenAt = table.Column<DateTime>("timestamp with time zone", nullable: false),
                ConsentUpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                ConsentWithdrawnAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                ExpiresAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                ConsentMethod = table.Column<int>("integer", nullable: false, defaultValue: 0),
                ConsentIpAddress = table.Column<string>("character varying(45)", maxLength: 45, nullable: true),
                ConsentUserAgent = table.Column<string>("character varying(1000)", maxLength: 1000, nullable: true),
                ConsentSource = table.Column<string>("character varying(200)", maxLength: 200, nullable: true),
                IsMandatory = table.Column<bool>("boolean", nullable: false, defaultValue: false),
                IsWithdrawable = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                LegalBasis = table.Column<string>("character varying(500)", maxLength: 500, nullable: true),
                DataCategories = table.Column<string>("jsonb", nullable: false),
                ProcessingActivities = table.Column<string>("jsonb", nullable: false),
                ThirdParties = table.Column<string>("jsonb", nullable: true),
                RetentionPeriod = table.Column<string>("character varying(100)", maxLength: 100, nullable: true),
                Metadata = table.Column<string>("jsonb", nullable: true),
                ConsentProof = table.Column<string>("jsonb", nullable: true),
                WasInformed = table.Column<bool>("boolean", nullable: false, defaultValue: true),
                InformationProvided = table.Column<string>("character varying(2000)", maxLength: 2000, nullable: true),
                ConsentLanguage = table.Column<string>("character varying(10)", maxLength: 10, nullable: true),
                ParentConsentId = table.Column<Guid>("uuid", nullable: true),
                WithdrawalReason = table.Column<string>("character varying(500)", maxLength: 500, nullable: true),
                WithdrawalMethod = table.Column<int>("integer", nullable: true),
                WithdrawalIpAddress = table.Column<string>("character varying(45)", maxLength: 45, nullable: true),
                WithdrawalUserAgent = table.Column<string>("character varying(1000)", maxLength: 1000, nullable: true),
                CreatedAt = table.Column<DateTime>("timestamp with time zone", nullable: false,
                    defaultValueSql: "CURRENT_TIMESTAMP"),
                UpdatedAt = table.Column<DateTime>("timestamp with time zone", nullable: true),
                CreatedBy = table.Column<Guid>("uuid", nullable: true),
                UpdatedBy = table.Column<Guid>("uuid", nullable: true),
                IsDeleted = table.Column<bool>("boolean", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserConsents", x => x.Id);
                table.ForeignKey(
                    "FK_UserConsents_ParentConsent",
                    x => x.ParentConsentId,
                    "UserConsents",
                    "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    "FK_UserConsents_Users_UserId",
                    x => x.UserId,
                    "Users",
                    "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            "IX_UserConsents_ConsentGivenAt",
            "UserConsents",
            "ConsentGivenAt");

        migrationBuilder.CreateIndex(
            "IX_UserConsents_ExpiresAt",
            "UserConsents",
            "ExpiresAt",
            filter: "\"ExpiresAt\" IS NOT NULL");

        migrationBuilder.CreateIndex(
            "IX_UserConsents_ParentConsentId",
            "UserConsents",
            "ParentConsentId");

        migrationBuilder.CreateIndex(
            "IX_UserConsents_Status",
            "UserConsents",
            "Status");

        migrationBuilder.CreateIndex(
            "IX_UserConsents_UserId",
            "UserConsents",
            "UserId");

        migrationBuilder.CreateIndex(
            "IX_UserConsents_UserId_ConsentType",
            "UserConsents",
            new[] { "UserId", "ConsentType" });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            "UserConsents");
    }
}