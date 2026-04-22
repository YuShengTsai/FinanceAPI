using System.ComponentModel.DataAnnotations;

namespace FinanceAPI.Models;

public class LoginRequest
{
    [Required(ErrorMessage = "請輸入使用者名稱。")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "請輸入密碼。")]
    public string Password { get; set; } = string.Empty;
}
