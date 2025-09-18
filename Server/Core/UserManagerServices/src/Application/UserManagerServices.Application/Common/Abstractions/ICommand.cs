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
/// Base interface for commands that don't return data
/// Commands represent write operations that modify system state
/// </summary>
public interface ICommand : IRequest<BaseResponse>
{
}

/// <summary>
/// Base interface for commands that return data
/// Commands represent write operations that modify system state and return a result
/// </summary>
/// <typeparam name="TResponse">The type of data returned by the command</typeparam>
public interface ICommand<TResponse> : IRequest<BaseResponse<TResponse>>
{
}

/// <summary>
/// Base interface for command handlers that don't return data
/// </summary>
/// <typeparam name="TCommand">The command type</typeparam>
public interface ICommandHandler<in TCommand> : IRequestHandler<TCommand, BaseResponse>
    where TCommand : ICommand
{
}

/// <summary>
/// Base interface for command handlers that return data
/// </summary>
/// <typeparam name="TCommand">The command type</typeparam>
/// <typeparam name="TResponse">The response data type</typeparam>
public interface ICommandHandler<in TCommand, TResponse> : IRequestHandler<TCommand, BaseResponse<TResponse>>
    where TCommand : ICommand<TResponse>
{
}