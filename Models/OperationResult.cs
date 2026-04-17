namespace FinanceAPI.Models;

public class OperationResult
{
    public bool Success { get; set; }

    public string Message { get; set; } = string.Empty;

    public int? TransactionId { get; set; }

    public decimal? Balance { get; set; }
}
