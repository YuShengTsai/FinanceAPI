using System.Text.Json;
using FinanceAPI.Services.Interfaces;
using StackExchange.Redis;

namespace FinanceAPI.Services;

public class RedisCacheService : ICacheService
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);

    private readonly IDatabase _database;

    public RedisCacheService(IConnectionMultiplexer connectionMultiplexer)
    {
        _database = connectionMultiplexer.GetDatabase();
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        var value = await _database.StringGetAsync(key);

        if (!value.HasValue)
        {
            return default;
        }

        return JsonSerializer.Deserialize<T>(value!, SerializerOptions);
    }

    public Task SetAsync<T>(string key, T value, TimeSpan ttl)
    {
        var payload = JsonSerializer.Serialize(value, SerializerOptions);
        return _database.StringSetAsync(key, payload, ttl);
    }

    public Task RemoveAsync(params string[] keys)
    {
        if (keys.Length == 0)
        {
            return Task.CompletedTask;
        }

        var redisKeys = keys
            .Where(key => !string.IsNullOrWhiteSpace(key))
            .Select(key => (RedisKey)key)
            .ToArray();

        if (redisKeys.Length == 0)
        {
            return Task.CompletedTask;
        }

        return _database.KeyDeleteAsync(redisKeys);
    }
}
