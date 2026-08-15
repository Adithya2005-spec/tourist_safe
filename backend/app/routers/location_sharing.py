from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional

from backend.app.database.connection import get_db
from backend.app.models.users import User
from backend.app.models.tourists import Tourist
from backend.app.models.emergency_contacts import EmergencyContact
from backend.app.models.location_sharing import LocationShareSession
from backend.app.schemas.location_sharing import (
    LocationShareStartRequest,
    LocationShareUpdateRequest,
    LocationShareStopRequest,
    LocationShareSessionOut,
    PublicLocationShareView
)
from backend.app.auth.deps import get_current_user
from backend.app.websocket.manager import ws_manager

router = APIRouter(prefix="/location-sharing", tags=["Live Location Sharing"])

@router.post("/start", response_model=LocationShareSessionOut)
async def start_location_sharing(
    payload: LocationShareStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")

    # Deactivate any previous active sessions for this tourist
    db.query(LocationShareSession).filter(
        LocationShareSession.tourist_id == tourist.id,
        LocationShareSession.active == 1
    ).update({"active": 0})

    # Validate or fetch emergency contact
    contact_name = None
    if payload.emergency_contact_id:
        contact = db.query(EmergencyContact).filter(
            EmergencyContact.id == payload.emergency_contact_id,
            EmergencyContact.tourist_id == tourist.id
        ).first()
        if not contact:
            raise HTTPException(status_code=400, detail="Specified emergency contact not found")
        contact_name = contact.name
    else:
        # Check primary contact
        primary_contact = db.query(EmergencyContact).filter(
            EmergencyContact.tourist_id == tourist.id,
            EmergencyContact.is_primary == 1
        ).first()
        if primary_contact:
            payload.emergency_contact_id = primary_contact.id
            contact_name = primary_contact.name

    now = datetime.utcnow()
    duration_mins = payload.duration_minutes or 30
    expires_at = now + timedelta(minutes=duration_mins)

    session = LocationShareSession(
        tourist_id=tourist.id,
        emergency_contact_id=payload.emergency_contact_id,
        started_at=now,
        expires_at=expires_at,
        active=1,
        last_latitude=payload.latitude if payload.latitude is not None else tourist.last_latitude,
        last_longitude=payload.longitude if payload.longitude is not None else tourist.last_longitude,
        last_updated_at=now
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Broadcast location sharing event via websocket to authority dashboard
    await ws_manager.broadcast_dashboard({
        "event_type": "LOCATION_SHARE_STARTED",
        "share_id": session.id,
        "tourist_code": tourist.tourist_code,
        "tourist_name": current_user.full_name,
        "contact_name": contact_name,
        "duration_minutes": duration_mins,
        "expires_at": expires_at.isoformat(),
        "latitude": session.last_latitude,
        "longitude": session.last_longitude
    })

    remaining_secs = int((expires_at - now).total_seconds())

    return {
        "id": session.id,
        "tourist_id": session.tourist_id,
        "emergency_contact_id": session.emergency_contact_id,
        "emergency_contact_name": contact_name,
        "started_at": session.started_at,
        "expires_at": session.expires_at,
        "active": session.active,
        "last_latitude": session.last_latitude,
        "last_longitude": session.last_longitude,
        "last_updated_at": session.last_updated_at,
        "remaining_seconds": max(0, remaining_secs)
    }

@router.post("/update")
async def update_shared_location(
    payload: LocationShareUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")

    session = db.query(LocationShareSession).filter(
        LocationShareSession.id == payload.share_id,
        LocationShareSession.tourist_id == tourist.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Location sharing session not found")

    # Check if expired or inactive
    now = datetime.utcnow()
    if session.active == 0 or now > session.expires_at:
        session.active = 0
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Location sharing session has expired or is no longer active"
        )

    session.last_latitude = payload.latitude
    session.last_longitude = payload.longitude
    session.last_updated_at = now

    # Also update tourist's current location in profile
    tourist.last_latitude = payload.latitude
    tourist.last_longitude = payload.longitude
    tourist.last_location_updated_at = now

    db.commit()

    # Broadcast real-time location update
    await ws_manager.broadcast_dashboard({
        "event_type": "LOCATION_SHARE_UPDATE",
        "share_id": session.id,
        "tourist_code": tourist.tourist_code,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "timestamp": now.isoformat()
    })

    remaining_secs = int((session.expires_at - now).total_seconds())

    return {
        "status": "updated",
        "share_id": session.id,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "remaining_seconds": max(0, remaining_secs)
    }

@router.post("/stop")
async def stop_location_sharing(
    payload: LocationShareStopRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")

    session = db.query(LocationShareSession).filter(
        LocationShareSession.id == payload.share_id,
        LocationShareSession.tourist_id == tourist.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Location sharing session not found")

    session.active = 0
    session.last_updated_at = datetime.utcnow()
    db.commit()

    # Notify dashboard
    await ws_manager.broadcast_dashboard({
        "event_type": "LOCATION_SHARE_STOPPED",
        "share_id": session.id,
        "tourist_code": tourist.tourist_code,
        "timestamp": session.last_updated_at.isoformat()
    })

    return {"message": "Location sharing stopped successfully", "share_id": session.id, "active": 0}

@router.get("/{share_id}", response_model=PublicLocationShareView)
def get_shared_location_view(
    share_id: int,
    db: Session = Depends(get_db)
):
    session = db.query(LocationShareSession).filter(
        LocationShareSession.id == share_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sharing session not found")

    now = datetime.utcnow()
    is_active = (session.active == 1) and (now <= session.expires_at)
    if not is_active and session.active == 1:
        session.active = 0
        db.commit()

    tourist = db.query(Tourist).filter(Tourist.id == session.tourist_id).first()
    contact = db.query(EmergencyContact).filter(EmergencyContact.id == session.emergency_contact_id).first() if session.emergency_contact_id else None

    remaining_mins = max(0, int((session.expires_at - now).total_seconds() / 60)) if is_active else 0

    return {
        "share_id": session.id,
        "tourist_code": tourist.tourist_code if tourist else "TOURIST",
        "active": is_active,
        "last_latitude": session.last_latitude,
        "last_longitude": session.last_longitude,
        "last_updated_at": session.last_updated_at,
        "expires_at": session.expires_at,
        "contact_name": contact.name if contact else "Designated Emergency Contact",
        "remaining_minutes": remaining_mins
    }
