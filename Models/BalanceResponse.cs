namespace FinanceAPI.Models;

public class BalanceResponse
{
    public int AccountId { get; set; }

    public string AccountNumber { get; set; } = string.Empty;

    public decimal Balance { get; set; }

    public string Currency { get; set; } = string.Empty;
}
