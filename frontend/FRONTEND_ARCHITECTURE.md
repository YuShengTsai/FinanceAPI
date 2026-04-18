# 前端架構規格文件

## 1. 文件目的

本文件用於說明 `FinanceAPI` 專案目前的前端架構設計，以及 React 前端各層級的職責分工。

此前端系統定位為一個輕量化的 ATM / 網銀操作介面，並與既有的 .NET 8 Web API 後端整合。

## 2. 技術組成

- React
- TypeScript
- Vite
- React Router DOM
- Bootstrap

## 3. 架構目標

目前前端架構採用模組化、可逐步擴充的設計方式。  
其核心目標是在支援迭代開發的同時，清楚分離以下關注點：

- 頁面組裝
- 可重用 UI 元件
- API 整合
- TypeScript 型別定義
- 應用程式啟動與路由配置

## 4. 原始碼結構

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
├─ FRONTEND_ARCHITECTURE.md
├─ package.json
└─ vite.config.ts
```

## 5. 分層職責

### 5.1 `main.tsx`

`main.tsx` 為應用程式的啟動入口。

主要職責如下：

- 建立 React root
- 初始化 `BrowserRouter`
- 載入 Bootstrap 與全域樣式
- 掛載根元件 `App`

### 5.2 `App.tsx`

`App.tsx` 為應用程式最上層的畫面殼層。

主要職責如下：

- 定義整體版面配置
- 顯示主要導覽列
- 配置前端路由
- 將頁面元件對應至指定路徑

### 5.3 `pages/`

`pages` 層負責放置路由層級的完整畫面。

主要職責如下：

- 表示完整的使用者頁面
- 管理頁面層級的狀態與流程
- 組合可重用元件
- 在需要時呼叫 service 執行後端請求

目前範例：

- `HomePage.tsx`
- `TransferPage.tsx`

### 5.4 `components/`

`components` 層負責放置可重用的展示型 UI 元件。

主要職責如下：

- 封裝重複使用的畫面結構
- 降低 page 檔案複雜度
- 提供跨頁面一致的樣式與呈現方式

目前範例：

- `SectionCard.tsx`

### 5.5 `services/`

`services` 層負責前端與後端 API 的整合邏輯。

主要職責如下：

- 將 HTTP 通訊邏輯與 UI 分離
- 提供可重用的請求函式
- 集中管理 API 路徑與 response 處理
- 降低不同頁面重複撰寫請求邏輯的情況

目前範例：

- `transferService.ts`

### 5.6 `types/`

`types` 層負責前端使用的 TypeScript 領域模型與契約型別。

主要職責如下：

- 定義 request 與 response 的資料結構
- 提供更清楚的型別提示與安全性
- 讓前後端資料契約在前端邊界保持明確

目前範例：

- `transfer.ts`

## 6. 樣式策略

目前前端樣式以 Bootstrap 作為主要 UI 基礎框架。

Bootstrap 的使用目的如下：

- 提供一致的 spacing、layout、form、button 與 alert 樣式
- 降低初期開發所需的自訂 CSS 數量
- 提升頁面建立與調整速度

自訂 CSS 保留在以下用途：

- 專案整體視覺識別
- 頁面背景與氛圍設定
- 對 Bootstrap 預設樣式進行少量微調

## 7. 目前路由模型

目前前端路由結構保持在最小可用範圍：

- `/`
- `/transfer`

後續預計隨功能擴充加入：

- 帳戶總覽
- 餘額查詢
- 交易明細
- 登入流程

## 8. API 整合模式

目前前端 API 呼叫採用 service-based pattern。

目前流程如下：

1. 頁面收集使用者輸入並管理 UI state
2. 頁面呼叫對應的 service function
3. service 執行 HTTP request
4. 頁面根據結果顯示成功或失敗訊息

此設計可避免將 HTTP 細節直接耦合在可重用元件中，也能降低 page 與後端實作細節的綁定程度。

## 9. 擴充規範

後續新增前端功能時，應維持以下原則：

- 路由層級畫面新增於 `pages/`
- 可重用畫面區塊新增於 `components/`
- 後端 API 呼叫新增於 `services/`
- request / response 型別新增於 `types/`
- `App.tsx` 僅保留 layout 與 routing 職責
- 相同 API 若可能被多個頁面共用，不應在各 page 中重複直接撰寫 `fetch`

## 10. 預計演進方向

此前端架構預計依下列順序擴充：

1. 補上帳戶查詢與交易查詢頁面
2. 將 API Base URL 移入環境變數設定
3. 引入登入與驗證相關頁面
4. 增加更多共用表單與結果呈現元件
5. 視專案複雜度評估是否需要更完整的狀態管理方案

## 11. 結論

目前前端架構是一個可穩定成長的單頁應用程式基礎結構。

其核心設計原則如下：

- 關注點清楚分離
- 路由結構單純明確
- API 呼叫集中於 service 層
- 以 TypeScript 明確定義資料契約
- 以 Bootstrap 加速畫面建置與統一樣式基礎
