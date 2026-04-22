namespace FinanceAPI.Services.Interfaces;

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key);

    Task SetAsync<T>(string key, T value, TimeSpan ttl);

    Task RemoveAsync(params string[] keys);
}
