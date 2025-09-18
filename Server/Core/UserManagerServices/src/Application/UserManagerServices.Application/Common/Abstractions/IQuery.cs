#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/18
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using MediatR;
using UserManagerServices.Application.Common.Models;

namespace UserManagerServices.Application.Common.Abstractions;

/// <summary>
/// Base interface for queries that return data
/// Queries represent read operations that don't modify system state
/// </summary>
/// <typeparam name="TResponse">The type of data returned by the query</typeparam>
public interface IQuery<TResponse> : IRequest<BaseResponse<TResponse>>
{
}

/// <summary>
/// Base interface for query handlers
/// </summary>
/// <typeparam name="TQuery">The query type</typeparam>
/// <typeparam name="TResponse">The response data type</typeparam>
public interface IQueryHandler<in TQuery, TResponse> : IRequestHandler<TQuery, BaseResponse<TResponse>>
    where TQuery : IQuery<TResponse>
{
}