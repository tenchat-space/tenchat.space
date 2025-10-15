# Tenchat System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Tenchat Platform                            │
│                     (Next-Gen Social & Crypto Messaging)                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Frontend Application                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Web    │  │  Mobile  │  │ Desktop  │  │   PWA    │  │   CLI    │ │
│  │  React   │  │ React    │  │ Electron │  │  (PWA)   │  │  Tools   │ │
│  │  + Vite  │  │  Native  │  │  (TBD)   │  │          │  │          │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          API & Services Layer                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Appwrite Backend                             │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │  │
│  │  │ Auth   │ │Database│ │Storage │ │Function│ │Realtime│         │  │
│  │  │Service │ │Service │ │Service │ │Service │ │Service │         │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   Custom Services Layer                           │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │  │
│  │  │Crypto  │ │ NFT    │ │Message │ │ Story  │ │ Filter │         │  │
│  │  │Service │ │Service │ │Queue   │ │Worker  │ │Service │         │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Database Layer                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Main   │  │  Social  │  │   Web3   │  │ Content  │  │Analytics │ │
│  │ Database │  │ Database │  │ Database │  │ Database │  │ Database │ │
│  │  (7 col) │  │  (6 col) │  │  (7 col) │  │  (7 col) │  │  (4 col) │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Storage Layer                                   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│  │Avatar│ │Story│ │Post│ │Voice│ │Video│ │NFT  │ │Stick│ │Filter│     │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       External Integrations                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │Blockchain│  │   IPFS   │  │  Giphy/  │  │  Push    │  │Analytics │ │
│  │   RPCs   │  │ Storage  │  │  Tenor   │  │  Notif   │  │ Services │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          5 Specialized Databases                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐
│     MainDatabase        │  ← Core messaging & users
│  ┌──────────────────┐   │
│  │ profiles         │   │  User identity
│  │ conversations    │   │  Chat rooms
│  │ messages         │   │  All messages
│  │ messageQueue     │   │  Delivery system
│  │ contacts         │   │  Connections
│  │ typingIndicators │   │  Real-time typing
│  │ presence         │   │  Online status
│  └──────────────────┘   │
└─────────────────────────┘

┌─────────────────────────┐
│    SocialDatabase       │  ← Social features
│  ┌──────────────────┐   │
│  │ stories          │   │  24h content
│  │ storyViews       │   │  Engagement
│  │ posts            │   │  Permanent posts
│  │ postReactions    │   │  Likes/emojis
│  │ comments         │   │  Post comments
│  │ follows          │   │  Social graph
│  └──────────────────┘   │
└─────────────────────────┘

┌─────────────────────────┐
│     Web3Database        │  ← Blockchain integration
│  ┌──────────────────┐   │
│  │ wallets          │   │  Crypto wallets
│  │ nfts             │   │  NFT collection
│  │ cryptoTx         │   │  Transactions
│  │ tokenGifts       │   │  Crypto gifting
│  │ contractHooks    │   │  Smart contracts
│  │ tokenHoldings    │   │  Balances
│  └──────────────────┘   │
└─────────────────────────┘

┌─────────────────────────┐
│   ContentDatabase       │  ← Rich media
│  ┌──────────────────┐   │
│  │ stickers         │   │  Sticker library
│  │ stickerPacks     │   │  Sticker sets
│  │ userStickers     │   │  User collection
│  │ gifs             │   │  GIF library
│  │ polls            │   │  Interactive polls
│  │ arFilters        │   │  AR effects
│  │ mediaLibrary     │   │  User uploads
│  └──────────────────┘   │
└─────────────────────────┘

┌─────────────────────────┐
│  AnalyticsDatabase      │  ← Metrics & logs
│  ┌──────────────────┐   │
│  │ userActivity     │   │  Engagement
│  │ notifications    │   │  Push notifs
│  │ appAnalytics     │   │  System metrics
│  │ errorLogs        │   │  Error tracking
│  └──────────────────┘   │
└─────────────────────────┘
```

---

## 🔄 Data Flow Examples

### Message Flow

```
User A                   Frontend                Backend                  User B
  │                         │                       │                       │
  ├─1. Type message────────►│                       │                       │
  │                         │                       │                       │
  │                         ├─2. Encrypt───────────►│                       │
  │                         │    (E2E)              │                       │
  │                         │                       │                       │
  │                         ├─3. Save to DB────────►│                       │
  │                         │    (messages)         │                       │
  │                         │                       │                       │
  │                         │                       ├─4. Add to queue──────►│
  │                         │                       │    (messageQueue)     │
  │                         │                       │                       │
  │                         │                       ├─5. Real-time push────►│
  │                         │                       │    (websocket)        │
  │                         │                       │                       │
  │                         │                       │◄─6. Receive & decrypt─┤
  │                         │                       │                       │
  │                         │                       ├─7. Update delivered───┤
  │                         │                       │                       │
  │                         │◄─8. Receipt confirmed─┤                       │
  │◄─9. Show delivered──────┤                       │                       │
  │                         │                       │                       │
