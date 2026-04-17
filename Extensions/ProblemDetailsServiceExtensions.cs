using FinanceAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace FinanceAPI.Extensions;

public static class ProblemDetailsServiceExtensions
{
    public static IServiceCollection AddApiProblemDetails(this IServiceCollection services)
    {
        services.AddProblemDetails();

        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var errors = context.ModelState
                    .Where(entry => entry.Value?.Errors.Count > 0)
                    .ToDictionary(
                        entry => entry.Key,
                        entry => entry.Value!.Errors
                            .Select(error => string.IsNullOrWhiteSpace(error.ErrorMessage)
                                ? "輸入資料格式不正確。"
                                : error.ErrorMessage)
                            .ToArray());

                var problemDetails = new ValidationProblemDetails(errors)
                {
                    Title = "輸入資料驗證失敗。",
                    Status = StatusCodes.Status400BadRequest
                };

                problemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier;

                return new BadRequestObjectResult(problemDetails);
            };
        });

        return services;
    }

    public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app)
    {
        return app.UseExceptionHandler(errorApp =>
        {
            errorApp.Run(async context =>
            {
                var exceptionFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
                var exception = exceptionFeature?.Error;
                var loggerFactory = context.RequestServices.GetRequiredService<ILoggerFactory>();
                var logger = loggerFactory.CreateLogger("GlobalExceptionHandler");

                logger.LogError(exception, "Unhandled exception occurred while processing request {Method} {Path}",
                    context.Request.Method,
                    context.Request.Path);

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";

                var response = new ApiErrorResponse
                {
                    Message = "系統發生未預期錯誤。",
                    Detail = context.RequestServices
                        .GetRequiredService<IHostEnvironment>()
                        .IsDevelopment()
                        ? exception?.Message
                        : null,
                    TraceId = context.TraceIdentifier
                };

                await context.Response.WriteAsJsonAsync(response);
            });
        });
    }
}
