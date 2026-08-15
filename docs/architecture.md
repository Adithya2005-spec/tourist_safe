# System Architecture & Technical Specifications
**Smart India Hackathon (SIH260483)**  
*Smart Tourist Safety Monitoring & Incident Response System using AI, Geo-Fencing, and Blockchain-based Digital Identity*

---

## 1. High-Level Architectural Topology

```
                         TOURIST
                            │
                            ▼
                    REACT NATIVE APP
                     (JavaScript/JSX)
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
           GPS         GEOFENCING          SOS
      (Expo-Loc)    (Edge Haversine)  (Offline Queue)
            │               │               │
            └───────────────┼───────────────┘
                            ▼
                     FASTAPI BACKEND
                     (REST / WebSockets)
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
       PostgreSQL      RISK ENGINE      WEBSOCKET
     (Core DB/Logs) (Scikit-Learn ML) (Live Dispatch)
                            │               │
                            ▼               ▼
                    LINEAR REGRESSION  AUTHORITY DASHBOARD
                    (Dynamic 0-100)    (React + Vite + Recharts)
                            │
                            ▼
                    ETHEREUM / HARDHAT
                    (TouristSafetyAudit.sol)
                            │
                            ▼
                   INCIDENT AUDIT TRAIL
```

---

## 2. Differentiators: Traditional vs. Our Architecture

| Capability | Traditional Tourism Safety | Our SIH260483 Architecture |
| :--- | :--- | :--- |
| **Geofencing** | Static circular boundaries hardcoded in apps | Dynamic AI-assisted geofences updating real-time radius and risk scores |
| **Network Resilience** | Completely crashes/fails when offline | Edge-assisted offline cache, local Haversine calculations & indexed queue |
| **Risk Assessment** | Reactive (warnings only after incident reports) | Predictive Linear Regression factoring crowd density, time, historical data |
| **Routing** | Shortest path via standard map providers | Risk-aware safer routing avoiding critical hazard sectors |
| **Incident Integrity** | Modifiable database records | Tamper-proof hash anchoring via `TouristSafetyAudit.sol` smart contract |
| **Authority Response** | Asynchronous email/SMS dispatches | Real-time bi-directional WebSocket event pipeline with sub-second sync |

---

## 3. Edge-Cloud Synergy & Privacy by Design

### Edge Layer (Mobile Device)
- **Local Cache:** Stores active risk zones and offline incidents via AsyncStorage/SQLite.
- **Local Computation:** Real-time distance evaluation using the spherical Haversine formula.
- **Local SOS Dispatch:** Queues distress events with timestamp and coordinates when disconnected.

### Cloud Layer (FastAPI + PostgreSQL + Blockchain)
- **Central Authority:** Dispatches responders, updates incident statuses (`NEW` -> `VERIFIED` -> `ASSIGNED` -> `RESPONDING` -> `RESOLVED`).
- **Privacy Engine:** **Zero tourist PII is submitted to the blockchain.** The smart contract only accepts the SHA-256 canonical incident digest.
