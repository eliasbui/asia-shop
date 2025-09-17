namespace UserManagerServices.Domain.Enums;

/// <summary>
/// Status of a data export request
/// </summary>
public enum DataExportStatus
{
    /// <summary>
    /// Request has been submitted and is pending processing
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Request is currently being processed
    /// </summary>
    Processing = 1,

    /// <summary>
    /// Export has been completed and is ready for download
    /// </summary>
    Completed = 2,

    /// <summary>
    /// Request failed due to an error
    /// </summary>
    Failed = 3,

    /// <summary>
    /// Request was cancelled by the user
    /// </summary>
    Cancelled = 4,

    /// <summary>
    /// Export has expired and is no longer available
    /// </summary>
    Expired = 5,

    /// <summary>
    /// Request requires admin approval
    /// </summary>
    PendingApproval = 6,

    /// <summary>
    /// Request was rejected by admin
    /// </summary>
    Rejected = 7
}

/// <summary>
/// Format for data export
/// </summary>
public enum DataExportFormat
{
    /// <summary>
    /// JSON format (structured data)
    /// </summary>
    Json = 0,

    /// <summary>
    /// CSV format (tabular data)
    /// </summary>
    Csv = 1,

    /// <summary>
    /// XML format (structured data)
    /// </summary>
    Xml = 2,

    /// <summary>
    /// PDF format (human-readable)
    /// </summary>
    Pdf = 3,

    /// <summary>
    /// ZIP archive containing multiple formats
    /// </summary>
    Archive = 4
}

/// <summary>
/// Status of a data deletion request
/// </summary>
public enum DataDeletionStatus
{
    /// <summary>
    /// Request has been submitted and is pending processing
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Request is in grace period (user can still cancel)
    /// </summary>
    GracePeriod = 1,

    /// <summary>
    /// Request requires user confirmation
    /// </summary>
    PendingConfirmation = 2,

    /// <summary>
    /// Request is scheduled for deletion
    /// </summary>
    Scheduled = 3,

    /// <summary>
    /// Request is currently being processed
    /// </summary>
    Processing = 4,

    /// <summary>
    /// Deletion has been completed
    /// </summary>
    Completed = 5,

    /// <summary>
    /// Request failed due to an error
    /// </summary>
    Failed = 6,

    /// <summary>
    /// Request was cancelled by the user
    /// </summary>
    Cancelled = 7,

    /// <summary>
    /// Request requires admin approval
    /// </summary>
    PendingApproval = 8,

    /// <summary>
    /// Request was rejected by admin
    /// </summary>
    Rejected = 9,

    /// <summary>
    /// Deletion was partially completed (some data retained)
    /// </summary>
    PartiallyCompleted = 10
}

/// <summary>
/// Type of data deletion
/// </summary>
public enum DeletionType
{
    /// <summary>
    /// Complete deletion of all user data
    /// </summary>
    Complete = 0,

    /// <summary>
    /// Partial deletion of specific data categories
    /// </summary>
    Partial = 1,

    /// <summary>
    /// Anonymization of data (remove personal identifiers)
    /// </summary>
    Anonymization = 2,

    /// <summary>
    /// Pseudonymization of data (replace identifiers with pseudonyms)
    /// </summary>
    Pseudonymization = 3,

    /// <summary>
    /// Account deactivation (soft delete)
    /// </summary>
    Deactivation = 4
}

/// <summary>
/// Type of consent
/// </summary>
public enum ConsentType
{
    /// <summary>
    /// Consent for marketing communications
    /// </summary>
    Marketing = 0,

    /// <summary>
    /// Consent for analytics and tracking
    /// </summary>
    Analytics = 1,

    /// <summary>
    /// Consent for cookies (non-essential)
    /// </summary>
    Cookies = 2,

    /// <summary>
    /// Consent for data sharing with third parties
    /// </summary>
    DataSharing = 3,

    /// <summary>
    /// Consent for profiling and automated decision making
    /// </summary>
    Profiling = 4,

    /// <summary>
    /// Consent for location tracking
    /// </summary>
    LocationTracking = 5,

    /// <summary>
    /// Consent for push notifications
    /// </summary>
    PushNotifications = 6,

    /// <summary>
    /// Consent for research purposes
    /// </summary>
    Research = 7,

    /// <summary>
    /// Consent for service improvement
    /// </summary>
    ServiceImprovement = 8,

    /// <summary>
    /// Consent for personalization
    /// </summary>
    Personalization = 9,

    /// <summary>
    /// General consent for data processing
    /// </summary>
    General = 10,

    /// <summary>
    /// Consent for biometric data processing
    /// </summary>
    Biometric = 11,

    /// <summary>
    /// Consent for sensitive data processing
    /// </summary>
    SensitiveData = 12
}

/// <summary>
/// Status of consent
/// </summary>
public enum ConsentStatus
{
    /// <summary>
    /// Consent has been given
    /// </summary>
    Given = 0,

