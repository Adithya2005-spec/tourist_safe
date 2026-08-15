import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database.seed import seed_database

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    seed_database()

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPERATIONAL"
    assert data["hackathon"] == "Smart India Hackathon (SIH260483)"

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_risk_zones():
    response = client.get("/risk-zones")
    assert response.status_code == 200
    zones = response.json()
    assert len(zones) >= 4

def test_risk_prediction():
    payload = {
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
    response = client.post("/risk/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "risk_level" in data
    assert data["risk_score"] >= 0.0

def test_auth_login_and_profile():
    login_resp = client.post("/auth/login", json={
        "username_or_email": "tourist",
        "password": "tourist123"
    })
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    token = token_data["access_token"]
    assert token is not None

    headers = {"Authorization": f"Bearer {token}"}
    profile_resp = client.get("/tourists/me", headers=headers)
    assert profile_resp.status_code == 200
    profile = profile_resp.json()
    assert profile["tourist_code"] == "TOURIST-1024"
    assert profile["verification_status"] == "VERIFIED"

def test_incidents_list():
    response = client.get("/incidents")
    assert response.status_code == 200
    incidents = response.json()
    assert len(incidents) >= 1
    assert incidents[0]["incident_code"] == "INC-1024"
    assert incidents[0]["blockchain_verified"] is True
