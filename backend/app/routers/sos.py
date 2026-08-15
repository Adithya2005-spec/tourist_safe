from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.models.users import User
from backend.app.models.tourists import Tourist
from backend.app.models.blockchain_audits import BlockchainAudit
from backend.app.models.incident_status_history import IncidentStatusHistory
from backend.app.schemas.incident import SOSCreate, IncidentOut
from backend.app.auth.deps import get_current_user
from backend.app.services.incident_service import create_incident_record
from backend.app.services.notification_service import create_notification

router = APIRouter(prefix="/sos", tags=["SOS Emergency"])

@router.post("", response_model=IncidentOut, status_code=status.HTTP_201_CREATED)
async def trigger_sos(
    payload: SOSCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")

    # Update tourist last location
    tourist.last_latitude = payload.latitude
    tourist.last_longitude = payload.longitude
    if payload.current_risk_score:
        tourist.last_risk_score = payload.current_risk_score
    if payload.current_risk_level:
        tourist.last_risk_level = payload.current_risk_level
    db.commit()

    # Create SOS incident record
    incident = await create_incident_record(
        db=db,
        tourist_id=tourist.id,
        incident_type="SOS",
        severity="CRITICAL",
        latitude=payload.latitude,
        longitude=payload.longitude,
        description=payload.note or "Emergency SOS Triggered by Tourist"
    )

    # Check for primary emergency contact
    from backend.app.models.emergency_contacts import EmergencyContact
    primary_contact = db.query(EmergencyContact).filter(
        EmergencyContact.tourist_id == tourist.id,
        EmergencyContact.is_primary == 1
    ).first()
    if not primary_contact:
        # Fallback to any first contact
        primary_contact = db.query(EmergencyContact).filter(
            EmergencyContact.tourist_id == tourist.id
        ).first()

    contact_msg = f" Primary contact ({primary_contact.name}: {primary_contact.phone}) alerted." if primary_contact else " (No emergency contact configured)."

    # Push SOS confirmation notification to tourist
    await create_notification(
        db=db,
        tourist_id=tourist.id,
        title="🚨 SOS Broadcast Dispatched",
        message=f"SOS {incident.incident_code} received. Emergency response units have been notified.{contact_msg}",
        type="SOS_CONFIRMATION",
        priority="URGENT"
    )

    audit = db.query(BlockchainAudit).filter(BlockchainAudit.incident_id == incident.id).first()
    history = db.query(IncidentStatusHistory).filter(IncidentStatusHistory.incident_id == incident.id).all()

    return {
        "id": incident.id,
        "incident_code": incident.incident_code,
        "tourist_id": incident.tourist_id,
        "incident_type": incident.incident_type,
        "severity": incident.severity,
        "description": incident.description,
        "latitude": incident.latitude,
        "longitude": incident.longitude,
        "current_status": incident.current_status,
        "assigned_responder": incident.assigned_responder,
        "assigned_responder_contact": incident.assigned_responder_contact,
        "estimated_arrival_minutes": incident.estimated_arrival_minutes,
        "resolution_notes": incident.resolution_notes,
        "created_at": incident.created_at,
        "updated_at": incident.updated_at,
        "status_history": history,
        "blockchain_verified": True if audit else False,
        "transaction_hash": audit.transaction_hash if audit else None,
        "incident_hash": audit.incident_hash if audit else None
    }
