# Testing Specification

## 1. 文件目的

本文件定義 `FinanceAPI` 專案目前測試範圍、執行方式、權限驗證原則與回歸測試項目，作為後續功能擴充與版本調整時的測試依據。

## 2. 測試範圍

目前測試分為下列兩類：

### 2.1 自動化測試

位置：

- `backend/FinanceAPI.Tests/`

目前涵蓋：

- `AccountService`
- `TransferRequest`

### 2.2 手動 API 回歸測試

位置：

- `backend/FinanceAPI.http`

目前涵蓋：

- Authentication
- User Happy Path
- Authorization Tests
- Admin Happy Path
- Validation Tests
- Business Error Tests

## 3. 自動化測試規格

### 3.1 測試專案

- `backend/FinanceAPI.Tests/FinanceAPI.Tests.csproj`

### 3.2 目前覆蓋項目

#### AccountService

1. 存款成功後應正確更新餘額並回傳成功結果。
2. 存款時若帳戶不存在，應回傳失敗結果。
3. 提款成功後應正確扣除餘額並回傳成功結果。
4. 提款時若餘額不足，應回傳失敗結果。

#### TransferRequest

1. 來源帳戶與目標帳戶不得相同。
2. 轉帳金額必須大於 0。

### 3.3 執行方式

於專案根目錄執行：

```powershell
cd backend
dotnet test .\FinanceAPI.Tests\FinanceAPI.Tests.csproj
```

或直接於 `backend` 目錄執行：

```powershell
cd backend
dotnet test
```

## 4. 手動 API 測試規格

### 4.1 測試檔案

- `backend/FinanceAPI.http`

### 4.2 執行前置條件

執行手動測試前，應先啟動後端 API：

```powershell
cd backend
dotnet run
```

### 4.3 測試工具

建議使用：

- VS Code
- REST Client extension

### 4.4 權限測試原則

目前系統已導入登入與角色權限控管，手動測試須依下列規則進行驗證：

- 未登入使用者不得存取受保護 API。
- 一般使用者僅可查詢與操作自己可存取的帳戶。
- 一般使用者可執行轉帳，但僅能以自己可操作的帳戶作為來源帳戶。
- 轉帳紀錄查詢功能僅限 `Admin` 使用者執行。
- `Admin` 可查詢所有帳戶、交易紀錄與轉帳紀錄。

### 4.5 回歸測試分類

#### Authentication

- 一般使用者登入成功
- 管理者登入成功
- 帳號或密碼錯誤時登入失敗

#### User Happy Path

- 查詢可存取帳戶清單
- 查詢帳戶資料
- 查詢帳戶餘額
- 查詢帳戶交易明細
- 存款
- 提款
- 轉帳
- 查詢單筆交易紀錄
- 條件查詢交易紀錄

#### Authorization Tests

- 未登入查詢受保護 API
- 一般使用者查詢不屬於自己的帳戶
- 一般使用者查詢其他帳戶的交易紀錄
- 一般使用者查詢轉帳紀錄列表
- 一般使用者查詢單筆轉帳紀錄

#### Admin Happy Path

- 管理者查詢所有帳戶
- 管理者查詢交易列表
- 管理者查詢轉帳紀錄列表
- 管理者查詢單筆轉帳紀錄

#### Validation Tests

- 存款金額等於 0
- 存款金額小於 0
- 提款金額等於 0
- 轉帳來源與目標相同
- 轉帳金額等於 0
- 轉帳帳戶編號無效
- 轉帳金額格式錯誤

#### Business Error Tests

- 查詢不存在的帳戶
- 查詢不存在的餘額
- 查詢不存在的帳戶交易
- 對不存在的帳戶存款
- 對不存在的帳戶提款
- 提款超過餘額
- 查詢不存在的轉帳紀錄
- 查詢不存在的交易紀錄

## 5. 建議執行順序

為降低測試過程中的相依問題，建議依下列順序執行：

1. 啟動後端 API。
2. 先執行 `Authentication` 測試，取得一般使用者與管理者 Token。
3. 執行 `User Happy Path`。
4. 執行 `Authorization Tests`。
5. 執行 `Admin Happy Path`。
6. 執行 `Validation Tests` 與 `Business Error Tests`。
7. 最後執行 `dotnet test` 完成自動化測試驗證。

## 6. 已知限制

- 手動測試依賴本機資料庫中的 `Users`、`Accounts`、`Transactions` 與 `TransferDetails` 資料。
- `backend/FinanceAPI.http` 內預設登入帳號密碼需與目前資料庫內容一致。
- 若後端執行中導致 `bin` 或 `obj` 檔案被鎖定，`dotnet test` 可能失敗；建議先停止執行中的 API 再測試。
- 目前自動化測試尚未涵蓋 JWT 驗證、Controller 授權與整合測試情境。

## 7. 後續擴充建議

建議下一階段補強以下測試項目：

1. `AuthService` 單元測試。
2. Controller 層授權測試。
3. JWT 與角色權限整合測試。
4. 轉帳流程整合測試。
5. 前端登入與權限導向測試。
6. Redis 與 Kafka 導入後的整合測試。
