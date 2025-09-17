using UserManagerServices.Domain.Common;
using UserManagerServices.Domain.Enums;

namespace UserManagerServices.Domain.Entities;

/// <summary>
/// Represents user consent for data processing activities (GDPR Article 6 & 7 - Lawful basis and consent)
/// </summary>
public class UserConsent : IBaseEntity
{
    /// <summary>
    /// ID of the user who gave consent
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Navigation property to the user
    /// </summary>
    public virtual User User { get; set; } = null!;

    /// <summary>
    /// Type of consent (e.g., marketing, analytics, cookies)
    /// </summary>
    public ConsentType ConsentType { get; set; }

    /// <summary>
    /// Specific purpose for which consent was given
    /// </summary>
    public string Purpose { get; set; } = string.Empty;

    /// <summary>
    /// Detailed description of what the user consented to
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Current status of the consent
    /// </summary>
    public ConsentStatus Status { get; set; } = ConsentStatus.Given;

    /// <summary>
    /// Version of the consent terms when consent was given
    /// </summary>
    public string ConsentVersion { get; set; } = "1.0";

    /// <summary>
    /// When the consent was given
    /// </summary>
    public DateTime ConsentGivenAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// When the consent was last updated
    /// </summary>
    public DateTime? ConsentUpdatedAt { get; set; }

    /// <summary>
    /// When the consent was withdrawn (if applicable)
    /// </summary>
    public DateTime? ConsentWithdrawnAt { get; set; }

    /// <summary>
    /// When the consent expires (if applicable)
    /// </summary>
    public DateTime? ExpiresAt { get; set; }

    /// <summary>
    /// Method by which consent was obtained
    /// </summary>
    public ConsentMethod ConsentMethod { get; set; } = ConsentMethod.WebForm;

    /// <summary>
    /// IP address from which consent was given
    /// </summary>
    public string? ConsentIpAddress { get; set; }

    /// <summary>
    /// User agent from which consent was given
    /// </summary>
    public string? ConsentUserAgent { get; set; }

    /// <summary>
    /// Source/context where consent was obtained
    /// </summary>
    public string? ConsentSource { get; set; }

    /// <summary>
    /// Whether this consent is mandatory for service provision
    /// </summary>
    public bool IsMandatory { get; set; } = false;

    /// <summary>
    /// Whether the user can withdraw this consent
    /// </summary>
    public bool IsWithdrawable { get; set; } = true;

    /// <summary>
    /// Legal basis for processing (if not consent)
    /// </summary>
    public string? LegalBasis { get; set; }

    /// <summary>
    /// Data categories covered by this consent
    /// </summary>
    public string DataCategories { get; set; } = string.Empty; // JSON array

    /// <summary>
    /// Processing activities covered by this consent
    /// </summary>
    public string ProcessingActivities { get; set; } = string.Empty; // JSON array

    /// <summary>
    /// Third parties with whom data may be shared under this consent
    /// </summary>
    public string? ThirdParties { get; set; } // JSON array

    /// <summary>
    /// Data retention period for this consent
    /// </summary>
    public string? RetentionPeriod { get; set; }

    /// <summary>
    /// Additional metadata about the consent
    /// </summary>
    public string? Metadata { get; set; } // JSON object

    /// <summary>
    /// Proof of consent (e.g., form data, checkbox state)
    /// </summary>
    public string? ConsentProof { get; set; } // JSON object

    /// <summary>
    /// Whether the user was properly informed about the consent
    /// </summary>
    public bool WasInformed { get; set; } = true;

    /// <summary>
    /// Information provided to the user when obtaining consent
    /// </summary>
    public string? InformationProvided { get; set; }

    /// <summary>
    /// Language in which consent was obtained
    /// </summary>
    public string? ConsentLanguage { get; set; }

    /// <summary>
    /// Parent consent ID (for consent updates/renewals)
    /// </summary>
    public Guid? ParentConsentId { get; set; }

    /// <summary>
    /// Navigation property to parent consent
    /// </summary>
    public virtual UserConsent? ParentConsent { get; set; }

    /// <summary>
    /// Child consents (updates/renewals)
    /// </summary>
    public virtual ICollection<UserConsent> ChildConsents { get; set; } = new List<UserConsent>();

    /// <summary>
    /// Reason for consent withdrawal (if applicable)
    /// </summary>
    public string? WithdrawalReason { get; set; }

    /// <summary>
    /// Method by which consent was withdrawn
    /// </summary>
    public ConsentMethod? WithdrawalMethod { get; set; }

    /// <summary>
    /// IP address from which consent was withdrawn
    /// </summary>
    public string? WithdrawalIpAddress { get; set; }

    /// <summary>
    /// User agent from which consent was withdrawn
    /// </summary>
    public string? WithdrawalUserAgent { get; set; }

    public Guid Id { get; } = Guid.CreateVersion7();
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; } = null;
    public Guid? CreatedBy { get; } = null;
    public Guid? UpdatedBy { get; } = null;
    public bool IsDeleted { get; } = false;
}