#region Author File

// /*
//  * Author: Eliasbui
//  * Created: 2025/09/19
//  * Description: This code is not for the faint of heart!!
//  */

#endregion

using System.Text.Json;
using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NotificationService.Application.Common.Interfaces;

namespace NotificationService.Infrastructure.MessageQueue;

public class KafkaService : IMessageQueueService, IDisposable
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<KafkaService> _logger;
    private readonly IProducer<string, string> _producer;

    public KafkaService(IConfiguration configuration, ILogger<KafkaService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        var config = new ProducerConfig
        {
            BootstrapServers = _configuration["Kafka:BootstrapServers"] ?? "localhost:9092",
            ClientId = _configuration["Kafka:ClientId"] ?? "notification-service",
            Acks = Acks.All
        };

        _producer = new ProducerBuilder<string, string>(config).Build();
    }

    public async Task PublishAsync<T>(string topic, T message, CancellationToken cancellationToken = default)
        where T : class
    {
        try
        {
            var json = JsonSerializer.Serialize(message);
            var kafkaMessage = new Message<string, string>
            {
                Key = Guid.NewGuid().ToString(),
                Value = json
            };

            var result = await _producer.ProduceAsync(topic, kafkaMessage, cancellationToken);
            _logger.LogInformation($"Message published to topic {topic}: {result.Status}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error publishing message to topic {topic}");
            throw;
        }
    }

    public async Task SubscribeAsync<T>(string topic, Func<T, Task> handler,
        CancellationToken cancellationToken = default) where T : class
    {
        var config = new ConsumerConfig
        {
            GroupId = _configuration["Kafka:GroupId"] ?? "notification-consumer-group",
            BootstrapServers = _configuration["Kafka:BootstrapServers"] ?? "localhost:9092",
            AutoOffsetReset = AutoOffsetReset.Earliest,
            EnableAutoCommit = false
        };

        using var consumer = new ConsumerBuilder<string, string>(config).Build();
        consumer.Subscribe(topic);

        try
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                var result = consumer.Consume(cancellationToken);

                if (result?.Message?.Value != null)
                    try
                    {
                        var message = JsonSerializer.Deserialize<T>(result.Message.Value);
                        if (message != null)
                        {
                            await handler(message);
                            consumer.Commit(result);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error processing message from topic {topic}");
                    }
            }
        }
        catch (OperationCanceledException)
        {
            consumer.Close();
        }
    }

    public void Dispose()
    {
        _producer?.Dispose();
    }
}