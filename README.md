# FinanceAPI

簡單 ATM 系統示範 API，使用 `.NET 8 Web API`、`EF Core SqlServer` 與 `Swagger` 建立。

目前這個版本以 ATM 常見功能為主：

- 查詢帳戶資料
- 查詢餘額
- 存款
- 提款
- 轉帳
- 查詢帳戶交易明細
- 查詢單筆交易明細
- 查詢單筆轉帳紀錄

## 專案技術

- .NET 8 Web API
- Entity Framework Core 8
- SQL Server
- Swagger / OpenAPI

## 專案結構

- `Controllers/`
  - API 路由與 HTTP 回應處理
- `Services/`
  - 商業邏輯與資料流程
- `Data/`
  - `AppDbContext`
- `Models/`
  - Entity 與 request/response DTO

## 執行方式

先確認 `appsettings.json` 內的 SQL Server 連線字串正確：

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=DESKTOP-E2M202R\\SQLEXPRESS;Database=Finance;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

在專案根目錄執行：

```powershell
dotnet run
```

或開發時使用：

```powershell
dotnet watch run
```

啟動後可使用 Swagger 測試：

- `http://localhost:5097/swagger`
- `https://localhost:7200/swagger`

## 資料表

### Accounts

| 欄位 | 型別 |
| --- | --- |
| AccountId | int |
| CustomerId | int |
| AccountNumber | nvarchar |
| Balance | decimal |
| Currency | nvarchar |
| CreatedAt | datetime |

### Transactions

| 欄位 | 型別 |
| --- | --- |
| TransactionId | int |
| AccountId | int |
| Type | nvarchar |
| Amount | decimal |
| Status | nvarchar |
| CreatedAt | datetime |

### TransferDetails

| 欄位 | 型別 |
| --- | --- |
| TransferId | int |
| FromAccountId | int |
| ToAccountId | int |
| Amount | decimal |
| CreatedAt | datetime |

## API 一覽

### Accounts

#### 1. 查詢帳戶資料

`GET /api/accounts/{accountId}`

範例：

```http
GET /api/accounts/1
```

成功回應：

```json
{
  "accountId": 1,
  "customerId": 1001,
  "accountNumber": "ACC-0001",
  "balance": 10000.50,
  "currency": "TWD",
  "createdAt": "2026-04-17T10:00:00"
}
```

#### 2. 查詢餘額

`GET /api/accounts/{accountId}/balance`

範例：

```http
GET /api/accounts/1/balance
```

成功回應：

```json
{
  "accountId": 1,
  "accountNumber": "ACC-0001",
  "balance": 10000.50,
  "currency": "TWD"
}
```

#### 3. 查詢帳戶交易明細

`GET /api/accounts/{accountId}/transactions`

範例：

```http
GET /api/accounts/1/transactions
```

成功回應：

```json
[
  {
    "transactionId": 10,
    "accountId": 1,
    "type": "Deposit",
    "amount": 1000.00,
    "status": "Success",
    "createdAt": "2026-04-17T10:10:00"
  },
  {
    "transactionId": 9,
    "accountId": 1,
    "type": "Withdraw",
    "amount": 500.00,
    "status": "Success",
    "createdAt": "2026-04-17T10:05:00"
  }
]
```

#### 4. 存款

`POST /api/accounts/{accountId}/deposit`

Request Body：

```json
{
  "amount": 1000.00
}
```

成功回應：

```json
{
  "success": true,
  "message": "Deposit completed successfully.",
  "transactionId": 11,
  "balance": 11000.50
}
```

#### 5. 提款

`POST /api/accounts/{accountId}/withdraw`

Request Body：

```json
{
  "amount": 500.00
}
```

成功回應：

```json
{
  "success": true,
  "message": "Withdraw completed successfully.",
  "transactionId": 12,
  "balance": 10500.50
}
```

餘額不足回應：

```json
{
  "success": false,
  "message": "Insufficient balance.",
  "transactionId": null,
  "balance": 300.00
}
```

### Transfers

#### 6. 轉帳

`POST /api/transfers`

此 API 會呼叫 SQL Server stored procedure `TransferMoney`。

Request Body：

```json
{
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 500.00
}
```

成功回應：

```json
{
  "resultCode": 0,
  "resultMessage": "Transfer successful."
}
```

失敗回應：

```json
{
  "resultCode": 1001,
  "resultMessage": "Insufficient balance."
}
```

#### 7. 查詢單筆轉帳紀錄

`GET /api/transfers/{transferId}`

範例：

```http
GET /api/transfers/1
```

成功回應：

```json
{
  "transferId": 1,
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 500.00,
  "createdAt": "2026-04-17T10:20:00"
}
```

### Transactions

#### 8. 查詢單筆交易明細

`GET /api/transactions/{transactionId}`

範例：

```http
GET /api/transactions/1
```

成功回應：

```json
{
  "transactionId": 1,
  "accountId": 1,
  "type": "Deposit",
  "amount": 1000.00,
  "status": "Success",
  "createdAt": "2026-04-17T10:10:00"
}
```

## 測試方式

專案根目錄已提供 `FinanceAPI.http`，可直接在 IDE 中送出測試請求。

也可以使用 Swagger：

- `GET /api/accounts/{accountId}`
- `GET /api/accounts/{accountId}/balance`
- `GET /api/accounts/{accountId}/transactions`
- `POST /api/accounts/{accountId}/deposit`
- `POST /api/accounts/{accountId}/withdraw`
- `POST /api/transfers`
- `GET /api/transfers/{transferId}`
- `GET /api/transactions/{transactionId}`

## 注意事項

- `TransferMoney` stored procedure 需先存在於 SQL Server 中
- 此版本為簡化 ATM demo，存款與提款目前由 EF Core 直接寫入資料庫
- 若後續要提升一致性，存款與提款考慮也改為 stored procedure 或 transaction 保護
