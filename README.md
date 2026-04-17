# FinanceAPI

## 1. Overview

`FinanceAPI` 為一個以 `.NET 8 Web API` 建置的簡易數位金融 / ATM 系統示範專案。  
目前專案已完成後端核心交易 API，並已進入前後端分離的專案結構：

- `backend/`：.NET 8 Web API、測試專案與後端設定
- `frontend/`：React 前端工作區

本專案後續將逐步整合：

- React Frontend
- JWT Authentication
- Redis
- Kafka
- Docker
- AWS

## 2. Repository Structure

```text
FinanceAPI/
├─ backend/
│  ├─ Controllers/
│  ├─ Data/
│  ├─ Extensions/
│  ├─ Models/
│  ├─ Services/
│  ├─ Properties/
│  ├─ FinanceAPI.Tests/
│  ├─ FinanceAPI.csproj
│  ├─ FinanceAPI.sln
│  ├─ FinanceAPI.http
│  └─ appsettings.json
├─ frontend/
├─ README.md
├─ PROJECT_PLAN.md
└─ TESTING.md
```

## 3. Backend Functional Scope

目前後端已完成功能如下：

### 3.1 Account APIs

- 查詢帳戶資料
- 查詢餘額
- 查詢帳戶交易明細
- 存款
- 提款

### 3.2 Transfer APIs

- 執行轉帳
- 查詢單筆轉帳紀錄

### 3.3 Transaction APIs

- 查詢單筆交易明細

## 4. Technology Stack

### 4.1 Backend

- .NET 8 Web API
- Entity Framework Core 8
- SQL Server
- Swagger / OpenAPI
- xUnit

### 4.2 Frontend

- React
- TypeScript
- Vite

## 5. Execution

### 5.1 Start Backend API

請先切換至 `backend/` 目錄：

```powershell
cd backend
dotnet run
```

### 5.2 Backend Development Mode

```powershell
cd backend
dotnet watch run
```

### 5.3 Swagger

啟動後端後可使用：

- `http://localhost:5097/swagger`
- `https://localhost:7200/swagger`

## 6. Runtime Configuration

後端連線字串設定位置：

- `backend/appsettings.json`
- `backend/appsettings.Development.json`

公開 repo 建議使用通用設定，例如：

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=Finance;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

## 7. Documents

- `PROJECT_PLAN.md`：專案規劃文件
- `TESTING.md`：測試規格文件
- `backend/FinanceAPI.http`：手動 API 回歸測試檔

## 8. Current Limitations

目前版本尚未完成：

- Authentication / Authorization
- React UI implementation
- Redis integration
- Kafka integration
- Dockerized full-stack runtime
- AWS deployment

## 9. Current Phase

目前專案已完成 `Backend Stabilization`，並已切入：

- `phase/02-react-frontend`

後續將在前端工作區逐步建立 React 應用。 
