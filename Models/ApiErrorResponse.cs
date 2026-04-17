namespace FinanceAPI.Models;

public class ApiErrorResponse
{
    public string Message { get; set; } = string.Empty;

    public string? Detail { get; set; }

    public string? TraceId { get; set; }
}
