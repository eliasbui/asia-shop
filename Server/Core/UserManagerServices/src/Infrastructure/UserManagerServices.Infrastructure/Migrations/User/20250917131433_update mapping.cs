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
public partial class updatemapping : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            "FK_UserLockoutHistory_Users_UserId1",
            "UserLockoutHistory");

        migrationBuilder.DropForeignKey(
            "FK_UserLoginAttempts_Users_UserId1",
            "UserLoginAttempts");

        migrationBuilder.DropForeignKey(
            "FK_UserNotificationSettings_Users_UserId1",
            "UserNotificationSettings");

        migrationBuilder.DropForeignKey(
            "FK_UserSecuritySettings_Users_UserId1",
            "UserSecuritySettings");

        migrationBuilder.DropIndex(
            "IX_UserSecuritySettings_UserId1",
            "UserSecuritySettings");

        migrationBuilder.DropIndex(
            "IX_UserNotificationSettings_UserId1",
            "UserNotificationSettings");

        migrationBuilder.DropIndex(
            "IX_UserLoginAttempts_UserId1",
            "UserLoginAttempts");

        migrationBuilder.DropIndex(
            "IX_UserLockoutHistory_UserId1",
            "UserLockoutHistory");

        migrationBuilder.DropColumn(
            "UserId1",
            "UserSecuritySettings");

        migrationBuilder.DropColumn(
            "UserId1",
            "UserNotificationSettings");

        migrationBuilder.DropColumn(
            "UserId1",
            "UserLoginAttempts");

        migrationBuilder.DropColumn(
            "UserId1",
            "UserLockoutHistory");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<Guid>(
            "UserId1",
            "UserSecuritySettings",
            "uuid",
            nullable: true);

        migrationBuilder.AddColumn<Guid>(
            "UserId1",
            "UserNotificationSettings",
            "uuid",
            nullable: true);

        migrationBuilder.AddColumn<Guid>(
            "UserId1",
            "UserLoginAttempts",
            "uuid",
            nullable: true);

        migrationBuilder.AddColumn<Guid>(
            "UserId1",
            "UserLockoutHistory",
            "uuid",
            nullable: true);

        migrationBuilder.CreateIndex(
            "IX_UserSecuritySettings_UserId1",
            "UserSecuritySettings",
            "UserId1");

        migrationBuilder.CreateIndex(
            "IX_UserNotificationSettings_UserId1",
            "UserNotificationSettings",
            "UserId1",
            unique: true);

        migrationBuilder.CreateIndex(
            "IX_UserLoginAttempts_UserId1",
            "UserLoginAttempts",
            "UserId1");

        migrationBuilder.CreateIndex(
            "IX_UserLockoutHistory_UserId1",
            "UserLockoutHistory",
            "UserId1");

        migrationBuilder.AddForeignKey(
            "FK_UserLockoutHistory_Users_UserId1",
            "UserLockoutHistory",
            "UserId1",
            "Users",
            principalColumn: "Id");

        migrationBuilder.AddForeignKey(
            "FK_UserLoginAttempts_Users_UserId1",
            "UserLoginAttempts",
            "UserId1",
            "Users",
            principalColumn: "Id");

        migrationBuilder.AddForeignKey(
            "FK_UserNotificationSettings_Users_UserId1",
            "UserNotificationSettings",
            "UserId1",
            "Users",
            principalColumn: "Id");

        migrationBuilder.AddForeignKey(
            "FK_UserSecuritySettings_Users_UserId1",
            "UserSecuritySettings",
            "UserId1",
            "Users",
            principalColumn: "Id");
    }
}