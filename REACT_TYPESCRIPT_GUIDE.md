# React + TypeScript 學習指南

## 文件目的

本文件用於整理 `FinanceAPI` 專案前端階段所需的 React 與 TypeScript 核心知識，並對應目前 `phase/02-react-frontend` 已建立的實作內容。  
目標不是一次學完所有前端主題，而是先掌握足以開發 ATM Web 介面的必要能力。

## 目前前端階段目標

目前已完成的第一步是建立 React + Vite + TypeScript 前端骨架，並用假資料完成一個可互動的 Dashboard 畫面。  
這一版主要用途如下：

- 熟悉 React component 的拆分方式
- 理解 props 如何把資料往下傳
- 理解 state 如何控制畫面狀態
- 理解 `map()` 與 `filter()` 如何驅動畫面
- 建立後續串接 .NET Web API 的前端基礎

## 目前你最需要先會的觀念

### 1. Component

React 的畫面是由一個個 component 組成。  
你可以把 component 想成「可重複使用的畫面區塊」。

目前這版已經拆成：

- `PageHeader`
- `AccountSelector`
- `BalanceCard`
- `LearningPanel`
- `TransactionList`

這樣拆的好處是每個元件責任清楚，之後要維護或擴充都比較容易。

### 2. JSX

JSX 是 React 用來描述畫面的語法，看起來像 HTML，但本質上是在 TypeScript 裡面寫 UI。

例如：

```tsx
function Title() {
  return <h1>Finance ATM Dashboard</h1>
}
```

你可以先把 JSX 理解成「在程式中寫畫面」。

### 3. Props

Props 是父元件傳給子元件的資料。

例如目前的 `BalanceCard`：

```tsx
type BalanceCardProps = {
  account: Account
}

export function BalanceCard({ account }: BalanceCardProps) {
  return <p>{account.balance}</p>
}
```

這表示：

- `App.tsx` 是父元件
- `BalanceCard.tsx` 是子元件
- `account` 是從父元件傳進來的資料

### 4. State

State 是畫面自己的狀態，當 state 改變時，React 會重新 render 畫面。

目前這版最重要的兩個 state：

```tsx
const [selectedAccountId, setSelectedAccountId] = useState<number>(accounts[0].accountId)
const [selectedType, setSelectedType] = useState<TransactionType | 'All'>('All')
```

這代表目前畫面會記住：

- 使用者目前選到哪個帳戶
- 使用者目前選到哪個交易類型

### 5. List Rendering

當資料很多筆時，React 會用 `map()` 來產生清單畫面。

例如：

```tsx
{transactions.map((transaction) => (
  <article key={transaction.transactionId}>
    <p>{transaction.type}</p>
  </article>
))}
```

這是 React 開發中非常常見的模式，之後交易明細、帳戶列表都會一直用到。

### 6. Conditional Data Flow

目前畫面已經示範「根據狀態篩選資料」：

```tsx
const filteredTransactions = transactions.filter((transaction) => {
  const sameAccount = transaction.accountId === currentAccount.accountId
  const sameType = selectedType === 'All' || transaction.type === selectedType

  return sameAccount && sameType
})
```

這段很重要，因為之後你做：

- 餘額查詢
- 交易明細查詢
- 條件搜尋
- 分頁篩選

本質都會是同一類思維。

## TypeScript 在這個專案中的用途

TypeScript 的核心價值不是讓你寫更多語法，而是幫你把資料型別先定清楚。

目前已建立的型別檔案：

- `frontend/src/types/atm.ts`

內容包含：

- `Account`
- `Transaction`
- `TransactionType`

例如：

```ts
export type Account = {
  accountId: number
  customerId: number
  accountNumber: string
  balance: number
  currency: string
  createdAt: string
}
```

這樣做的好處：

- 畫面使用資料時比較不容易拼錯欄位
- 串 API 時比較容易對照後端 schema
- VS Code 會提供更好的型別提示

## 目前前端檔案結構

```text
frontend/
├─ src/
│  ├─ components/
│  │  ├─ AccountSelector.tsx
│  │  ├─ BalanceCard.tsx
│  │  ├─ LearningPanel.tsx
│  │  ├─ PageHeader.tsx
│  │  └─ TransactionList.tsx
│  ├─ data/
│  │  └─ mockData.ts
│  ├─ types/
│  │  └─ atm.ts
│  ├─ App.tsx
│  ├─ App.css
│  ├─ index.css
│  └─ main.tsx
└─ package.json
```

各層責任如下：

- `App.tsx`: 頁面組裝與 state 管理
- `components/`: 可重用畫面元件
- `data/`: 目前的假資料，之後會改成 API 資料
- `types/`: 前端型別定義
- `main.tsx`: React 入口

## 你現在可以怎麼讀這一版程式

建議照以下順序：

1. 先看 `frontend/src/main.tsx`
2. 再看 `frontend/src/App.tsx`
3. 然後看 `frontend/src/types/atm.ts`
4. 再看 `frontend/src/data/mockData.ts`
5. 最後依序看 `components/` 裡面的元件

這樣你會比較容易理解：

- React 是怎麼進入應用程式的
- 畫面資料從哪裡來
- 為什麼 state 改變後畫面會跟著更新

## 這一階段先不要急著學太多的東西

目前先不用深入以下主題：

- Redux
- Zustand
- React Query
- 複雜 Router 設計
- 自訂 Hooks 抽象
- 效能優化技巧

原因很簡單，現在最重要的是先把基本的畫面組成與資料流理解清楚。  
如果基礎還沒穩，太早跳到進階工具會很容易混亂。

## 下一步建議學習與實作順序

接下來最適合的順序如下：

1. 把目前假資料畫面看懂
2. 練習新增表單元件
3. 實作存款與提款表單
4. 加入 `fetch` 或 `axios` 串接後端 API
5. 加入載入中與錯誤訊息顯示
6. 再導入 React Router 做多頁切換

## 對應目前專案的學習重點

如果你的目標是做出一個簡單 ATM Web 系統，那你目前至少要熟悉以下能力：

- 能看懂 function component
- 能看懂 JSX 結構
- 能使用 `useState`
- 能處理 `onClick`、`onChange`、`onSubmit`
- 能用 `map()` 渲染清單
- 能用 `filter()` 做資料篩選
- 能看懂 TypeScript 的基本型別定義

## 總結

目前這一版前端不是最終產品，而是「進入 React 開發的第一個可運作骨架」。  
只要你先把這版看懂，後面再接：

- 登入系統
- 帳戶查詢
- 存款
- 提款
- 轉帳
- 交易明細

都會順很多。

這一階段請先把核心記住：

`component + props + state + list rendering + types`
