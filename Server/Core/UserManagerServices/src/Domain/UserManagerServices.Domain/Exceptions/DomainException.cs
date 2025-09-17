namespace UserManagerServices.Domain.Exceptions;

/// <summary>
/// Base exception class for domain-specific errors
/// Represents business rule violations and domain logic errors
/// </summary>
public class DomainException : Exception
{
    /// <summary>
    /// Error code for categorizing the exception
    /// </summary>
    public string ErrorCode { get; }

    /// <summary>
    /// Additional context data related to the error
    /// </summary>
    public Dictionary<string, object> Context { get; }

    /// <summary>
    /// Initializes a new instance of the DomainException
    /// </summary>
    /// <param name="message">Error message</param>
    /// <param name="errorCode">Error code</param>
    public DomainException(string message, string errorCode) : base(message)
    {
        ErrorCode = errorCode;
        Context = new Dictionary<string, object>();
    }

    /// <summary>
    /// Initializes a new instance of the DomainException with inner exception
    /// </summary>
    /// <param name="message">Error message</param>
    /// <param name="errorCode">Error code</param>
    /// <param name="innerException">Inner exception</param>
    public DomainException(string message, string errorCode, Exception innerException) : base(message, innerException)
    {
        ErrorCode = errorCode;
        Context = new Dictionary<string, object>();
    }

    /// <summary>
    /// Adds context information to the exception
    /// </summary>
    /// <param name="key">Context key</param>
    /// <param name="value">Context value</param>
    /// <returns>The exception instance for chaining</returns>
    public DomainException WithContext(string key, object value)
    {
        Context[key] = value;
        return this;
    }
}

/// <summary>
/// Exception thrown when a business rule is violated
/// </summary>
public class BusinessRuleViolationException : DomainException
{
    /// <summary>
    /// Initializes a new instance of the BusinessRuleViolationException
    /// </summary>
    /// <param name="message">Error message</param>
    /// <param name="errorCode">Error code</param>
    public BusinessRuleViolationException(string message, string errorCode = "BUSINESS_RULE_VIOLATION")
        : base(message, errorCode)
    {
    }

    /// <summary>
    /// Initializes a new instance of the BusinessRuleViolationException with inner exception
    /// </summary>
    /// <param name="message">Error message</param>
    /// <param name="innerException">Inner exception</param>
    /// <param name="errorCode">Error code</param>
    public BusinessRuleViolationException(string message, Exception innerException, string errorCode = "BUSINESS_RULE_VIOLATION")
        : base(message, errorCode, innerException)
    {
    }
}

/// <summary>
/// Exception thrown when an entity is not found
/// </summary>
public class EntityNotFoundException : DomainException
{
    /// <summary>
    /// Initializes a new instance of the EntityNotFoundException
    /// </summary>
    /// <param name="entityName">Name of the entity</param>
    /// <param name="entityId">ID of the entity</param>
    public EntityNotFoundException(string entityName, object entityId)
        : base($"{entityName} with ID '{entityId}' was not found.", "ENTITY_NOT_FOUND")
    {
        WithContext("EntityName", entityName)
            .WithContext("EntityId", entityId);
    }

    /// <summary>
    /// Initializes a new instance of the EntityNotFoundException with custom message
    /// </summary>
    /// <param name="message">Custom error message</param>
    public EntityNotFoundException(string message)
        : base(message, "ENTITY_NOT_FOUND")
    {
    }
}

/// <summary>
/// Exception thrown when an entity already exists
/// </summary>
public class EntityAlreadyExistsException : DomainException
{
    /// <summary>
    /// Initializes a new instance of the EntityAlreadyExistsException
    /// </summary>
    /// <param name="entityName">Name of the entity</param>
    /// <param name="propertyName">Name of the conflicting property</param>
    /// <param name="propertyValue">Value of the conflicting property</param>
    public EntityAlreadyExistsException(string entityName, string propertyName, object propertyValue)
        : base($"{entityName} with {propertyName} '{propertyValue}' already exists.", "ENTITY_ALREADY_EXISTS")
    {
        WithContext("EntityName", entityName)
            .WithContext("PropertyName", propertyName)
            .WithContext("PropertyValue", propertyValue);
    }

    /// <summary>
    /// Initializes a new instance of the EntityAlreadyExistsException with custom message
    /// </summary>
    /// <param name="message">Custom error message</param>
    public EntityAlreadyExistsException(string message)
        : base(message, "ENTITY_ALREADY_EXISTS")
    {
    }
}

/// <summary>
/// Exception thrown when an operation is not allowed due to current state
/// </summary>
public class InvalidOperationException : DomainException
{
    /// <summary>
    /// Initializes a new instance of the InvalidOperationException
    /// </summary>
    /// <param name="message">Error message</param>
    /// <param name="errorCode">Error code</param>
    public InvalidOperationException(string message, string errorCode = "INVALID_OPERATION")
        : base(message, errorCode)
    {
    }

    /// <summary>
    /// Initializes a new instance of the InvalidOperationException with inner exception
    /// </summary>
    /// <param name="message">Error message</param>
    /// <param name="innerException">Inner exception</param>
    /// <param name="errorCode">Error code</param>
    public InvalidOperationException(string message, Exception innerException, string errorCode = "INVALID_OPERATION")
        : base(message, errorCode, innerException)
    {
    }
}

/// <summary>
/// Exception thrown when validation fails
/// </summary>
public class DomainValidationException : DomainException
{
    /// <summary>
    /// Collection of validation errors
    /// </summary>
    public IEnumerable<string> ValidationErrors { get; }

    /// <summary>
    /// Initializes a new instance of the DomainValidationException
    /// </summary>
    /// <param name="validationErrors">Collection of validation errors</param>
    public DomainValidationException(IEnumerable<string> validationErrors)
        : base("One or more validation errors occurred.", "VALIDATION_ERROR")
    {
        ValidationErrors = validationErrors ?? throw new ArgumentNullException(nameof(validationErrors));
        WithContext("ValidationErrors", ValidationErrors);
    }

    /// <summary>
    /// Initializes a new instance of the DomainValidationException with single error
    /// </summary>
    /// <param name="validationError">Single validation error</param>
    public DomainValidationException(string validationError)
        : this(new[] { validationError })
    {
    }
}