    /// <summary>
    /// Consent has been withdrawn
    /// </summary>
    Withdrawn = 1,

    /// <summary>
    /// Consent has expired
    /// </summary>
    Expired = 2,

    /// <summary>
    /// Consent is pending (not yet given)
    /// </summary>
    Pending = 3,

    /// <summary>
    /// Consent was refused
    /// </summary>
    Refused = 4,

    /// <summary>
    /// Consent is under review
    /// </summary>
    UnderReview = 5,

    /// <summary>
    /// Consent is suspended
    /// </summary>
    Suspended = 6
}

/// <summary>
/// Method by which consent was obtained or withdrawn
/// </summary>
public enum ConsentMethod
{
    /// <summary>
    /// Web form (checkbox, button, etc.)
    /// </summary>
    WebForm = 0,

    /// <summary>
    /// Email confirmation
    /// </summary>
    Email = 1,

    /// <summary>
    /// Phone call
    /// </summary>
    Phone = 2,

    /// <summary>
    /// In-person/written form
    /// </summary>
    Written = 3,

    /// <summary>
    /// Mobile app
    /// </summary>
    MobileApp = 4,

    /// <summary>
    /// API call
    /// </summary>
    Api = 5,

    /// <summary>
    /// SMS/text message
    /// </summary>
    Sms = 6,

    /// <summary>
    /// Voice consent
    /// </summary>
    Voice = 7,

    /// <summary>
    /// Implied consent (through continued use)
    /// </summary>
    Implied = 8,

    /// <summary>
    /// Opt-out (negative consent)
    /// </summary>
    OptOut = 9,

    /// <summary>
    /// Administrative action
    /// </summary>
    Administrative = 10
}

/// <summary>
/// Data categories for GDPR compliance
/// </summary>
public enum DataCategory
{
    /// <summary>
    /// Personal identification data (name, email, phone)
    /// </summary>
    PersonalIdentification = 0,

    /// <summary>
    /// Account and authentication data
    /// </summary>
    AccountData = 1,

    /// <summary>
    /// Profile and preferences data
    /// </summary>
    ProfileData = 2,

    /// <summary>
    /// Communication data (messages, emails)
    /// </summary>
    CommunicationData = 3,

    /// <summary>
    /// Transaction and payment data
    /// </summary>
    TransactionData = 4,

    /// <summary>
    /// Usage and analytics data
    /// </summary>
    UsageData = 5,

    /// <summary>
    /// Location data
    /// </summary>
    LocationData = 6,

    /// <summary>
    /// Device and technical data
    /// </summary>
    TechnicalData = 7,

    /// <summary>
    /// Marketing and communication preferences
    /// </summary>
    MarketingData = 8,

    /// <summary>
    /// Support and service data
    /// </summary>
    SupportData = 9,

    /// <summary>
    /// Legal and compliance data
    /// </summary>
    LegalData = 10,

    /// <summary>
    /// Biometric data
    /// </summary>
    BiometricData = 11,

    /// <summary>
    /// Health data
    /// </summary>
    HealthData = 12,

    /// <summary>
    /// Financial data
    /// </summary>
    FinancialData = 13,

    /// <summary>
    /// Social media data
    /// </summary>
    SocialMediaData = 14,

    /// <summary>
    /// Behavioral data
    /// </summary>
    BehavioralData = 15
}

/// <summary>
/// Social login providers
/// </summary>
public enum SocialLoginProvider
{
    /// <summary>
    /// Google OAuth
    /// </summary>
    Google = 0,

    /// <summary>
    /// Facebook OAuth
    /// </summary>
    Facebook = 1,

    /// <summary>
    /// Microsoft OAuth (Azure AD)
    /// </summary>
    Microsoft = 2,

    /// <summary>
    /// Twitter OAuth
    /// </summary>
    Twitter = 3,

    /// <summary>
    /// LinkedIn OAuth
    /// </summary>
    LinkedIn = 4,

    /// <summary>
    /// GitHub OAuth
    /// </summary>
    GitHub = 5,

    /// <summary>
    /// Apple Sign In
    /// </summary>
    Apple = 6,

    /// <summary>
    /// Amazon OAuth
    /// </summary>
    Amazon = 7,

    /// <summary>
    /// Discord OAuth
    /// </summary>
    Discord = 8,

    /// <summary>
    /// Slack OAuth
    /// </summary>
    Slack = 9,

    /// <summary>
    /// Spotify OAuth
    /// </summary>
    Spotify = 10,

    /// <summary>
    /// Instagram OAuth
    /// </summary>
    Instagram = 11,

    /// <summary>
    /// TikTok OAuth
    /// </summary>
    TikTok = 12,

    /// <summary>
    /// Custom OAuth provider
    /// </summary>
    Custom = 99
}
