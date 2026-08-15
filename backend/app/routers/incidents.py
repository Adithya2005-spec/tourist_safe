from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.database.connection import get_db
from backend.app.models.users import User
from backend.app.models.tourists import Tourist
from backend.app.models.incidents import Incident
from backend.app.models.incident_status_history import IncidentStatusHistory
from backend.app.models.blockchain_audits import BlockchainAudit
from backend.app.schemas.incident import IncidentCreate, IncidentStatusUpdate, IncidentOut
from backend.app.auth.deps import get_current_user
from backend.app.services.incident_service import create_incident_record, update_incident_lifecycle

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.post("", response_model=IncidentOut, status_code=status.HTTP_201_CREATED)
async def report_incident(
    payload: IncidentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")

    incident = await create_incident_record(
        db=db,
        tourist_id=tourist.id,
        incident_type=payload.incident_type,
        severity=payload.severity,
        latitude=payload.latitude,
        longitude=payload.longitude,
        description=payload.description,
        offline_created_at=payload.offline_created_at
    )
    
    # Retrieve audit
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

@router.get("", response_model=List[IncidentOut])
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(Incident).order_by(Incident.created_at.desc()).all()
    results = []
    for inc in incidents:
        audit = db.query(BlockchainAudit).filter(BlockchainAudit.incident_id == inc.id).first()
        history = db.query(IncidentStatusHistory).filter(IncidentStatusHistory.incident_id == inc.id).all()
        results.append({
            "id": inc.id,
            "incident_code": inc.incident_code,
            "tourist_id": inc.tourist_id,
            "incident_type": inc.incident_type,
            "severity": inc.severity,
            "description": inc.description,
            "latitude": inc.latitude,
            "longitude": inc.longitude,
            "current_status": inc.current_status,
            "assigned_responder": inc.assigned_responder,
            "assigned_responder_contact": inc.assigned_responder_contact,
            "estimated_arrival_minutes": inc.estimated_arrival_minutes,
            "resolution_notes": inc.resolution_notes,
            "created_at": inc.created_at,
            "updated_at": inc.updated_at,
            "status_history": history,
            "blockchain_verified": True if audit else False,
            "transaction_hash": audit.transaction_hash if audit else None,
            "incident_hash": audit.incident_hash if audit else None
        })
    return results

@router.get("/{incident_id}", response_model=IncidentOut)
def get_incident_by_id(incident_id: int, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    audit = db.query(BlockchainAudit).filter(BlockchainAudit.incident_id == inc.id).first()
    history = db.query(IncidentStatusHistory).filter(IncidentStatusHistory.incident_id == inc.id).all()
    return {
        "id": inc.id,
        "incident_code": inc.incident_code,
        "tourist_id": inc.tourist_id,
        "incident_type": inc.incident_type,
        "severity": inc.severity,
        "description": inc.description,
        "latitude": inc.latitude,
        "longitude": inc.longitude,
        "current_status": inc.current_status,
        "assigned_responder": inc.assigned_responder,
        "assigned_responder_contact": inc.assigned_responder_contact,
        "estimated_arrival_minutes": inc.estimated_arrival_minutes,
        "resolution_notes": inc.resolution_notes,
        "created_at": inc.created_at,
        "updated_at": inc.updated_at,
        "status_history": history,
        "blockchain_verified": True if audit else False,
        "transaction_hash": audit.transaction_hash if audit else None,
        "incident_hash": audit.incident_hash if audit else None
    }

@router.patch("/{incident_id}/status", response_model=IncidentOut)
async def update_status(
    incident_id: int,
    payload: IncidentStatusUpdate,
    db: Session = Depends(get_db)
):
    try:
        inc = await update_incident_lifecycle(
            db=db,
            incident_id=incident_id,
            new_status=payload.status,
            changed_by="AUTHORITY",
            comment=payload.comment,
            assigned_responder=payload.assigned_responder,
            assigned_responder_contact=payload.assigned_responder_contact,
            estimated_arrival_minutes=payload.estimated_arrival_minutes,
            resolution_notes=payload.resolution_notes
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
        
    audit = db.query(BlockchainAudit).filter(BlockchainAudit.incident_id == inc.id).first()
    history = db.query(IncidentStatusHistory).filter(IncidentStatusHistory.incident_id == inc.id).all()
    return {
        "id": inc.id,
        "incident_code": inc.incident_code,
        "tourist_id": inc.tourist_id,
        "incident_type": inc.incident_type,
        "severity": inc.severity,
        "description": inc.description,
        "latitude": inc.latitude,
        "longitude": inc.longitude,
        "current_status": inc.current_status,
        "assigned_responder": inc.assigned_responder,
        "assigned_responder_contact": inc.assigned_responder_contact,
        "estimated_arrival_minutes": inc.estimated_arrival_minutes,
        "resolution_notes": inc.resolution_notes,
        "created_at": inc.created_at,
        "updated_at": inc.updated_at,
        "status_history": history,
        "blockchain_verified": True if audit else False,
        "transaction_hash": audit.transaction_hash if audit else None,
        "incident_hash": audit.incident_hash if audit else None
    }
