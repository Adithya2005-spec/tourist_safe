<div align="center">

# 🛡️ RakshaSetu

### *Smart Tourist Safety & Incident Response Platform*

[![SIH 2026](https://img.shields.io/badge/SIH-2026-blue?style=for-the-badge&logo=india)](https://www.sih.gov.in)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Blockchain](https://img.shields.io/badge/Blockchain-Audit%20Trail-orange?style=for-the-badge)](https://ethereum.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **RakshaSetu** bridges the gap between tourist safety and emergency response across India — powered by AI risk prediction, Aadhaar-backed Digital Identity (DID), Pan-India geofencing, and immutable blockchain audit trails.

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Dashboard Modules](#-dashboard-modules)
- [Pan-India Coverage](#-pan-india-coverage)
- [Tourist Registry](#-tourist-registry)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Team](#-team)

---

## 🌍 Overview

**RakshaSetu** (रक्षासेतु / ರಕ್ಷಾಸೇತು) is a full-stack, real-time tourist safety command platform built for **Smart India Hackathon 2026**. It enables authorities to monitor tourists across all Indian states, detect geofence breaches, predict risk via ML regression, and manage the full emergency response lifecycle — all immutably recorded on a blockchain audit trail.

The platform supports **three languages** (English, Hindi, Kannada) and operates across **12 Pan-India monitoring hubs** spanning Kashmir to Kerala and Rajasthan to Meghalaya.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🗺️ **Pan-India Live Geo-Fence Map** | Real-time radar with region selector (North / West / South / East-NE) and live GPS drift simulation |
| 🤖 **Dynamic AI Risk Engine** | ML regression model (R² = 0.9658) scoring risk from crowd density, crime rate, lighting, rainfall, and patrol coverage |
| 🆔 **Aadhaar DID Registry** | Privacy-preserving decentralized digital identity for each tourist, verified on-chain |
| 🚨 **Incident Lifecycle Manager** | Full dispatch workflow: NEW → VERIFIED → ASSIGNED → RESPONDING → RESOLVED with blockchain hash sealing |
| ⛓️ **Blockchain Audit Trail** | Tamper-proof smart contract (TouristSafetyAudit.sol) recording every incident state transition |
| 📞 **Emergency Contact Manager** | Primary/secondary contact management with push broadcast to all monitored nodes |
| 📱 **Tourist Mobile App Simulator** | Interactive prototype of the tourist-facing RakshaSetu mobile application |
| 🌐 **Multi-Language Support** | English, हिन्दी, ಕನ್ನಡ — switchable at runtime |

---

## 🔗 Live Demo

| Interface | URL |
|---|---|
| 📊 **Command Dashboard** (React + Vite) | `http://localhost:5173/` |
| 📱 **Tourist App Demo** (HTML Prototype) | `http://localhost:3000/demo.html` |
| ⚡ **Backend API Docs** | `http://localhost:8000/docs` |
| **Final Project with Dashboard + Backend**| 'https://rakshasetu-dashboard.onrender.com/'|'https://rakshasetu-backend-cb1s.onrender.com/'|
---

## 🛠️ Tech Stack

### Frontend — Command Dashboard
- **React 18** + **Vite 6** — fast HMR development
- **Tailwind CSS** — utility-first styling with glassmorphism design
- **Lucide React** — premium icon system
- **Custom CSS** — animated radar, pulse rings, gradient panels

### Frontend — Tourist Mobile Prototype  
- **Standalone HTML** (`demo.html`) — zero-dependency, fully interactive
- **CSS Animations** — geofence alerts, SOS pulse, risk transitions
- **Vanilla JS** — Pan-India location simulator, profile switcher

### Backend
- **Python 3.11** + **FastAPI** — async REST API
- **SQLite** (dev) / **PostgreSQL** (prod) — tourist & incident storage
- **Pydantic v2** — strict schema validation
- **JWT Auth** — authority session tokens

### Blockchain Layer
- **Solidity** (TouristSafetyAudit.sol) — immutable incident audit contract
- **Ethers.js** — wallet integration layer
- **SHA-256** — deterministic incident hash generation

### Mobile App (React Native)
- **Expo** + **React Native** — iOS & Android
- **i18n** — `en.json`, `hi.json`, `kn.json` locale files
- **Expo Location** — GPS telemetry

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     RakshaSetu Platform                 │
├────────────────┬────────────────┬───────────────────────┤
│  Tourist App   │  Authority     │  Backend API          │
│  (React Native)│  Dashboard     │  (FastAPI + Python)   │
│  Expo + i18n   │  (React+Vite)  │                       │
└───────┬────────┴───────┬────────┴──────────┬────────────┘
        │                │                   │
        ▼                ▼                   ▼
┌───────────────┐ ┌─────────────┐  ┌───────────────────┐
│  Aadhaar DID  │ │  Geofence   │  │  PostgreSQL / SQLite│
│  Verify Layer │ │  ML Engine  │  │  Incident Store    │
└───────────────┘ └─────────────┘  └───────────────────┘
        │                │
        └────────┬────────┘
                 ▼
        ┌─────────────────┐
        │  Blockchain      │
        │  Audit Trail     │
        │  (Solidity)      │
        └─────────────────┘
```

---

## 📊 Dashboard Modules

### 1. 🌐 Overview & Telemetry
Live KPI cards: active incidents, geo-fence count, tourists monitored (1,024+), and average response time (3.8 min vs 5.0 min SLA). Shows the top 3 incident feed with inline dispatch actions.

### 2. 🗺️ Pan-India Live Geo-Fence Map
- **Region Selector** — filter by National / North / West / South / East-NE sectors
- **Live GPS Drift Toggle** — simulates real-time tourist movement across monitored hubs
- **Risk Zone Rings** — color-coded circles (Emerald = Safe, Amber = Moderate, Orange = High, Red = Critical)
- **Tourist Pins** — clickable pins with hover cards showing name, state origin, location, risk score

### 3. 🚨 Incident Lifecycle
Full table with severity badges, status workflow buttons (Verify / Assign Unit / Dispatch / Resolve), and blockchain hash display on resolution.

### 4. 🤖 Dynamic AI Risk Engine
Interactive sliders for: Crowd Density, Historical Crime Rate, Street Lighting Score, Time of Day, Police Patrols. ML regression computes live risk score (0–100) with R² = 0.9658.

### 5. 👥 Monitored Tourists
Pan-India grid with region filter. Each card shows: name, state origin, nationality, DID, current location, battery, risk classification, emergency contact, GPS coordinates.

### 6. ⛓️ Blockchain Audit Trail
Smart contract explorer showing all incident hashes, wallet addresses, and tamper-proof records.

### 7. 📞 Emergency Contacts
Add/edit/remove emergency contacts with primary flag and push broadcast to all monitored tourists.

### 8. 📱 Tourist Mobile App Simulator
Embedded interactive prototype of the tourist-facing app: SOS button, safety map, incident tracker, profile page.

---

## 🇮🇳 Pan-India Coverage

| Hub | State | Risk Level |
|---|---|---|
| Dal Lake Corridor | Jammu & Kashmir | 🟢 Monitored Safe |
| Rohtang Glacier Pass | Himachal Pradesh | 🔴 Alpine Critical |
| Amer Fort Ramparts | Rajasthan | 🟢 Heritage Safe |
| Thar Remote Dunes | Rajasthan | 🔴 Desert High |
| Baga Beach Coastal Strip | Goa | 🔴 High Tide Risk |
| Marine Drive Boulevard | Maharashtra | 🟡 Moderate |
| Munnar Gap Road | Kerala | 🔴 Landslide Zone |
| Cubbon Park Hub | Karnataka | 🟢 Safe Corridor |
| Dashashwamedh Ghat | Uttar Pradesh | 🔴 Crowd Surge |
| Cherrapunji Root Bridges | Meghalaya | 🟡 Eco Moderate |

---

## 👤 Tourist Registry (Sample)

| Name | State | Tourist Code | Status |
|---|---|---|---|
| Aarav Sharma | Delhi / NCR | TR-DEL-901 | Safe |
| Pooja Deshmukh | Maharashtra | TR-MAH-771 | Safe |
| Mahalasa Rao | Karnataka | TR-KAR-102 | Safe |
| Subhashree Sen | West Bengal | TR-WB-442 | Safe |
| Tenzin Norbu | Ladakh | TR-LAD-883 | Monitoring |
| Ananya Nambiar | Kerala | TR-KER-331 | Monitoring |
| Vikramaditya Rathore | Rajasthan | TR-RAJ-554 | **SOS ACTIVE** |
| Zoya Qureshi | Jammu & Kashmir | TR-JNK-220 | Safe |
| Bikash Debbarma | Tripura | TR-TRI-667 | Safe |
| Rohan Singhania | Gujarat | TR-GUJ-388 | Monitoring |
| Sophie Martin | France 🇫🇷 | TR-INT-FRA | Safe |
| David Miller | Australia 🇦🇺 | TR-INT-AUS | Safe |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.11
- npm / pip

### 1. Clone the Repository
```bash
git clone https://github.com/Adithya2005-spec/tourist_safe.git
cd tourist_safe
```

### 2. Start the Command Dashboard
```bash
cd dashboard
npm install
npm run dev
# → http://localhost:5173
```

### 3. Start the Tourist Demo Prototype
```bash
# From root directory
python -m http.server 3000
# → http://localhost:3000/demo.html
```

### 4. Start the Backend API
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000/docs
```

### 5. Mobile App (React Native)
```bash
cd mobile
npm install
npx expo start
```

---

## 📁 Project Structure

```
tourist_safe/
├── dashboard/              # React + Vite Command Dashboard
│   ├── src/
│   │   ├── App.jsx         # Main dashboard (8 tabs, Pan-India data)
│   │   ├── index.css       # Glassmorphism styles
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── backend/                # FastAPI REST Backend
│   ├── app/
│   │   ├── main.py         # API routes & FastAPI app
│   │   ├── models.py       # Pydantic schemas
│   │   └── database.py     # SQLite / PostgreSQL
│   └── requirements.txt
│
├── mobile/                 # React Native Tourist App
│   ├── src/
│   │   ├── screens/        # Home, Map, SOS, Profile, Settings
│   │   └── i18n/           # en.json, hi.json, kn.json
│   └── app.json
│
├── blockchain/             # Solidity Smart Contracts
│   └── TouristSafetyAudit.sol
│
├── demo.html               # Standalone Tourist App HTML Prototype
└── README.md
```

---

## 👨‍💻 Team

**RakshaSetu** — Built for **Smart India Hackathon 2026**

| Role | Contribution |
|---|---|
| Full-Stack Development | React Dashboard, FastAPI, Pan-India data models |
| Blockchain Integration | Solidity audit contract, SHA-256 hashing |
| ML Risk Engine | Regression model (R² = 0.9658), feature engineering |
| Mobile App | React Native, Expo, multi-language i18n |
| UI/UX Design | Glassmorphism dashboard, animated radar map |

---

<div align="center">

**🛡️ RakshaSetu — रक्षासेतु — ರಕ್ಷಾಸೇತು**

*Protecting Every Journey. Connecting Every Emergency.*

[![GitHub](https://img.shields.io/badge/GitHub-Adithya2005--spec-black?style=for-the-badge&logo=github)](https://github.com/Adithya2005-spec/tourist_safe)

</div>
