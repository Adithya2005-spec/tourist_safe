# Blockchain-Based Incident Audit Architecture
**Smart Contract & Cryptographic Integrity Specifications**  
*SIH260483 - Smart Tourist Safety System*

---

## 1. Zero-Knowledge & Privacy-by-Design Principles

Public/consortium blockchain ledgers are inherently immutable and accessible to participating network nodes. Therefore:

> [!CAUTION]
> **STRICT PRIVACY POLICY:** Under NO circumstances are tourist personal names, phone numbers, email addresses, biometric identifiers, or continuous raw GPS tracks committed to the blockchain.

Only **canonical SHA-256 digests** of verified safety incidents are written on-chain.

```
┌──────────────────────────────────────┐
│  Canonical Incident Object in Cloud  │
│  - incident_code: "INC-1024"         │
│  - incident_type: "SOS"              │
│  - severity: "CRITICAL"              │
│  - latitude: 12.9820                 │
│  - longitude: 77.6080                │
│  - timestamp: 2026-08-14T20:15:00Z   │
└──────────────────┬───────────────────┘
                   │
                   ▼ SHA-256
      0x9f83b2a75d31481e7d23a41bc...
                   │
                   ▼ Web3 Call
┌──────────────────────────────────────┐
│       TouristSafetyAudit.sol         │
│  registerIncident(incidentId, hash)  │
│  updateIncidentStatus(id, status)    │
└──────────────────────────────────────┘
```

---

## 2. Smart Contract Methods (`TouristSafetyAudit.sol`)

- `registerIncident(string incidentId, bytes32 incidentHash)`: Records initial timestamp and cryptographic digest.
- `updateIncidentStatus(string incidentId, string status)`: Appends verifiable lifecycle state transitions (`VERIFIED` -> `ASSIGNED` -> `RESPONDING` -> `RESOLVED`).
- `getIncident(string incidentId)`: Fetches verified on-chain record and existence proof.
- `getIncidentHistory(string incidentId)`: Fetches chronological audit history of all status changes.

---

## 3. Asynchronous & Resilient Architecture
Emergency response and SOS broadcasting take top priority. If the blockchain network experiences network latency or node downtime:
1. Mobile SOS is dispatched immediately.
2. PostgreSQL records the incident in milliseconds.
3. Authorities are alerted in real time via WebSockets.
4. The blockchain transaction is queued and confirmed in the background without blocking life-safety workflows.
