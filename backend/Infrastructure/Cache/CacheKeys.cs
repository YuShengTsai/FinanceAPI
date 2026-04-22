namespace FinanceAPI.Infrastructure.Cache;

public static class CacheKeys
{
    public static string AccountBalance(int accountId) => $"account:{accountId}:balance";

    public static string AccountTransactions(int accountId) => $"account:{accountId}:transactions";
}
