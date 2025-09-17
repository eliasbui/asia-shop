using System.Text.RegularExpressions;
using UserManagerServices.Domain.Exceptions;

namespace UserManagerServices.Domain.ValueObjects;

public sealed class Email : IEquatable<Email>
{
    private static readonly Regex EmailRegex = new(
        @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    private string Value { get; }

    public Email(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) throw new DomainException("Email cannot be empty.", "EMAIL_EMPTY");

        if (!EmailRegex.IsMatch(value))
            throw new DomainException($"Invalid email format: {value}", "INVALID_EMAIL_FORMAT");

        Value = value.ToLowerInvariant();
    }

    public static implicit operator string(Email email)
    {
        return email.Value;
    }

    public static explicit operator Email(string value)
    {
        return new Email(value);
    }

    public bool Equals(Email? other)
    {
        return other is not null && Value == other.Value;
    }

    public override bool Equals(object? obj)
    {
        return obj is Email other && Equals(other);
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }

    public override string ToString()
    {
        return Value;
    }

    public static bool operator ==(Email? left, Email? right)
    {
        return Equals(left, right);
    }

    public static bool operator !=(Email? left, Email? right)
    {
        return !Equals(left, right);
    }
}