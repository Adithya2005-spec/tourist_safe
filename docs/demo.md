# SIH Demonstration & Presentation Playbook
**Step-by-Step Jury Demonstration Script**  
*Problem Statement SIH260483*

---

## 30-Step End-to-End Demonstration Walkthrough

| Step | Action | Expected System Behavior & UI Feedback |
| :--- | :--- | :--- |
| **1** | Open Mobile App | High-fidelity dark theme splash screen loads with verified DID badge. |
| **2** | Login as Tourist | Authenticates via JWT token (`tourist` / `tourist123`). |
| **3** | Home Screen Safety HUD | Displays Current Safety Status: `LOW RISK (18.5/100)`, Online status badge. |
| **4** | Open Safety Map | Interactive map renders current location + circular color-coded risk zones. |
| **5** | GPS Telemetry | Current coordinates (`12.9716, 77.5946`) and accuracy display. |
| **6** | Risk Zones Overview | Green (Cubbon Park), Yellow (MG Road), Orange (Commercial St), Red (Shivajinagar). |
| **7** | Enable Demo Controller | Floating Demo Mode HUD opens with scenario triggers. |
| **8** | Select `HIGH RISK` | Teleports simulated location into Commercial Street high-risk perimeter. |
| **9** | Risk Engine Triggers | Linear Regression evaluates high severity + night time factors -> Risk = `68.4 / HIGH`. |
| **10** | Geofence Alert | Dynamic banner pops up: `⚠️ High-Risk Zone Alert - You have entered Commercial Street`. |
| **11** | System Notification | Notification center receives high-priority warning. |
| **12** | Tap `Find Safer Route` | Navigation module evaluates safety hazard vs distance. |
| **13** | Safer Route Comparison | Displays: Fastest (2.1 km, HIGH RISK) vs Recommended Safer Route (2.6 km, LOW RISK). |
| **14** | Toggle `NETWORK OFF` | Mobile app enters edge-assisted offline mode (`OFFLINE` indicator). |
| **15** | Trigger SOS Button | Large emergency SOS button is pressed with haptic confirmation. |
| **16** | Offline Queueing | SOS cannot reach server; stored locally in AsyncStorage as `PENDING_SYNC`. |
| **17** | Mobile Feedback | Screen shows `🚨 SOS STORED LOCALLY (PENDING SYNC)`. |
| **18** | Restore `NETWORK ON` | NetInfo detects online connectivity; auto-sync worker fires instantly. |
| **19** | Background Sync | Local pending queue transitions to `SYNCED`. |
| **20** | Backend Ingestion | FastAPI receives payload at `POST /sos`, assigns code `INC-1024`. |
| **21** | PostgreSQL Storage | Core database persists incident record, location snapshot, and status log. |
| **22** | Blockchain Hash | Backend computes canonical SHA-256 hash and logs to `TouristSafetyAudit.sol`. |
| **23** | Authority Live Map | Authority Dashboard immediately beeps and plots `INC-1024` via WebSocket (zero refresh). |
| **24** | Operator Verification | Authority clicks `[ Verify ]` -> Status becomes `VERIFIED`. |
| **25** | Dispatch Unit | Authority assigns `Unit 4 - Alpha (Officer K. Sharma, ETA: 4 mins)`. |
| **26** | Status: `RESPONDING` | Incident state moves to `RESPONDING`. |
| **27** | Tourist Real-Time Sync | Tourist mobile app receives WebSocket push: timeline advances to `RESPONDING`. |
| **28** | Authority Resolves | Operator clicks `[ Resolve ]` with resolution notes. |
| **29** | Final State | Incident status marked `RESOLVED`, safety status returns to normal. |
| **30** | Blockchain Audit Page | Authority and Tourist view verified on-chain audit proof, transaction hash, and timestamp. |
