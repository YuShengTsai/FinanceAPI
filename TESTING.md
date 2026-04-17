# Testing Specification

## 1. Document Purpose

本文件定義 `FinanceAPI` 專案目前的測試範圍、測試方式、執行準則與測試基線。

## 2. Test Scope

目前測試範圍如下：

### 2.1 Automated Tests

位置：

- `backend/FinanceAPI.Tests/`

涵蓋：

- `AccountService`
- `TransferRequest`

### 2.2 Manual API Regression

位置：

- `backend/FinanceAPI.http`

涵蓋：

- Happy Path
- Validation Tests
- Business Error Tests

## 3. Automated Test Specification

### 3.1 Test Project

- `backend/FinanceAPI.Tests/FinanceAPI.Tests.csproj`

### 3.2 Current Coverage

#### AccountService

1. 存款成功時應更新餘額並新增交易紀錄
2. 找不到帳戶時存款應失敗且不得新增交易紀錄
3. 提款餘額不足時應失敗且不得修改餘額
4. 提款成功時應更新餘額並新增交易紀錄

#### TransferRequest

1. 轉出帳戶與轉入帳戶不得相同
2. 轉帳金額必須大於 0

### 3.3 Execution

執行指令：

```powershell
cd backend
dotnet test .\FinanceAPI.Tests\FinanceAPI.Tests.csproj
```

或：

```powershell
cd backend
dotnet test
```

## 4. Manual Test Specification

### 4.1 Test File

- `backend/FinanceAPI.http`

### 4.2 Execution Preconditions

手動測試前需先啟動後端 API：

```powershell
cd backend
dotnet run
```

### 4.3 Tooling

建議工具：

- VS Code
- REST Client extension

### 4.4 Regression Categories

#### Happy Path

- 查詢帳戶資料
- 查詢餘額
- 查詢帳戶交易明細
- 存款成功
- 提款成功
- 轉帳成功
- 查詢單筆轉帳紀錄
- 查詢單筆交易明細

#### Validation Tests

- 存款金額為 0
- 存款金額小於 0
- 提款金額為 0
- 轉帳給自己
- 轉帳金額為 0
- 轉帳帳戶編號無效
- 轉帳金額型別錯誤

#### Business Error Tests

- 查詢不存在的帳戶
- 查詢不存在帳戶的餘額
- 查詢不存在帳戶的交易明細
- 對不存在帳戶存款
- 對不存在帳戶提款
- 提款超過餘額
- 查詢不存在的轉帳紀錄
- 查詢不存在的交易明細

## 5. Execution Order

建議測試順序如下：

1. 啟動後端 API
2. 執行 `backend/FinanceAPI.http` 做手動驗證
3. 停止執行中的 API
4. 執行 `dotnet test`

## 6. Known Constraint

若後端 API 正在執行，Windows 可能鎖定 `backend/bin` 內輸出檔，導致 `dotnet test` 建置失敗。  
此情況下應先停止 API，再執行自動測試。

## 7. Next Expansion

後續建議擴充測試如下：

1. `TransferService` 自動測試
2. Controller tests
3. Integration tests
4. Authentication tests
5. Redis integration tests
6. Kafka integration tests
