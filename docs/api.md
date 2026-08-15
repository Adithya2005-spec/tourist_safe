# API Documentation (FastAPI OpenAPI Specification)
**Base URL:** `http://127.0.0.1:8000`  
**Swagger UI:** `http://127.0.0.1:8000/docs`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new user profile and automatic tourist profile record.
- **Request Body:**
  ```json
  {
    "email": "tourist@example.com",
    "username": "tourist",
    "password": "tourist123",
    "full_name": "Mahalasa Rao",
    "phone_number": "+91 98765 43210",
    "role": "TOURIST",
    "nationality": "Indian"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "bearer",
    "user_id": 2,
    "username": "tourist",
    "role": "TOURIST",
    "tourist_code": "TOURIST-1024"
  }
  ```

### `POST /auth/login`
Authenticates tourist or authority personnel.
- **Request Body:**
  ```json
  {
    "username_or_email": "tourist",
    "password": "tourist123"
  }
  ```

---

## 2. Tourist Profile & Location Telemetry

### `GET /tourists/me`
Retrieves authenticated tourist's details, digital ID, verification status, and emergency contacts.

### `POST /locations`
Updates current GPS coordinates and performs geofence boundary checks.
- **Request Body:**
  ```json
  {
    "latitude": 12.9822,
    "longitude": 77.6083,
    "accuracy": 4.5,
    "speed": 1.2,
    "heading": 180.0
  }
  ```

---

## 3. Dynamic Risk Engine

### `GET /risk-zones`
Returns list of all active geofenced risk zones with risk scores and radii.

### `POST /risk/predict`
Calculates dynamic risk score using the trained Linear Regression model.
- **Request Body:**
  ```json
  {
    "incident_count": 10,
    "recent_incidents": 4,
    "high_severity_incidents": 2,
    "moderate_severity_incidents": 3,
    "tourist_density": 60,
    "time_of_day": 21,
    "historical_risk": 55,
    "distance_to_incident": 0.8,
    "response_time": 12
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "risk_score": 68.4,
    "risk_level": "HIGH",
    "is_simulated": false,
    "contributing_factors": {
      "incident_count_weight": 1.5,
      "recent_incidents_weight": 4.8,
      "high_severity_weight": 3.6,
      "tourist_density_weight": 7.2,
      "historical_baseline_weight": 15.4,
      "emergency_response_weight": 4.2
    }
  }
  ```

---

## 4. Incidents & Emergency SOS

### `POST /sos`
Dispatches urgent emergency incident and triggers authority broadcast.
- **Request Body:**
  ```json
  {
    "latitude": 12.9822,
    "longitude": 77.6083,
    "current_risk_score": 68.4,
    "current_risk_level": "HIGH",
    "note": "Emergency SOS Triggered by Tourist"
  }
  ```

### `POST /incidents`
Reports categorized incidents (Medical, Unsafe Area, Suspicious Activity, etc.).

### `PATCH /incidents/{id}/status`
Transitions incident lifecycle: `NEW` -> `VERIFIED` -> `ASSIGNED` -> `RESPONDING` -> `RESOLVED`.

---

## 5. Blockchain Audit Trail

### `GET /blockchain/{incidentId}`
Retrieves immutable cryptographic hash verification and smart contract transaction status.
