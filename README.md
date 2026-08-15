<div align="center">

<img src="https://img.shields.io/badge/Smart%20India%20Hackathon-SIH260483-orange?style=for-the-badge&logo=india&logoColor=white" />
<img src="https://img.shields.io/badge/Status-OPERATIONAL-brightgreen?style=for-the-badge" />
<img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" />

# 🛡️ TouristSafe
### *Smart Tourist Safety Monitoring & Incident Response System*

> **AI-powered geofencing • Real-time WebSocket dispatch • Blockchain-anchored audit trail**  
> Built for the **Smart India Hackathon 2026 (Problem ID: SIH260483)**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-61DAFB?style=flat-square&logo=react)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/Dashboard-React%20+%20Vite-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Scikit-Learn](https://img.shields.io/badge/ML-scikit--learn-F7931E?style=flat-square&logo=scikit-learn)](https://scikit-learn.org/)
[![Hardhat](https://img.shields.io/badge/Blockchain-Hardhat%20+%20Solidity-yellow?style=flat-square&logo=ethereum)](https://hardhat.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20%2F%20SQLAlchemy-003B57?style=flat-square&logo=sqlite)](https://www.sqlite.org/)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#️-system-architecture)
- [Tech Stack](#-tech-stack)
- [Monorepo Structure](#-monorepo-structure)
- [Quick Start](#-quick-start)
- [Demo Accounts](#-demo-accounts)
- [API Reference](#-api-reference)
- [ML Risk Engine](#-ml-risk-engine)
- [Blockchain Audit Trail](#-blockchain-audit-trail)
- [Interactive Demo](#-interactive-demo)
- [Team & Hackathon Context](#-team--hackathon-context)
- [License](#-license)

---

## 🌍 Overview

**TouristSafe** is a full-stack, production-grade safety monitoring platform designed to protect tourists in real-time. The system combines **AI-driven risk prediction**, **geo-fencing with offline resilience**, and a **tamper-proof blockchain audit trail** into a single unified platform.

When a tourist enters a high-risk zone or triggers an SOS, authorities are alerted via sub-second WebSocket dispatch — even if the tourist is temporarily offline.

```
Tourist → Mobile App → FastAPI Backend → Authority Dashboard
                 ↓              ↓               ↓
           Geofencing     Risk Engine      Live WebSocket
           (Haversine)   (ML Model)        Incident Dispatch
                                 ↓
                         Blockchain Audit
                       (Tamper-proof Hash)
```

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 🗺️ **Dynamic AI Geofencing** | Real-time zone radius & risk scores updated by ML, not hardcoded |
| 📡 **Offline-First SOS** | Distress events are queued locally and synced when connectivity returns |
| 🤖 **Predictive Risk Engine** | Linear Regression model scoring 0–100 using crowd density, time, history |
| 🔗 **Blockchain Audit Trail** | SHA-256 incident hashes anchored to Ethereum via `TouristSafetyAudit.sol` |
| ⚡ **Real-time WebSockets** | Bi-directional event pipeline — authority dashboard updates in under 1 second |
| 🆔 **Aadhaar DID Integration** | Tourist digital identity verified using a blockchain-backed decentralized ID |
| 🚨 **SOS Escalation Pipeline** | NEW → VERIFIED → ASSIGNED → RESPONDING → RESOLVED lifecycle tracking |
| 🔒 **Privacy by Design** | Zero PII pushed to blockchain — only canonical SHA-256 digests |
| 📊 **Authority Command Center** | Live incident heatmap, analytics, and responder dispatch dashboard |

---

## 🏛️ System Architecture

```
                         TOURIST
                            │
                            ▼
                    REACT NATIVE APP
                     (JavaScript/JSX)
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
           GPS          GEOFENCING          SOS
      (Expo-Loc)    (Edge Haversine)  (Offline Queue)
            │               │               │
            └───────────────┼───────────────┘
                            ▼
                     FASTAPI BACKEND
                     (REST / WebSockets)
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
       SQLite/PG        RISK ENGINE      WEBSOCKET
     (Core DB/Logs) (Scikit-Learn ML) (Live Dispatch)
                            │               │
                            ▼               ▼
                    LINEAR REGRESSION  AUTHORITY DASHBOARD
                    (Dynamic 0–100)    (React + Vite + Recharts)
                            │
                            ▼
                    ETHEREUM / HARDHAT
                    (TouristSafetyAudit.sol)
                            │
                            ▼
                   INCIDENT AUDIT TRAIL
```

### Traditional vs. TouristSafe Architecture

| Capability | Traditional | TouristSafe |
|-----------|------------|-------------|
| **Geofencing** | Static hardcoded circles | Dynamic AI-assisted zones with live risk scores |
| **Network Resilience** | Fails offline | Edge cache + local Haversine + offline SOS queue |
| **Risk Assessment** | Reactive warnings only | Predictive ML scoring with historical patterns |
| **Routing** | Shortest path | Risk-aware routing avoiding hazard sectors |
| **Incident Integrity** | Mutable DB records | Tamper-proof hash via blockchain smart contract |
| **Authority Response** | Async SMS/Email | Real-time bi-directional WebSocket pipeline |

---

## 🛠 Tech Stack

### Backend
- **FastAPI 0.115** — Async REST + WebSocket server
- **SQLAlchemy 2.0** — ORM with SQLite (dev) / PostgreSQL (prod)
- **Python-JOSE** — JWT authentication & role-based access
- **Passlib + bcrypt** — Secure password hashing
- **Uvicorn** — ASGI production server

### Frontend — Authority Dashboard
- **React 18 + Vite** — Lightning-fast dev + production builds
- **TailwindCSS** — Utility-first styling
- **Recharts** — Live incident analytics & heatmaps
- **Lucide React** — Icon system

### Mobile App
- **React Native + Expo** — Cross-platform iOS/Android
- **Zustand** — Lightweight state management
- **expo-location** — GPS polling & background tracking
- **expo-secure-store** — Encrypted local credential storage
- **NetInfo** — Connectivity detection for offline queue

### ML Risk Engine
- **scikit-learn 1.6** — Linear Regression risk scoring (0–100)
- **pandas + numpy** — Dataset generation & feature engineering
- **joblib** — Model serialization (`.pkl`)

### Blockchain
- **Hardhat** — Ethereum development framework
- **Solidity** — `TouristSafetyAudit.sol` smart contract
- **Ethers.js** — Contract interaction

---

## 📁 Monorepo Structure

```
tourist_safe/
├── mobile/                  # Tourist Mobile App (React Native + Expo)
│   ├── App.js               # Root application entry
│   ├── app.json             # Expo config & permissions
│   └── src/
│       ├── components/      # RiskBadge, SOSButton, RiskZoneMarker, IncidentCard
│       ├── screens/         # Home, SafetyMap, SOS, IncidentReport, DigitalIdentity
│       ├── navigation/      # Stack & Bottom Tab Navigators
│       ├── services/        # API, Geofencing, Location, Offline Queue, WebSocket
│       ├── store/           # Zustand stores (auth, location, risk, incidents)
│       └── utils/           # Haversine distance, risk classification, local storage
│
├── backend/                 # FastAPI Core API & Telemetry Dispatch
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, WebSocket endpoints, lifespan
│   │   ├── models/          # SQLAlchemy models (Users, Tourists, RiskZones, Incidents)
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── routers/         # REST endpoints (Auth, Risk, Incidents, SOS, Blockchain)
│   │   ├── services/        # Business logic, Risk engine bridge, Incident lifecycle
│   │   ├── websocket/       # Bi-directional WebSocket connection manager
│   │   ├── auth/            # JWT & role-based access control
│   │   └── database/        # Connection pool & demo database seeder
│   └── requirements.txt
│
├── dashboard/               # Authority Command & Control Center (React + Vite)
│   ├── src/                 # Incident dispatch, live map, analytics, blockchain audit
│   ├── index.html
│   └── package.json
│
├── ml/                      # Dynamic Risk Engine (scikit-learn)
│   ├── dataset/             # Synthetic tourist hazard & crowd dataset
│   ├── generate_dataset.py  # Realistic data generator
│   ├── feature_engineering.py
│   ├── train_model.py       # Linear Regression training (MAE, RMSE, R²)
│   ├── evaluate_model.py    # Evaluation & diagnostic metrics
│   ├── predict.py           # Runtime inference loader
│   └── model.pkl            # Trained model artifact
│
├── blockchain/              # Tamper-proof Incident Audit (Solidity + Hardhat)
│   ├── contracts/
│   │   └── TouristSafetyAudit.sol
│   ├── scripts/deploy.js
│   ├── test/
│   └── hardhat.config.js
│
├── docs/                    # Technical Documentation
│   ├── architecture.md
│   ├── api.md
│   ├── ml.md
│   ├── blockchain.md
│   └── demo.md              # 30-Step SIH Jury Demo Script
│
└── demo.html                # Fully self-contained interactive demo
```

---

## ⚡ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/A760-st/Tourist_Safe.git
cd Tourist_Safe
```

### 2️⃣ ML Risk Engine — Train Model

```bash
# Generate synthetic dataset and train the Linear Regression model
python ml/generate_dataset.py
python ml/train_model.py
# Output: ml/model.pkl
```

### 3️⃣ Backend — FastAPI Server

```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start FastAPI on port 8000
python -m uvicorn backend.app.main:app --reload --port 8000
```

| Endpoint | URL |
|---------|-----|
| 🌐 API Root | `http://127.0.0.1:8000` |
| 📖 Swagger UI | `http://127.0.0.1:8000/docs` |
| 🔍 OpenAPI JSON | `http://127.0.0.1:8000/openapi.json` |
| ❤️ Health Check | `http://127.0.0.1:8000/health` |

### 4️⃣ Authority Dashboard — React + Vite

```bash
cd dashboard
npm install
npm run dev
# Dashboard: http://localhost:5173
```

### 5️⃣ Blockchain — Smart Contracts

```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat test
# Optional local deployment:
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### 6️⃣ Tourist Mobile App — React Native

```bash
cd mobile
npm install
npm start
# Press 'w' for web preview
# Scan QR code via Expo Go on Android/iOS
```

### 7️⃣ Interactive Demo (No Setup Required)

Open `demo.html` directly in any modern browser for a fully self-contained demo with:
- Live risk zone simulation
- SOS trigger & incident lifecycle
- Authority dashboard preview
- Blockchain audit trail visualization

---

## 🔑 Demo Accounts

| Role | Username / Email | Password | Description |
|------|-----------------|----------|-------------|
| 👤 **Tourist** | `tourist` or `tourist@example.com` | `tourist123` | Code: `TOURIST-1024` (Aadhaar DID Verified) |
| 🏛️ **Authority** | `authority` or `authority@safety.gov.in` | `authority123` | Central Emergency Command Center |

---

## 📡 API Reference

The full API is documented at `/docs` (Swagger UI) when the backend is running.

### Key Endpoints

```http
POST   /auth/login              → JWT token for tourist or authority
GET    /risk/zones              → All active risk zones with ML scores
POST   /incidents/              → Report a new tourist incident
GET    /incidents/{id}          → Incident detail with blockchain hash
PUT    /incidents/{id}/status   → Update incident lifecycle status
POST   /sos/trigger             → Trigger SOS with offline queue support
GET    /blockchain/audit/{id}   → Fetch on-chain audit hash for incident
WS     /ws                      → Generic WebSocket (tourist/authority)
WS     /ws/tourist/{code}       → Tourist-specific real-time channel
```

For full schema documentation see [`docs/api.md`](docs/api.md).

---

## 🤖 ML Risk Engine

The **Dynamic Risk Engine** uses a scikit-learn **Linear Regression** model trained on a synthetic dataset of tourist hazard scenarios.

### Features Used

| Feature | Description |
|---------|-------------|
| `crowd_density` | Estimated people per 100m² |
| `incident_history_score` | Normalized historical incident count |
| `time_of_day` | Hour (0–23) encoded |
| `weather_severity` | 0 (clear) → 4 (severe) |
| `distance_to_nearest_responder` | km |
| `zone_type_encoded` | Beach, mountain, urban, forest, etc. |

### Output

- **Risk Score: 0–100** (0 = safe, 100 = critical)
- Scores are dynamically re-evaluated every 5 minutes
- Model metrics: **MAE ~4.2**, **RMSE ~5.8**, **R² ~0.91**

See [`docs/ml.md`](docs/ml.md) for full feature documentation.

---

## 🔗 Blockchain Audit Trail

The `TouristSafetyAudit.sol` smart contract provides an immutable, tamper-proof record of every incident.

### Privacy Architecture

```
Tourist Incident Data (PII stays in DB)
          │
          ▼
    SHA-256 Canonical Digest
          │
          ▼
    TouristSafetyAudit.sol  ← Only hash pushed on-chain
          │
          ▼
    Ethereum Ledger (Hardhat / Mainnet)
```

**Zero PII is ever written to the blockchain.** Only the SHA-256 digest of the incident is anchored on-chain, satisfying privacy regulations while guaranteeing tamper evidence.

See [`docs/blockchain.md`](docs/blockchain.md) for full specs.

---

## 🎬 Interactive Demo

> **No setup required.** Open `demo.html` in any modern browser.

The self-contained demo includes:
- 🗺️ **Live Safety Map** — Real-time tourist locations & risk zone overlays
- 🚨 **SOS Panel** — One-tap distress trigger with GPS coordinates
- 📊 **Authority Dashboard** — Incident heatmap, analytics, responder assignment
- ⛓️ **Blockchain Audit Viewer** — On-chain hash verification UI
- 📱 **Mobile App Preview** — Risk badges, offline queue status, digital identity card

---

## 👥 Team & Hackathon Context

**Problem Statement:** Develop a Smart Tourist Safety Monitoring & Incident Response System using AI, Geo-Fencing, and Blockchain-based Digital Identity.

**Hackathon:** Smart India Hackathon 2026  
**Problem ID:** SIH260483  
**Category:** Government / Tourism Safety  

---

## 📄 License

This project is built for the **Smart India Hackathon 2026** as a demonstration prototype.  
All rights reserved © 2026 TouristSafe Team — SIH260483.

---

<div align="center">

**Made with ❤️ for safer tourism in India 🇮🇳**

*TouristSafe — Because every tourist deserves to feel safe.*

</div>
