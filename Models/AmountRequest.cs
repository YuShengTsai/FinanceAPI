using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceAPI.Models;

public class AmountRequest
{
    [Column(TypeName = "decimal(18,2)")]
    [Range(typeof(decimal), "0.01", "79228162514264337593543950335")]
    public decimal Amount { get; set; }
}
