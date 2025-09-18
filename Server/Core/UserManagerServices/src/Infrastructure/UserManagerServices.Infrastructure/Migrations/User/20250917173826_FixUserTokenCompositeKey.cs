#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserManagerServices.Infrastructure.Migrations.User;

/// <inheritdoc />
public partial class FixUserTokenCompositeKey : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropPrimaryKey(
            "PK_UserTokens",
            "UserTokens");

        migrationBuilder.DropIndex(
            "idx_user_tokens_user_provider_name",
            "UserTokens");

        migrationBuilder.AddPrimaryKey(
            "PK_UserTokens",
            "UserTokens",
            new[] { "UserId", "LoginProvider", "Name" });

        migrationBuilder.CreateIndex(
            "idx_user_tokens_id",
            "UserTokens",
            "Id",
            unique: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropPrimaryKey(
            "PK_UserTokens",
            "UserTokens");

        migrationBuilder.DropIndex(
            "idx_user_tokens_id",
            "UserTokens");

        migrationBuilder.AddPrimaryKey(
            "PK_UserTokens",
            "UserTokens",
            "Id");

        migrationBuilder.CreateIndex(
            "idx_user_tokens_user_provider_name",
            "UserTokens",
            new[] { "UserId", "LoginProvider", "Name" },
            unique: true);
    }
}