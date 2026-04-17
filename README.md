# FinanceAPI

## 1. Overview

`FinanceAPI` 為一個以 `.NET 8 Web API` 建置的簡易數位金融 / ATM 系統示範專案。  
本專案以帳戶查詢、餘額查詢、存款、提款、轉帳與交易明細查詢為核心功能，並作為後續整合 `React`、`Redis`、`Kafka`、`Docker` 與 `AWS` 的基礎系統。

## 2. Objectives

本專案目標如下：

- 建立具備基本金融交易流程的後端 API
- 提供可擴充的 Service Layer 架構
- 作為後續快取、事件流與雲端部署的實驗基底
- 作為 side project / portfolio 展示用專案

## 3. Technology Stack

- .NET 8 Web API
- Entity Framework Core 8
- SQL Server
- Swagger / OpenAPI
- xUnit

## 4. Current Functional Scope

目前已完成之功能如下：

### 4.1 Account APIs

- 查詢帳戶資料
- 查詢餘額
- 查詢帳戶交易明細
- 存款
- 提款

### 4.2 Transfer APIs

- 執行轉帳
- 查詢單筆轉帳紀錄

### 4.3 Transaction APIs

- 查詢單筆交易明細

## 5. Project Structure

```text
FinanceAPI
├─ Controllers/
├─ Data/
├─ Extensions/
├─ Models/
├─ Services/
├─ FinanceAPI.Tests/
├─ README.md
├─ PROJECT_PLAN.md
└─ TESTING.md
```

目錄說明如下：

- `Controllers/`：API 路由與 HTTP 回應處理
- `Services/`：業務邏輯與服務層
- `Data/`：`AppDbContext` 與資料存取設定
- `Models/`：Entity、DTO 與 API response model
- `Extensions/`：應用程式擴充設定，例如例外處理與 validation pipeline
- `FinanceAPI.Tests/`：自動測試專案

## 6. Runtime Configuration

### 6.1 Connection String

專案透過 `appsettings.json` 或 `appsettings.Development.json` 讀取 SQL Server 連線字串。

公開 repo 建議使用通用範例設定：

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=Finance;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

個人開發環境實際設定應放置於本機開發設定檔，不建議將個人機器名稱直接提交至公開 repository。

## 7. Data Model

### 7.1 Accounts

| Column | Type |
| --- | --- |
| AccountId | int |
| CustomerId | int |
| AccountNumber | nvarchar |
| Balance | decimal |
| Currency | nvarchar |
| CreatedAt | datetime |

### 7.2 Transactions

| Column | Type |
| --- | --- |
| TransactionId | int |
| AccountId | int |
| Type | nvarchar |
| Amount | decimal |
| Status | nvarchar |
| CreatedAt | datetime |

### 7.3 TransferDetails

| Column | Type |
| --- | --- |
| TransferId | int |
| FromAccountId | int |
| ToAccountId | int |
| Amount | decimal |
| CreatedAt | datetime |

## 8. API Specification Summary

### 8.1 Accounts

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/accounts/{accountId}` | 查詢帳戶資料 |
| GET | `/api/accounts/{accountId}/balance` | 查詢帳戶餘額 |
| GET | `/api/accounts/{accountId}/transactions` | 查詢帳戶交易明細 |
| POST | `/api/accounts/{accountId}/deposit` | 執行存款 |
| POST | `/api/accounts/{accountId}/withdraw` | 執行提款 |

### 8.2 Transfers

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/transfers` | 執行轉帳 |
| GET | `/api/transfers/{transferId}` | 查詢單筆轉帳紀錄 |

### 8.3 Transactions

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/transactions/{transactionId}` | 查詢單筆交易明細 |

## 9. Transfer Mechanism

轉帳功能透過 SQL Server stored procedure `TransferMoney` 執行。  
目前 API 呼叫方式為：

- 輸入參數：
  - `@FromAccountId`
  - `@ToAccountId`
  - `@Amount`
- 輸出參數：
  - `@ResultCode`
  - `@ResultMessage`

## 10. Error Handling and Validation

目前後端已具備以下基礎穩定化能力：

- 全域例外處理
- `ValidationProblemDetails` 驗證錯誤格式
- 繁體中文錯誤訊息
- 基本交易輸入驗證

## 11. Execution

### 11.1 Start Application

```powershell
dotnet run
```

### 11.2 Development Mode

```powershell
dotnet watch run
```

### 11.3 Swagger

- `http://localhost:5097/swagger`
- `https://localhost:7200/swagger`

## 12. Testing References

測試相關文件如下：

- `TESTING.md`：測試規格
- `FinanceAPI.http`：手動 API 回歸測試請求檔
- `FinanceAPI.Tests/`：自動測試專案

## 13. Project Planning References

規劃文件如下：

- `PROJECT_PLAN.md`：整體發展規劃與技術里程碑

## 14. Current Limitations

目前版本仍屬簡化示範系統，尚未涵蓋：

- Authentication / Authorization
- Frontend application
- Redis cache integration
- Kafka event-driven workflow
- Dockerized full-stack runtime
- AWS deployment
- Integration test coverage

## 15. Future Direction

後續規劃將依序導入：

1. React Frontend
2. JWT Login
3. Redis
4. Kafka
5. Docker
6. AWS
