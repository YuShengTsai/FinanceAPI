using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceAPI.Models;

public class Account
{
    public int AccountId { get; set; }

    public int CustomerId { get; set; }

    [Required]
    public string AccountNumber { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Balance { get; set; }

    [Required]
    public string Currency { get; set; } = "TWD";

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
