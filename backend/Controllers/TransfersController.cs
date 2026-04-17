using FinanceAPI.Models;
using FinanceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransfersController : ControllerBase
{
    private readonly ITransferService _transferService;

    public TransfersController(ITransferService transferService)
    {
        _transferService = transferService;
    }

    [HttpPost]
    public async Task<ActionResult<TransferResult>> TransferMoney(TransferRequest request)
    {
        var result = await _transferService.TransferMoneyAsync(request);

        if (result.ResultCode != 0)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("{transferId:int}")]
    public async Task<ActionResult<TransferDetail>> GetTransferDetail(int transferId)
    {
        var transferDetail = await _transferService.GetTransferDetailAsync(transferId);

        if (transferDetail is null)
        {
            return NotFound();
        }

        return Ok(transferDetail);
    }
}