```

### Crypto Gift Flow

```
Sender                  Frontend              Backend            Blockchain         Recipient
  │                        │                     │                    │                 │
  ├─1. Select gift────────►│                     │                    │                 │
  │                        │                     │                    │                 │
  │                        ├─2. Create gift─────►│                    │                 │
  │                        │    record           │                    │                 │
  │                        │                     │                    │                 │
  │                        ├─3. Sign tx─────────►│                    │                 │
  │                        │    (wallet)         │                    │                 │
  │                        │                     │                    │                 │
  │                        │                     ├─4. Submit tx──────►│                 │
  │                        │                     │                    │                 │
  │                        │                     │◄─5. Tx hash────────┤                 │
  │                        │                     │                    │                 │
  │                        │◄─6. Create msg──────┤                    │                 │
  │                        │    with animation   │                    │                 │
  │                        │                     │                    │                 │
  │                        │                     │◄───6. Confirmed────┤                 │
  │                        │                     │                    │                 │
  │                        │                     ├─7. Notify──────────┴────────────────►│
  │                        │                     │    recipient                          │
  │                        │                     │                                       │
  │◄─8. Show confirmed─────┤◄─9. Update status───┤                                       │
  │                        │                     │                                       │
```

### Story Publishing Flow

```
Creator                Frontend              Backend              Storage           Followers
  │                       │                     │                    │                 │
  ├─1. Capture media─────►│                     │                    │                 │
  │                       │                     │                    │                 │
  │                       ├─2. Apply filters───►│                    │                 │
  │                       │    (AR effects)     │                    │                 │
  │                       │                     │                    │                 │
  │                       ├─3. Upload media────►├─4. Save to bucket─►│                 │
  │                       │                     │                    │                 │
  │                       │                     │◄─5. URL returned───┤                 │
  │                       │                     │                    │                 │
  │                       ├─6. Create story────►│                    │                 │
  │                       │    (24h expiry)     │                    │                 │
  │                       │                     │                    │                 │
  │                       │                     ├─7. Notify followers────────────────►│
  │                       │                     │    (push notif)                      │
  │                       │                     │                                      │
  │◄─8. Published─────────┤◄─9. Confirmation────┤                                      │
  │                       │                     │                                      │
  │                       │                     │                                      │
  └─ After 24h ───────────┴──── Auto-delete ────┴───────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Security Layers                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: Authentication                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Email   │  │  Phone   │  │  Wallet  │  │  Social  │       │
│  │   OTP    │  │   OTP    │  │ Signature│  │  OAuth   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                         ↓                                        │
│                    JWT Tokens                                    │
│                  (1 year duration)                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Layer 2: Authorization                                           │
│  • Document-level permissions (profiles)                         │
│  • Collection-level permissions                                  │
│  • Role-based access (admin, moderator, user)                    │
│  • Owner-only access for sensitive data                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Layer 3: Encryption                                              │
│  • E2E encryption for messages (AES-256-GCM)                     │
│  • Encrypted storage (at rest)                                   │
│  • TLS/HTTPS (in transit)                                        │
│  • Key rotation support                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Layer 4: Privacy Controls                                        │
│  • Granular privacy settings per user                            │
│  • Read receipt control                                          │
│  • Online status hiding                                          │
│  • Blocked user management                                       │
│  • Anonymous mode                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Layer 5: Audit & Monitoring                                      │
│  • IP tracking in audit logs                                     │
│  • Error logging with severity levels                            │
│  • User activity tracking                                        │
│  • Security event monitoring                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Scalability Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                  Horizontal Scaling Plan                         │
└─────────────────────────────────────────────────────────────────┘

Phase 1: Single Instance (0-10K users)
┌──────────────────┐
│  Appwrite Cloud  │  All databases on one instance
└──────────────────┘

Phase 2: Database Separation (10K-100K users)
┌──────────────────┐  ┌──────────────────┐
│  Main + Social   │  │  Web3 + Content  │  Split by database
└──────────────────┘  └──────────────────┘

