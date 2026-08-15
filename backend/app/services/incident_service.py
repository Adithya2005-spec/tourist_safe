from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session

from backend.app.models.incidents import Incident
from backend.app.models.incident_status_history import IncidentStatusHistory
from backend.app.models.tourists import Tourist
from backend.app.services.blockchain_service import generate_canonical_incident_hash, record_blockchain_audit
from backend.app.websocket.manager import ws_manager

VALID_STATUSES = ["NEW", "VERIFIED", "ASSIGNED", "RESPONDING", "RESOLVED"]

async def create_incident_record(
    db: Session,
    tourist_id: int,
    incident_type: str,
    severity: str,
    latitude: float,
    longitude: float,
    description: Optional[str] = None,
    offline_created_at: Optional[datetime] = None
) -> Incident:
    # Generate unique incident code
    count = db.query(Incident).count() + 1024
    incident_code = f"INC-{count}"
    created_time = offline_created_at or datetime.utcnow()

    incident = Incident(
        incident_code=incident_code,
        tourist_id=tourist_id,
        incident_type=incident_type,
        severity=severity,
        description=description,
        latitude=latitude,
        longitude=longitude,
        current_status="NEW",
        created_at=created_time,
        updated_at=created_time
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)

    # Add initial status history
    history = IncidentStatusHistory(
        incident_id=incident.id,
        status="NEW",
        comment="Incident registered in system",
        changed_by="TOURIST",
        created_at=created_time
    )
    db.add(history)
    db.commit()

    # Generate canonical hash & blockchain audit
    incident_hash = generate_canonical_incident_hash(
        incident_code=incident_code,
        incident_type=incident_type,
        severity=severity,
        latitude=latitude,
        longitude=longitude,
        created_at_str=created_time.isoformat()
    )
    record_blockchain_audit(db, incident.id, incident_code, incident_hash)

    # Broadcast to Authority Dashboard via WebSocket
    payload = {
        "id": incident.id,
        "incident_code": incident.incident_code,
        "tourist_id": incident.tourist_id,
        "incident_type": incident.incident_type,
        "severity": incident.severity,
        "description": incident.description,
        "latitude": incident.latitude,
        "longitude": incident.longitude,
        "current_status": incident.current_status,
        "created_at": incident.created_at.isoformat(),
        "blockchain_hash": incident_hash
    }
    await ws_manager.broadcast_to_authorities("NEW_INCIDENT", payload)

    return incident

async def update_incident_lifecycle(
    db: Session,
    incident_id: int,
    new_status: str,
    changed_by: str = "AUTHORITY",
    comment: Optional[str] = None,
    assigned_responder: Optional[str] = None,
    assigned_responder_contact: Optional[str] = None,
    estimated_arrival_minutes: Optional[int] = None,
    resolution_notes: Optional[str] = None
) -> Incident:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise ValueError(f"Incident {incident_id} not found")

    incident.current_status = new_status
    incident.updated_at = datetime.utcnow()
    
    if assigned_responder:
        incident.assigned_responder = assigned_responder
    if assigned_responder_contact:
        incident.assigned_responder_contact = assigned_responder_contact
    if estimated_arrival_minutes is not None:
        incident.estimated_arrival_minutes = estimated_arrival_minutes
    if resolution_notes:
        incident.resolution_notes = resolution_notes

    db.add(incident)

    # Add history log
    history = IncidentStatusHistory(
        incident_id=incident.id,
        status=new_status,
        comment=comment or f"Status updated to {new_status}",
        changed_by=changed_by,
        created_at=datetime.utcnow()
    )
    db.add(history)
    db.commit()
    db.refresh(incident)

    # Broadcast updates to authority dashboard AND tourist mobile app
    payload = {
        "id": incident.id,
        "incident_code": incident.incident_code,
        "tourist_id": incident.tourist_id,
        "status": incident.current_status,
        "assigned_responder": incident.assigned_responder,
        "estimated_arrival_minutes": incident.estimated_arrival_minutes,
        "updated_at": incident.updated_at.isoformat(),
        "comment": comment
    }
    await ws_manager.broadcast_to_authorities("INCIDENT_STATUS_UPDATED", payload)
    await ws_manager.send_to_tourist(incident.tourist_id, "INCIDENT_STATUS_UPDATED", payload)

    return incident
