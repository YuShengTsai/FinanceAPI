using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceAPI.Models;

public class TransferRequest
{
    [Range(1, int.MaxValue)]
    public int FromAccountId { get; set; }

    [Range(1, int.MaxValue)]
    public int ToAccountId { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    [Range(typeof(decimal), "0.01", "79228162514264337593543950335")]
    public decimal Amount { get; set; }
}