Phase 3: Read Replicas (100K-1M users)
┌──────────────────┐  ┌──────────────────┐
│   Write Master   │  │   Read Replica   │  Scale reads
└──────────────────┘  └──────────────────┘
         │                      │
         └──────────┬───────────┘
                    ▼
            ┌──────────────┐
            │ Read Replica │
            └──────────────┘

Phase 4: Sharding (1M-10M users)
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Shard 1         │  │  Shard 2         │  │  Shard 3         │
│  (users A-G)     │  │  (users H-O)     │  │  (users P-Z)     │
└──────────────────┘  └──────────────────┘  └──────────────────┘

Phase 5: Multi-Region (10M+ users)
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   US Region      │  │   EU Region      │  │   Asia Region    │
│   (Primary)      │  │   (Replica)      │  │   (Replica)      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 🔮 Future Architecture (Decentralized)

```
┌─────────────────────────────────────────────────────────────────┐
│               Hybrid Web2/Web3 Architecture                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐                          ┌──────────────────┐
│  Web2 Backend    │                          │  Web3 Backend    │
│  (Appwrite)      │                          │  (Smart Contracts│
│                  │                          │   + IPFS)        │
│  • Fast reads    │                          │                  │
│  • Real-time     │ ◄────────────────────► │  • Censorship    │
│  • Reliability   │      Sync & Fallback    │    resistant     │
│  • Privacy       │                          │  • User-owned    │
│                  │                          │  • Transparent   │
└──────────────────┘                          └──────────────────┘
         │                                              │
         │                                              │
         ├──────────────────┬───────────────────────────┤
         │                  │                           │
         ▼                  ▼                           ▼
┌──────────────┐   ┌──────────────┐          ┌──────────────┐
│   Messages   │   │  User Prefs  │          │  Governance  │
│  (Encrypted) │   │   (Private)  │          │    (DAO)     │
│   Web2 Only  │   │    Hybrid    │          │  Web3 Only   │
└──────────────┘   └──────────────┘          └──────────────┘
```

---

## 📊 Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         Tech Stack                               │
└─────────────────────────────────────────────────────────────────┘

Frontend
├── React 18 (UI library)
├── TypeScript (Type safety)
├── Vite (Build tool)
├── TanStack Query (Data fetching)
├── Zustand (State management)
├── Tailwind CSS (Styling)
├── Radix UI (Components)
├── Framer Motion (Animations)
└── Viem (Web3 interactions)

Backend (Appwrite)
├── MariaDB (Database engine)
├── Redis (Caching & real-time)
├── MinIO (Object storage)
├── InfluxDB (Time-series analytics)
└── Node.js (Functions runtime)

Blockchain
├── Ethereum (Primary chain)
├── Polygon (Low-cost txs)
├── Solana (Fast & cheap)
├── Base (Coinbase L2)
├── Arbitrum (Ethereum L2)
├── Optimism (Ethereum L2)
├── BSC (Binance chain)
└── Avalanche (Fast finality)

External Services
├── Giphy/Tenor (GIFs)
├── Infura/Alchemy (RPC)
├── The Graph (Indexing)
├── IPFS (Decentralized storage)
├── Push Protocol (Notifications)
└── Mixpanel/Amplitude (Analytics)
```

---

## 🎯 Performance Metrics

```
┌─────────────────────────────────────────────────────────────────┐
│                    Target Performance                            │
└─────────────────────────────────────────────────────────────────┘

Messaging
├── Message send latency:     < 100ms
├── Message delivery:          < 500ms
├── Typing indicator latency:  < 50ms
├── Read receipt latency:      < 200ms
└── Group message fanout:      < 2s (200K members)

Stories
├── Story upload:              < 3s
├── Story view load:           < 500ms
├── Story feed load:           < 1s
└── Auto-expiry cleanup:       Every 1h

Web3
├── Wallet connect:            < 2s
├── NFT metadata fetch:        < 1s
├── Transaction submission:    < 5s
└── Balance sync:              Every 5 min

Real-time
├── Online presence update:    < 1s
├── New message notification:  < 500ms
├── Story notification:        < 2s
└── WebSocket reconnect:       < 5s

Database
├── Profile read:              < 50ms
├── Conversation list:         < 100ms
├── Message history (50):      < 200ms
└── Search query:              < 500ms
```

---

**Architecture designed to scale from 0 to billions. Built for Web3. Ready for the future.** 🚀
