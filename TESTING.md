# Testing Specification

## 1. Document Purpose

本文件定義 `FinanceAPI` 專案目前的測試範圍、測試方式、執行準則與後續擴充方向，作為開發、驗證與回歸測試的基準文件。

## 2. Test Objectives

本專案測試的主要目的如下：

- 驗證核心交易邏輯正確性
- 驗證輸入資料驗證規則
- 驗證 API 手動回歸流程可執行
- 建立後續功能擴充的測試基礎

## 3. Test Scope

目前測試範圍涵蓋以下模組：

### 3.1 Service Layer

- `AccountService`

### 3.2 Request Validation

- `TransferRequest`

### 3.3 Manual API Regression

- `FinanceAPI.http` 中定義之 API request 集合

## 4. Test Strategy

本專案目前採用以下兩種測試方式：

### 4.1 Automated Tests

使用單元測試方式驗證服務層與模型驗證規則。

特性：

- 可重複執行
- 可整合至 CI/CD
- 適合作為回歸測試保護

### 4.2 Manual API Tests

使用 HTTP request 檔案進行手動 API 驗證。

特性：

- 可驗證實際 request / response 行為
- 可用於功能開發中快速確認
- 可作為 Swagger 以外的輕量測試方式

## 5. Test Environment

### 5.1 Automated Test Environment

- .NET 8
- xUnit
- EF Core InMemory Provider

### 5.2 Manual Test Environment

- .NET 8 Web API Runtime
- VS Code + REST Client extension
- SQL Server

## 6. Test Artifacts

### 6.1 Automated Test Project

- `FinanceAPI.Tests/FinanceAPI.Tests.csproj`

### 6.2 Automated Test Files

- `FinanceAPI.Tests/Services/AccountServiceTests.cs`
- `FinanceAPI.Tests/Models/TransferRequestTests.cs`

### 6.3 Manual Test File

- `FinanceAPI.http`

## 7. Automated Test Coverage

### 7.1 AccountService Tests

目前自動測試已涵蓋以下行為：

1. 存款成功時，應更新帳戶餘額並新增一筆交易紀錄
2. 存款目標帳戶不存在時，應回傳失敗結果且不得新增交易紀錄
3. 提款金額超過餘額時，應回傳失敗結果且帳戶餘額不得變更
4. 提款成功時，應更新帳戶餘額並新增一筆交易紀錄

### 7.2 TransferRequest Validation Tests

目前自動測試已涵蓋以下驗證規則：

1. `FromAccountId` 與 `ToAccountId` 不可相同
2. `Amount` 必須大於 `0`

## 8. Manual API Regression Scope

`FinanceAPI.http` 目前包含以下三類手動回歸測試：

### 8.1 Happy Path

- 查詢帳戶資料
- 查詢餘額
- 查詢帳戶交易明細
- 存款成功
- 提款成功
- 轉帳成功
- 查詢單筆轉帳紀錄
- 查詢單筆交易明細

### 8.2 Validation Tests

- 存款金額為 `0`
- 存款金額小於 `0`
- 提款金額為 `0`
- 轉帳給自己
- 轉帳金額為 `0`
- 轉帳帳戶編號無效
- 轉帳金額型別錯誤

### 8.3 Business Error Tests

- 查詢不存在的帳戶
- 查詢不存在帳戶的餘額
- 查詢不存在帳戶的交易明細
- 對不存在帳戶存款
- 對不存在帳戶提款
- 提款超過餘額
- 查詢不存在的轉帳紀錄
- 查詢不存在的交易明細

## 9. Execution Standard

### 9.1 Automated Tests

自動測試應以以下指令執行：

```powershell
dotnet test .\FinanceAPI.Tests\FinanceAPI.Tests.csproj
```

或：

```powershell
dotnet test
```

### 9.2 Manual API Tests

手動測試應先啟動 API，再執行 `FinanceAPI.http` 中的 request。

API 啟動指令：

```powershell
dotnet run
```

### 9.3 Execution Order Recommendation

建議執行順序如下：

1. 啟動 API
2. 執行 `FinanceAPI.http` 進行手動驗證
3. 停止執行中的 API
4. 執行 `dotnet test`

## 10. Constraints and Known Issues

### 10.1 Binary File Lock on Windows

若 API 仍在執行中，Windows 可能鎖定主專案的輸出檔，造成自動測試建置失敗。

此情境下，應先停止執行中的 API 再進行 `dotnet test`。

### 10.2 Current Test Coverage Limitation

目前尚未涵蓋：

- Controller tests
- Integration tests
- TransferService tests
- Global exception handling tests
- Authentication / authorization tests
- Redis integration tests
- Kafka integration tests

## 11. Quality Baseline

目前可視為最低可接受測試基線的項目如下：

- 核心帳戶存提款邏輯具備自動測試
- 轉帳 request validation 具備自動測試
- API 基本成功流程具備手動測試
- API 驗證錯誤與業務錯誤具備手動回歸測試

## 12. Recommended Next Expansion

後續建議依序擴充以下測試範圍：

1. `TransferService` 自動測試
2. Controller 層測試
3. Integration Test
4. Authentication 測試
5. Redis 快取測試
6. Kafka 事件流程測試

## 13. Acceptance Criteria

當前測試規格的完成標準如下：

- 自動測試專案可成功建置與執行
- Service Layer 關鍵邏輯具備自動測試
- Request validation 關鍵規則具備自動測試
- `FinanceAPI.http` 可作為手動回歸測試清單
- 測試文件可作為專案測試基準與後續擴充依據
