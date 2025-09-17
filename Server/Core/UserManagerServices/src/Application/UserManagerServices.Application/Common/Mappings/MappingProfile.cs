using AutoMapper;
using UserManagerServices.Application.Common.Models;
using UserManagerServices.Domain.Entities;

namespace UserManagerServices.Application.Common.Mappings;

/// <summary>
/// AutoMapper profile for mapping between domain entities and DTOs
/// Provides centralized mapping configuration following Clean Architecture principles
/// </summary>
public class MappingProfile : Profile
{
    /// <summary>
    /// Initializes the mapping profile with all entity mappings
    /// </summary>
    public MappingProfile()
    {
        CreateUserMappings();
        CreateRoleMappings();
        CreateSessionMappings();
        CreateActivityLogMappings();
        CreatePaginationMappings();
    }

    /// <summary>
    /// Creates mappings for User entity and related DTOs
    /// </summary>
    private void CreateUserMappings()
    {
        // User entity mappings will be added here when DTOs are created
        // Example:
        // CreateMap<User, UserDto>()
        //     .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));
        
        // CreateMap<CreateUserCommand, User>()
        //     .ForMember(dest => dest.Id, opt => opt.Ignore())
        //     .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
    }

    /// <summary>
    /// Creates mappings for Role entity and related DTOs
    /// </summary>
    private void CreateRoleMappings()
    {
        // Role entity mappings will be added here when DTOs are created
        // Example:
        // CreateMap<Role, RoleDto>();
        // CreateMap<CreateRoleCommand, Role>();
    }

    /// <summary>
    /// Creates mappings for UserSession entity and related DTOs
    /// </summary>
    private void CreateSessionMappings()
    {
        // Session entity mappings will be added here when DTOs are created
        // Example:
        // CreateMap<UserSession, UserSessionDto>();
    }

    /// <summary>
    /// Creates mappings for UserActivityLog entity and related DTOs
    /// </summary>
    private void CreateActivityLogMappings()
    {
        // Activity log entity mappings will be added here when DTOs are created
        // Example:
        // CreateMap<UserActivityLog, UserActivityLogDto>();
    }

    /// <summary>
    /// Creates mappings for pagination-related models
    /// </summary>
    private void CreatePaginationMappings()
    {
        // Generic mapping for paginated responses
        CreateMap(typeof(PaginatedResponse<>), typeof(PaginatedResponse<>));
    }
}

/// <summary>
/// Base interface for mappable objects
/// Provides a contract for objects that can be mapped using AutoMapper
/// </summary>
public interface IMapFrom<T>
{
    /// <summary>
    /// Configures mapping from the specified type
    /// </summary>
    /// <param name="profile">AutoMapper profile</param>
    void Mapping(Profile profile) => profile.CreateMap(typeof(T), GetType());
}

/// <summary>
/// Base interface for objects that can be mapped to another type
/// </summary>
/// <typeparam name="T">Target type</typeparam>
public interface IMapTo<T>
{
    /// <summary>
    /// Configures mapping to the specified type
    /// </summary>
    /// <param name="profile">AutoMapper profile</param>
    void Mapping(Profile profile) => profile.CreateMap(GetType(), typeof(T));
}
