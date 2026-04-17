using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceAPI.Models;

public class TransferDetail
{
    public int TransferId { get; set; }

    public int FromAccountId { get; set; }

    public int ToAccountId { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
