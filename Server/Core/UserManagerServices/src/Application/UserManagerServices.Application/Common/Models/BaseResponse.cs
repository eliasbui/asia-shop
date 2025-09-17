namespace UserManagerServices.Application.Common.Models;

/// <summary>
/// Base response model for all CQRS operations
/// Provides consistent structure for success/failure handling
/// </summary>
/// <typeparam name="T">Response data type</typeparam>
public class BaseResponse<T>
{
    /// <summary>
    /// Indicates if the operation was successful
    /// </summary>
    public bool IsSuccess { get; init; }

    /// <summary>
    /// Response data (null if operation failed)
    /// </summary>
    public T? Data { get; set; }

    /// <summary>
    /// Error message (null if operation succeeded)
    /// </summary>
    public string? ErrorMessage { get; set; }

    /// <summary>
    /// Collection of validation errors
    /// </summary>
    public Dictionary<string, object> ValidationErrors { get; init; } = new Dictionary<string, object>();

    /// <summary>
    /// Additional metadata about the response
    /// </summary>
    public Dictionary<string, object> Metadata { get; set; } = new Dictionary<string, object>();

    /// <summary>
    /// HTTP status code for the response
    /// </summary>
    public int StatusCode { get; set; } = 200;

    /// <summary>
    /// Additional message for the response
    /// </summary>
    public string? Message { get; set; }

    /// <summary>
    /// Creates a successful response with data
    /// </summary>
    /// <param name="data">Response data</param>
    /// <returns>Successful response</returns>
    public static BaseResponse<T> Success(T data)
    {
        return new BaseResponse<T>
        {
            IsSuccess = true,
            Data = data,
            StatusCode = 200,
            Message = "Operation completed successfully"
        };
    }

    /// <summary>
    /// Creates a successful response with data and metadata
    /// </summary>
    /// <param name="data">Response data</param>
    /// <param name="metadata">Additional metadata</param>
    /// <returns>Successful response</returns>
    public static BaseResponse<T> Success(T data, Dictionary<string, object> metadata)
    {
        return new BaseResponse<T>
        {
            IsSuccess = true,
            Data = data,
            Metadata = metadata,
            StatusCode = 200,
            Message = "Operation completed successfully"
        };
    }

    public static BaseResponse<T> Success(T data, string message)
    {
        return new BaseResponse<T>
        {
            IsSuccess = true,
            Data = data,
            StatusCode = 200,
            Message = message
        };
    }

    /// <summary>
    /// Creates a failure response with error message
    /// </summary>
    /// <param name="errorMessage">Error message</param>
    /// <returns>Failure response</returns>
    public static BaseResponse<T> Failure(string errorMessage)
    {
        return new BaseResponse<T>
        {
            IsSuccess = false,
            ErrorMessage = errorMessage,
            StatusCode = 400,
            Message = "Operation failed"
        };
    }


    /// <summary>
    /// Creates a failure response with error message and validation errors
    /// </summary>
    /// <param name="errorMessage">Error message</param>
    /// <param name="validationErrors">Validation errors</param>
    /// <returns>Failure response</returns>
    public static BaseResponse<T> Failure(string errorMessage, Dictionary<string, object> validationErrors)
    {
        return new BaseResponse<T>
        {
            IsSuccess = false,
            ErrorMessage = errorMessage,
            ValidationErrors = validationErrors,
            StatusCode = 400,
            Message = "Operation failed with validation errors"
        };
    }
}

/// <summary>
/// Base response model for operations without return data
/// </summary>
public class BaseResponse : BaseResponse<object>
{
    /// <summary>
    /// Creates a successful response without data
    /// </summary>
    /// <returns>Successful response</returns>
    public static BaseResponse Success()
    {
        return new BaseResponse
        {
            IsSuccess = true,
            StatusCode = 200,
            Message = "Operation completed successfully"
        };
    }

    /// <summary>
    /// Creates a successful response with metadata
    /// </summary>
    /// <param name="metadata">Additional metadata</param>
    /// <returns>Successful response</returns>
    public static BaseResponse Success(Dictionary<string, object> metadata)
    {
        return new BaseResponse
        {
            IsSuccess = true,
            Metadata = metadata,
            StatusCode = 200,
            Message = "Operation completed successfully"
        };
    }

    /// <summary>
    /// Creates a failure response with error message
    /// </summary>
    /// <param name="errorMessage">Error message</param>
    /// <param name="validationErrors"></param>
    /// <returns>Failure response</returns>
    public static BaseResponse Failure(string errorMessage, Dictionary<string, object> validationErrors)
    {
        return new BaseResponse
        {
            IsSuccess = false,
            ErrorMessage = errorMessage,
            StatusCode = 400,
            Message = "Operation failed",
            Metadata = validationErrors
        };
    }

    /// <summary>
    /// Creates a failure response with validation errors
    /// </summary>
    /// <param name="validationErrors">Validation errors</param>
    /// <returns>Failure response</returns>
    public new static BaseResponse Failure(Dictionary<string, object> validationErrors)
    {
        return new BaseResponse
        {
            IsSuccess = false,
            ValidationErrors = validationErrors,
            ErrorMessage = "Validation failed",
            StatusCode = 400,
            Message = "Validation failed"
        };
    }
}