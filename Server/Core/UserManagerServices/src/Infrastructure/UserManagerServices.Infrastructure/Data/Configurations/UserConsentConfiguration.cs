#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserManagerServices.Domain.Entities;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Infrastructure.Data.Configurations;

/// <summary>
/// Entity configuration for UserConsent entity
/// Configures GDPR consent management and tracking
/// </summary>
public class UserConsentConfiguration : IEntityTypeConfiguration<UserConsent>
{
    /// <summary>
    /// Configures the UserConsent entity
    /// </summary>
    /// <param name="builder">Entity type builder for UserConsent</param>
    public void Configure(EntityTypeBuilder<UserConsent> builder)
    {
        // Table configuration
        builder.ToTable("UserConsents");

        // Primary key
        builder.HasKey(uc => uc.Id)
            .HasName("PK_UserConsents");

        // Business properties
        builder.Property(uc => uc.ConsentType)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(uc => uc.Purpose)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(uc => uc.Description)
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(uc => uc.Status)
            .IsRequired()
            .HasConversion<int>()
            .HasDefaultValue(ConsentStatus.Given);

        builder.Property(uc => uc.ConsentVersion)
            .HasMaxLength(20)
            .IsRequired()
            .HasDefaultValue("1.0");

        builder.Property(uc => uc.ConsentGivenAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone");

        builder.Property(uc => uc.ConsentUpdatedAt)
            .HasColumnType("timestamp with time zone");

        builder.Property(uc => uc.ConsentWithdrawnAt)
            .HasColumnType("timestamp with time zone");

        builder.Property(uc => uc.ExpiresAt)
            .HasColumnType("timestamp with time zone");

        builder.Property(uc => uc.ConsentMethod)
            .IsRequired()
            .HasConversion<int>()
            .HasDefaultValue(ConsentMethod.WebForm);

        builder.Property(uc => uc.ConsentIpAddress)
            .HasMaxLength(45); // IPv6 support

        builder.Property(uc => uc.ConsentUserAgent)
            .HasMaxLength(1000);

        builder.Property(uc => uc.ConsentSource)
            .HasMaxLength(200);

        builder.Property(uc => uc.IsMandatory)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(uc => uc.IsWithdrawable)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uc => uc.LegalBasis)
            .HasMaxLength(500);

        // JSON properties for PostgreSQL
        builder.Property(uc => uc.DataCategories)
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(uc => uc.ProcessingActivities)
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(uc => uc.ThirdParties)
            .HasColumnType("jsonb");

        builder.Property(uc => uc.RetentionPeriod)
            .HasMaxLength(100);

        builder.Property(uc => uc.Metadata)
            .HasColumnType("jsonb");

        builder.Property(uc => uc.ConsentProof)
            .HasColumnType("jsonb");

        builder.Property(uc => uc.WasInformed)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(uc => uc.InformationProvided)
            .HasMaxLength(2000);

        builder.Property(uc => uc.ConsentLanguage)
            .HasMaxLength(10);

        // Withdrawal properties
        builder.Property(uc => uc.WithdrawalReason)
            .HasMaxLength(500);

        builder.Property(uc => uc.WithdrawalMethod)
            .HasConversion<int?>();

        builder.Property(uc => uc.WithdrawalIpAddress)
            .HasMaxLength(45);

        builder.Property(uc => uc.WithdrawalUserAgent)
            .HasMaxLength(1000);

        // Base entity properties
        builder.Property(uc => uc.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(uc => uc.UpdatedAt)
            .HasColumnType("timestamp with time zone");

        builder.Property(uc => uc.CreatedBy);

        builder.Property(uc => uc.UpdatedBy);

        builder.Property(uc => uc.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Relationships
        builder.HasOne(uc => uc.User)
            .WithMany(u => u.UserConsents)
            .HasForeignKey(uc => uc.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .HasConstraintName("FK_UserConsents_Users_UserId");

        // Self-referencing relationship for consent hierarchy
        builder.HasOne(uc => uc.ParentConsent)
            .WithMany(uc => uc.ChildConsents)
            .HasForeignKey(uc => uc.ParentConsentId)
            .OnDelete(DeleteBehavior.Restrict)
            .HasConstraintName("FK_UserConsents_ParentConsent");

        // Indexes for performance
        builder.HasIndex(uc => uc.UserId)
            .HasDatabaseName("IX_UserConsents_UserId");

        builder.HasIndex(uc => new { uc.UserId, uc.ConsentType })
            .HasDatabaseName("IX_UserConsents_UserId_ConsentType");

        builder.HasIndex(uc => uc.Status)
            .HasDatabaseName("IX_UserConsents_Status");

        builder.HasIndex(uc => uc.ConsentGivenAt)
            .HasDatabaseName("IX_UserConsents_ConsentGivenAt");

        builder.HasIndex(uc => uc.ExpiresAt)
            .HasDatabaseName("IX_UserConsents_ExpiresAt")
            .HasFilter("\"ExpiresAt\" IS NOT NULL");

        // Query filters
        builder.HasQueryFilter(uc => !uc.IsDeleted);
    }
}