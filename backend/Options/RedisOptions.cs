namespace FinanceAPI.Options;

public class RedisOptions
{
    public const string SectionName = "Redis";

    public bool Enabled { get; set; }

    public string ConnectionString { get; set; } = "localhost:6379";

    public int BalanceCacheMinutes { get; set; } = 5;

    public int AccountTransactionsCacheMinutes { get; set; } = 2;
}
