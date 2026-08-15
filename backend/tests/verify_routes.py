import sys
import os

# Ensure project root in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.database.connection import SessionLocal, engine, Base
from backend.app.database.seed import seed_database
from backend.app.models.users import User
from backend.app.models.tourists import Tourist
from backend.app.models.risk_zones import RiskZone
from backend.app.models.incidents import Incident
from backend.app.services.risk_service import compute_dynamic_risk
from backend.app.services.location_service import calculate_haversine_distance, check_geofences
from backend.app.services.blockchain_service import generate_canonical_incident_hash
from backend.app.auth.security import get_password_hash, verify_password, create_access_token

def run_checks():
    print("[1/6] Initializing database & running seeder...")
    Base.metadata.create_all(bind=engine)
    seed_database()
    db = SessionLocal()

    print("[2/6] Verifying user & tourist models...")
    user = db.query(User).filter(User.username == "tourist").first()
    assert user is not None, "Tourist user missing"
    assert verify_password("tourist123", user.hashed_password), "Password hash verification failed"
    token = create_access_token({"sub": user.username, "role": user.role})
    assert len(token) > 20, "JWT creation failed"

    tourist = db.query(Tourist).filter(Tourist.user_id == user.id).first()
    assert tourist is not None, "Tourist profile missing"
    assert tourist.tourist_code == "TOURIST-1024", f"Unexpected code {tourist.tourist_code}"

    print("[3/6] Verifying dynamic risk zones & Geofencing math...")
    zones = db.query(RiskZone).filter(RiskZone.active == True).all()
    assert len(zones) >= 4, f"Expected 4 zones, got {len(zones)}"
    
    # Distance between Cubbon park and MG Road (should be ~1.5km)
    dist = calculate_haversine_distance(12.9763, 77.5929, 12.9756, 77.6066)
    assert 1200 < dist < 1800, f"Unexpected Haversine distance {dist}"

    # Geofence breach check
    breaches = check_geofences(db, 12.9822, 77.6083) # Commercial Street coords
    assert len(breaches) > 0, "Expected breach at Commercial Street coords"

    print("[4/6] Verifying Linear Regression risk engine inference...")
    features = {
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
    score, level, factors = compute_dynamic_risk(features)
    assert 0 <= score <= 100, f"Score {score} out of range"
    assert level in ["LOW", "MODERATE", "HIGH", "CRITICAL"], f"Invalid level {level}"
    print(f"       -> Dynamic Risk Result: Score = {score}, Level = {level}")

    print("[5/6] Verifying Incident record & Canonical Blockchain hashing...")
    incident = db.query(Incident).filter(Incident.incident_code == "INC-1024").first()
    assert incident is not None, "Incident INC-1024 missing"
    inc_hash = generate_canonical_incident_hash(
        incident_code=incident.incident_code,
        incident_type=incident.incident_type,
        severity=incident.severity,
        latitude=incident.latitude,
        longitude=incident.longitude,
        created_at_str=incident.created_at.isoformat()
    )
    assert inc_hash.startswith("0x") and len(inc_hash) == 66, f"Invalid hash: {inc_hash}"
    print(f"       -> Canonical SHA-256 Digest: {inc_hash}")

    db.close()
    print("[6/6] All backend, ML, geofence, and database checks PASSED successfully!")

if __name__ == "__main__":
    run_checks()
