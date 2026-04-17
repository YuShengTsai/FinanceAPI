using System.ComponentModel.DataAnnotations;
using FinanceAPI.Models;
using Xunit;

namespace FinanceAPI.Tests.Models;

public class TransferRequestTests
{
    [Fact]
    public void Validate_WhenFromAndToAccountsAreTheSame_ShouldReturnValidationError()
    {
        var request = new TransferRequest
        {
            FromAccountId = 1,
            ToAccountId = 1,
            Amount = 100m
        };

        var validationResults = Validate(request);

        Assert.Contains(validationResults, result =>
            result.MemberNames.Contains(nameof(TransferRequest.FromAccountId)) &&
            result.MemberNames.Contains(nameof(TransferRequest.ToAccountId)));
    }

    [Fact]
    public void Validate_WhenAmountIsZero_ShouldReturnValidationError()
    {
        var request = new TransferRequest
        {
            FromAccountId = 1,
            ToAccountId = 3,
            Amount = 0m
        };

        var validationResults = Validate(request);

        Assert.Contains(validationResults, result =>
            result.MemberNames.Contains(nameof(TransferRequest.Amount)));
    }

    private static List<ValidationResult> Validate(TransferRequest request)
    {
        var validationContext = new ValidationContext(request);
        var validationResults = new List<ValidationResult>();

        Validator.TryValidateObject(request, validationContext, validationResults, validateAllProperties: true);

        return validationResults;
    }
}
