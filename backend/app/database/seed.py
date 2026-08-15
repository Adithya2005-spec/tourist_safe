"""
Database Seeder for Smart Tourist Safety & Incident Response Prototype
Seeds realistic demo users, risk zones, active incidents, and blockchain audit logs.
"""

from datetime import datetime, timedelta
from backend.app.database.connection import engine, SessionLocal, Base
from backend.app.models.users import User
from backend.app.models.tourists import Tourist
from backend.app.models.risk_zones import RiskZone
from backend.app.models.incidents import Incident
from backend.app.models.incident_status_history import IncidentStatusHistory
from backend.app.models.blockchain_audits import BlockchainAudit
from backend.app.models.emergency_contacts import EmergencyContact
from backend.app.models.notifications import Notification
from backend.app.auth.security import get_password_hash
from backend.app.services.blockchain_service import generate_canonical_incident_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing demo data if any
    try:
        db.query(BlockchainAudit).delete()
        db.query(IncidentStatusHistory).delete()
        db.query(Incident).delete()
        db.query(Notification).delete()
        db.query(EmergencyContact).delete()
        db.query(RiskZone).delete()
        db.query(Tourist).delete()
        db.query(User).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[WARN] Error resetting tables: {e}")

    print("[INFO] Seeding users and tourists...")
    # 1. Authority / Dispatch User
    authority_user = User(
        email="authority@safety.gov.in",
        username="authority",
        hashed_password=get_password_hash("authority123"),
        full_name="Bangalore Central Emergency Dispatch",
        phone_number="+91 80 2294 2222",
        role="AUTHORITY"
    )
    db.add(authority_user)

    # 2. Tourist User (Demo Tourist)
    tourist_user = User(
        email="tourist@example.com",
        username="tourist",
        hashed_password=get_password_hash("tourist123"),
        full_name="Mahalasa Rao",
        phone_number="+91 98765 43210",
        role="TOURIST"
    )
    db.add(tourist_user)
    db.commit()

    # Tourist Profile
    tourist_profile = Tourist(
        user_id=tourist_user.id,
        tourist_code="TOURIST-1024",
        nationality="Indian",
        verification_status="VERIFIED",
        credential_status="ACTIVE",
        did_identifier="did:sih:tourist-1024:aadhaar-verified",
        last_latitude=12.9716, # Cubbon Park / Bangalore Center
        last_longitude=77.5946,
        last_risk_score=18.5,
        last_risk_level="LOW",
        last_location_updated_at=datetime.utcnow()
    )
    db.add(tourist_profile)
    db.commit()

    # Emergency Contacts for Tourist
    c1 = EmergencyContact(
        tourist_id=tourist_profile.id,
        name="Sunil Rao",
        phone="+91 98800 11223",
        relationship="Parent / Family",
        is_primary=1
    )
    c2 = EmergencyContact(
        tourist_id=tourist_profile.id,
        name="Dr. Ananya Sharma",
        phone="+91 98450 99887",
        relationship="Emergency Physician",
        is_primary=0
    )
    db.add_all([c1, c2])

    print("[INFO] Seeding dynamic risk zones...")
    # 3. Risk Zones (Bengaluru Hub as Reference Coordinates)
    # Zone 1: Safe Zone (Cubbon Park)
    z1 = RiskZone(
        name="Cubbon Park Heritage Area (Safe Zone)",
        latitude=12.9763,
        longitude=77.5929,
        radius=900.0, # 900m
        risk_score=14.0,
        risk_level="LOW",
        description="Heavy tourist surveillance, well-lit park trails, round-the-clock tourist police kiosk.",
        active=True
    )
    # Zone 2: Moderate Risk (MG Road Metro Junction)
    z2 = RiskZone(
        name="MG Road High Density Transit Hub",
        latitude=12.9756,
        longitude=77.6066,
        radius=750.0,
        risk_score=38.5,
        risk_level="MODERATE",
        description="High crowd congestion, minor pickpocketing alerts, heavy vehicular cross traffic.",
        active=True
    )
    # Zone 3: High Risk (Commercial Street Alleys)
    z3 = RiskZone(
        name="Commercial Street Narrow Alleyways",
        latitude=12.9822,
        longitude=77.6083,
        radius=650.0,
        risk_score=68.4,
        risk_level="HIGH",
        description="Poor illumination past 20:00, isolated bottlenecks, elevated incident reports in last 48 hours.",
        active=True
    )
    # Zone 4: Critical Risk (Shivajinagar Construction Trench / Storm Canal)
    z4 = RiskZone(
        name="Shivajinagar Stormwater Canal Zone",
        latitude=12.9860,
        longitude=77.6015,
        radius=500.0,
        risk_score=88.2,
        risk_level="CRITICAL",
        description="Open civil construction hazards, active flash-flood hazard warning, restricted pedestrian entry.",
        active=True
    )
    db.add_all([z1, z2, z3, z4])
    db.commit()

    print("[INFO] Seeding sample incident and blockchain audit trail...")
    # 4. Seeded Active Incident
    incident_time = datetime.utcnow() - timedelta(minutes=25)
    sample_incident = Incident(
        incident_code="INC-1024",
        tourist_id=tourist_profile.id,
        incident_type="SOS",
        severity="CRITICAL",
        description="Tourist triggered emergency distress beacon near high-risk boundary.",
        latitude=12.9820,
        longitude=77.6080,
        current_status="RESPONDING",
        assigned_responder="Officer K. Sharma (Unit 4 - Alpha)",
        assigned_responder_contact="+91 80 2221 0000",
        estimated_arrival_minutes=4,
        created_at=incident_time,
        updated_at=datetime.utcnow() - timedelta(minutes=5)
    )
    db.add(sample_incident)
    db.commit()

    # Incident History entries
    h1 = IncidentStatusHistory(
        incident_id=sample_incident.id,
        status="NEW",
        comment="Distress signal received via mobile SOS trigger",
        changed_by="TOURIST",
        created_at=incident_time
    )
    h2 = IncidentStatusHistory(
        incident_id=sample_incident.id,
        status="VERIFIED",
        comment="Operator verified GPS telemetry and camera feed",
        changed_by="AUTHORITY",
        created_at=incident_time + timedelta(minutes=3)
    )
    h3 = IncidentStatusHistory(
        incident_id=sample_incident.id,
        status="ASSIGNED",
        comment="Dispatched Unit 4 - Alpha (Officer K. Sharma)",
        changed_by="AUTHORITY",
        created_at=incident_time + timedelta(minutes=6)
    )
    h4 = IncidentStatusHistory(
        incident_id=sample_incident.id,
        status="RESPONDING",
        comment="Unit 4 is en route. ETA: 4 minutes",
        changed_by="AUTHORITY",
        created_at=incident_time + timedelta(minutes=10)
    )
    db.add_all([h1, h2, h3, h4])

    # Blockchain Audit Record
    inc_hash = generate_canonical_incident_hash(
        incident_code=sample_incident.incident_code,
        incident_type=sample_incident.incident_type,
        severity=sample_incident.severity,
        latitude=sample_incident.latitude,
        longitude=sample_incident.longitude,
        created_at_str=incident_time.isoformat()
    )
    audit = BlockchainAudit(
        incident_id=sample_incident.id,
        incident_code=sample_incident.incident_code,
        incident_hash=inc_hash,
        transaction_hash="0x9f83b2a75d31481e7d23a41bc978d10b719468e2ef84a1d48c081c70e0a5c4e9",
        block_number=18492041,
        contract_address="0x5FbDB2315678afecb367f032d93F642f64180aa3",
        audit_status="VERIFIED",
        verified_at=incident_time + timedelta(minutes=1)
    )
    db.add(audit)

    # Notifications
    n1 = Notification(
        tourist_id=tourist_profile.id,
        title="🚨 SOS Broadcast Dispatched",
        message="Incident INC-1024 logged. Unit 4 - Alpha dispatched to your coordinates.",
        type="SOS_CONFIRMATION",
        priority="URGENT",
        is_read=False,
        created_at=incident_time
    )
    n2 = Notification(
        tourist_id=tourist_profile.id,
        title="🚑 Responder Dispatched",
        message="Officer K. Sharma is en route. ETA: 4 mins. Stay in your current location.",
        type="INCIDENT_UPDATE",
        priority="HIGH",
        is_read=False,
        created_at=incident_time + timedelta(minutes=10)
    )
    db.add_all([n1, n2])

    db.commit()
    db.close()
    print("[SUCCESS] Database seeded successfully with demo accounts and data!")

if __name__ == "__main__":
    seed_database()
