using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserManagerServices.Infrastructure.Migrations.User
{
    /// <inheritdoc />
    public partial class updatemapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserLockoutHistory_Users_UserId1",
                table: "UserLockoutHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_UserLoginAttempts_Users_UserId1",
                table: "UserLoginAttempts");

            migrationBuilder.DropForeignKey(
                name: "FK_UserNotificationSettings_Users_UserId1",
                table: "UserNotificationSettings");

            migrationBuilder.DropForeignKey(
                name: "FK_UserSecuritySettings_Users_UserId1",
                table: "UserSecuritySettings");

            migrationBuilder.DropIndex(
                name: "IX_UserSecuritySettings_UserId1",
                table: "UserSecuritySettings");

            migrationBuilder.DropIndex(
                name: "IX_UserNotificationSettings_UserId1",
                table: "UserNotificationSettings");

            migrationBuilder.DropIndex(
                name: "IX_UserLoginAttempts_UserId1",
                table: "UserLoginAttempts");

            migrationBuilder.DropIndex(
                name: "IX_UserLockoutHistory_UserId1",
                table: "UserLockoutHistory");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserSecuritySettings");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserNotificationSettings");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserLoginAttempts");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserLockoutHistory");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "UserSecuritySettings",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "UserNotificationSettings",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "UserLoginAttempts",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "UserLockoutHistory",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserSecuritySettings_UserId1",
                table: "UserSecuritySettings",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_UserNotificationSettings_UserId1",
                table: "UserNotificationSettings",
                column: "UserId1",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserLoginAttempts_UserId1",
                table: "UserLoginAttempts",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_UserLockoutHistory_UserId1",
                table: "UserLockoutHistory",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserLockoutHistory_Users_UserId1",
                table: "UserLockoutHistory",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserLoginAttempts_Users_UserId1",
                table: "UserLoginAttempts",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotificationSettings_Users_UserId1",
                table: "UserNotificationSettings",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserSecuritySettings_Users_UserId1",
                table: "UserSecuritySettings",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
