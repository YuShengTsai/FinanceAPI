using FinanceAPI.Services.Interfaces;

namespace FinanceAPI.Services;

public class NoOpCacheService : ICacheService
{
    public Task<T?> GetAsync<T>(string key)
    {
        return Task.FromResult<T?>(default);
    }

    public Task SetAsync<T>(string key, T value, TimeSpan ttl)
    {
        return Task.CompletedTask;
    }

    public Task RemoveAsync(params string[] keys)
    {
        return Task.CompletedTask;
    }
}
