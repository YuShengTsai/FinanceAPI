# FinanceAPI 前端說明

## 專案概述

此目錄為 `FinanceAPI` side project 的前端程式碼，使用 React 建立 ATM / 網銀風格的操作介面，並串接既有的 .NET 8 Web API 後端。

目前前端主要負責：

- 提供帳戶相關操作入口
- 串接帳戶、交易、轉帳等後端 API
- 呈現首頁 dashboard、查詢頁與操作頁面
- 作為後續登入、Docker、雲端部署與進階功能的前端基礎

## 技術組成

- React
- TypeScript
- Vite
- React Router DOM
- Bootstrap

## 目前功能範圍

目前前端已具備以下基礎能力：

- Vite 前端啟動與建置流程
- 前端路由結構
- JWT 登入流程
- 前端受保護路由
- 首頁 dashboard
- 帳戶服務頁
- 轉帳作業頁
- 交易查詢頁
- 轉帳紀錄查詢頁
- service-based API 呼叫結構
- Bootstrap 樣式整合

## 本機開發方式

### 1. 安裝套件

```bash
npm install
```

### 2. 建立環境變數檔案

```bash
copy .env.example .env
```

### 3. 設定後端 API Base URL

請在 `.env` 中設定：

```text
VITE_API_BASE_URL=http://localhost:5097
```

若後端實際執行於其他網址，請同步調整此值。

## 登入資料來源

目前登入流程已改為讀取後端 `Users` 資料表。

目前欄位如下：

```text
UserId int
Username nvarchar
PasswordHash nvarchar
Role nvarchar
CreatedAt datetime
```

目前為開發階段，`PasswordHash` 暫時以明文方式比對。後續建議升級為正式的密碼雜湊機制。

### 4. 啟動前端開發伺服器

```bash
npm run dev
```

### 5. 建立正式版

```bash
npm run build
```

### 6. 執行 Lint 檢查

```bash
npm run lint
```

## 目錄結構說明

```text
frontend/
├─ src/
│  ├─ components/
│  ├─ pages/
│  ├─ services/
│  ├─ types/
│  ├─ App.tsx
│  ├─ App.css
│  ├─ index.css
│  └─ main.tsx
├─ .env.example
├─ FRONTEND_ARCHITECTURE.md
├─ package.json
└─ vite.config.ts
```

各層用途如下：

- `components/`
  放置可重用的展示型元件
- `pages/`
  放置路由層級頁面
- `services/`
  放置 API 呼叫邏輯
- `types/`
  放置 TypeScript request / response 型別
- `App.tsx`
  前端主殼層與路由配置
- `main.tsx`
  React 啟動入口

## 架構文件

更完整的前端架構說明請參考：

[FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)

## 補充說明

- 前端目前預設會從首頁載入一筆帳戶摘要與最近交易資料，用於首頁 dashboard 展示
- 前端與後端若分別跑在不同 port，請確保後端 CORS 已允許前端來源
- 後續建議優先補上登入流程、使用者身份綁定與首頁真實帳戶資料來源
