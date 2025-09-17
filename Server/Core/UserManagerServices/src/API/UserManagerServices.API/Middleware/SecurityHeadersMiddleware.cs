namespace UserManagerServices.API.Middleware;

/// <summary>
/// Middleware for adding security headers to HTTP responses
/// Implements security best practices for web APIs
/// </summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<SecurityHeadersMiddleware> _logger;

    /// <summary>
    /// Initializes a new instance of the SecurityHeadersMiddleware
    /// </summary>
    /// <param name="next">Next middleware in the pipeline</param>
    /// <param name="logger">Logger instance</param>
    public SecurityHeadersMiddleware(RequestDelegate next, ILogger<SecurityHeadersMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Invokes the middleware
    /// </summary>
    /// <param name="context">HTTP context</param>
    /// <returns>Task representing the operation</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        // Add security headers
        AddSecurityHeaders(context);

        await _next(context);
    }

    /// <summary>
    /// Adds security headers to the response
    /// </summary>
    /// <param name="context">HTTP context</param>
    private static void AddSecurityHeaders(HttpContext context)
    {
        var headers = context.Response.Headers;

        // Remove server information
        headers.Remove("Server");

        // X-Content-Type-Options: Prevent MIME type sniffing
        headers.Append("X-Content-Type-Options", "nosniff");

        // X-Frame-Options: Prevent clickjacking
        headers.Append("X-Frame-Options", "DENY");

        // X-XSS-Protection: Enable XSS filtering
        headers.Append("X-XSS-Protection", "1; mode=block");

        // Referrer-Policy: Control referrer information
        headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

        // Content-Security-Policy: Prevent XSS and data injection attacks
        headers.Append("Content-Security-Policy", 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self' data:; " +
            "connect-src 'self'; " +
            "frame-ancestors 'none'");

        // Strict-Transport-Security: Enforce HTTPS
        if (context.Request.IsHttps)
        {
            headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
        }

        // Permissions-Policy: Control browser features
        headers.Append("Permissions-Policy", 
            "camera=(), " +
            "microphone=(), " +
            "geolocation=(), " +
            "payment=(), " +
            "usb=(), " +
            "magnetometer=(), " +
            "gyroscope=(), " +
            "accelerometer=()");

        // Cache-Control: Control caching behavior for API responses
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.Append("Pragma", "no-cache");
            headers.Append("Expires", "0");
        }

        // Add custom API headers
        headers.Append("X-API-Version", "1.0");
        headers.Append("X-Request-ID", context.TraceIdentifier);
    }
}

/// <summary>
/// Extension methods for registering the security headers middleware
/// </summary>
public static class SecurityHeadersMiddlewareExtensions
{
    /// <summary>
    /// Adds the security headers middleware to the pipeline
    /// </summary>
    /// <param name="builder">Application builder</param>
    /// <returns>Application builder for chaining</returns>
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<SecurityHeadersMiddleware>();
    }
}
