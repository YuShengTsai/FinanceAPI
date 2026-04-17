# Project Plan

## 1. Document Purpose

本文件定義 `FinanceAPI` 專案的中長期開發規劃、階段目標、技術導入順序與架構建議，作為後續功能演進與 side project 管理基準。

## 2. Project Vision

本專案最終目標為建置一套可展示完整工程能力的簡易數位金融 / ATM 系統，並逐步整合：

- .NET 8 Web API
- React Frontend
- JWT Authentication
- Redis
- Kafka
- Docker
- AWS

最終系統應同時具備：

- 後端 API 能力
- 前後端整合能力
- 快取策略
- 事件驅動架構
- 容器化部署能力
- 雲端部署能力

## 3. Current Baseline

目前已完成之基線如下：

- Accounts API
- Balance API
- Deposit API
- Withdraw API
- Transfer API
- Account Transactions API
- Single Transaction API
- Single Transfer Detail API
- Service Layer 基本架構
- 全域錯誤處理
- Validation pipeline
- 手動 API regression file
- 基本自動測試專案

## 4. Delivery Strategy

本專案採分階段推進，原則如下：

- 每一階段完成後，系統仍需保持可執行
- 每一階段應有明確的交付成果
- 優先完成具實際用途的功能，而非先導入過度複雜架構
- 技術導入順序應服務於專案完整度與展示價值

## 5. Development Roadmap

### Phase 1: Backend Stabilization

#### Objective

建立穩定的後端核心基礎，確保既有 API 可持續擴充。

#### Scope

- 統一 DTO 與 response format
- 整理錯誤處理機制
- 補強輸入驗證
- 建立手動回歸測試檔
- 建立基礎自動測試
- 補齊設定文件與測試文件

#### Deliverables

- 穩定可運作的 API 基底
- 明確的錯誤格式與驗證機制
- 手動與自動測試基線

### Phase 2: React Frontend

#### Objective

將後端 API 擴展為可操作的完整產品原型。

#### Scope

- Login Page
- Dashboard
- Account Overview
- Balance View
- Deposit Form
- Withdraw Form
- Transfer Form
- Transaction History View

#### Deliverables

- 可操作的前端頁面
- 與後端 API 完整串接

### Phase 3: Authentication

#### Objective

建立使用者登入與授權基礎。

#### Scope

- Users data model
- Login API
- JWT token
- Protected routes
- Frontend login flow
- User-based data access restriction

#### Deliverables

- 基本登入機制
- API 保護機制
- 前端登入狀態管理

### Phase 4: Redis Integration

#### Objective

導入快取與高頻查詢優化能力。

#### Priority Use Cases

- Balance cache
- Account transactions cache
- Cache invalidation after deposit / withdraw / transfer

#### Optional Extensions

- Rate limiting
- Session / token blacklist
- Distributed lock

#### Deliverables

- Redis-based query cache
- 快取失效與更新策略

### Phase 5: Kafka Integration

#### Objective

建立交易事件流與非同步處理機制。

#### Priority Use Cases

- Deposit completed event
- Withdraw completed event
- Transfer completed event

#### Consumer Targets

- Audit log
- Notification log
- Transaction event history

#### Optional Extensions

- Fraud detection
- Reporting pipeline

#### Deliverables

- Kafka producer
- Kafka consumer
- 基本事件流架構

### Phase 6: Dockerization

#### Objective

提供一致化且可攜式的執行環境。

#### Scope

- Backend Dockerfile
- Frontend Dockerfile
- docker-compose.yml
- Redis container
- Kafka container
- SQL Server container 或外部資料庫設定

#### Deliverables

- 可透過 `docker compose up` 啟動主要服務

### Phase 7: Cloud Deployment

#### Objective

將專案部署為可公開展示的線上系統。

#### Suggested Targets

- Frontend: S3 + CloudFront 或 Vercel
- Backend: ECS / App Runner / Elastic Beanstalk
- Database: RDS
- Redis: ElastiCache
- Kafka: MSK
- Secrets: Parameter Store / Secrets Manager

#### Deliverables

- 可對外展示的執行環境
- 基本部署文件

## 6. Recommended Implementation Order

建議實際執行順序如下：

1. Backend Stabilization
2. React Frontend
3. Authentication
4. Redis
5. Kafka
6. Docker
7. AWS

## 7. Design Pattern Recommendations

### 7.1 Recommended for Current Stage

#### Service Layer Pattern

用途：

- 分離 Controller 與商業邏輯

#### DTO Pattern

用途：

- 分離 Entity 與 API request/response model

#### Result Pattern

用途：

- 統一成功 / 失敗回傳格式

#### Options Pattern

用途：

- 管理 JWT、Redis、Kafka、AWS 相關設定

### 7.2 Recommended for Redis Phase

#### Cache Aside Pattern

用途：

- 查詢先讀 cache，miss 時再查 DB

#### Adapter Pattern

用途：

- 將 Redis 實作封裝於抽象介面之後

### 7.3 Recommended for Kafka Phase

#### Publisher / Subscriber Pattern

用途：

- 建立交易事件發佈與訂閱流程

#### Background Worker Pattern

用途：

- 執行 Kafka consumer 或背景處理程序

#### Outbox Pattern

用途：

- 確保資料庫交易與事件發佈的一致性

## 8. Architecture Direction

### Current Structure

- Controller
- Service
- DbContext
- SQL Server

### Target Structure

- `Controllers/`
- `Services/`
- `Services/Interfaces/`
- `Models/`
- `Data/`
- `Extensions/`
- `Infrastructure/Cache/`
- `Infrastructure/Messaging/`
- `Infrastructure/Auth/`
- `Infrastructure/Persistence/`

## 9. Priority Feature Ranking

若需以展示價值與實作成本做平衡，建議優先順序如下：

1. React Frontend
2. JWT Login
3. Redis balance cache
4. Redis transactions cache
5. Kafka transaction event publish
6. Kafka audit / notification consumer
7. Docker compose
8. AWS deployment

## 10. Portfolio Positioning

本專案可定位為：

> A simplified digital banking / ATM system built with .NET 8, React, SQL Server, Redis, Kafka, Docker, and AWS.

可展示能力包括：

- RESTful API design
- Service-based backend architecture
- Frontend / backend integration
- Authentication / authorization
- Cache strategy with Redis
- Event-driven architecture with Kafka
- Containerization
- Cloud deployment

## 11. Delivery Principles

- 不同階段應可獨立驗證
- 不為導入 pattern 而過度設計
- 優先確保功能與架構可持續擴充
- 每一階段完成後應更新文件與測試基線

## 12. Next Recommended Step

若以目前狀態延續，建議下一步為以下二選一：

### Option A

進入 React Frontend 規劃與頁面設計階段

### Option B

先完成 Backend Stabilization 之剩餘項目，例如：

- success response format 統一
- 測試基線擴充
- 文件索引整理

綜合專案完整度與展示效果，建議優先順序仍為：

`React Frontend -> JWT Login -> Redis -> Kafka -> Docker -> AWS`
