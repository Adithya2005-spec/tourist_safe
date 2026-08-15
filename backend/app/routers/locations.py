from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from backend.app.database.connection import get_db
from backend.app.models.users import User
from backend.app.models.tourists import Tourist
from backend.app.models.locations import Location
from backend.app.schemas.tourist import LocationUpdate
from backend.app.auth.deps import get_current_user
from backend.app.services.location_service import check_geofences
from backend.app.services.notification_service import create_notification
from backend.app.websocket.manager import ws_manager

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.post("")
async def update_tourist_location(
    payload: LocationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")

    # Update tourist last location
    tourist.last_latitude = payload.latitude
    tourist.last_longitude = payload.longitude
    tourist.last_location_updated_at = datetime.utcnow()
    db.commit()

    # Save to location trail
    loc_entry = Location(
        tourist_id=tourist.id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        accuracy=payload.accuracy,
        speed=payload.speed,
        heading=payload.heading,
        recorded_at=datetime.utcnow()
    )
    db.add(loc_entry)
    db.commit()

    # Check for geofence breaches
    breaches = check_geofences(db, payload.latitude, payload.longitude)
    warnings = []
    for zone, dist in breaches:
        warnings.append({
            "zone_id": zone.id,
            "zone_name": zone.name,
            "risk_level": zone.risk_level,
            "risk_score": zone.risk_score,
            "distance_meters": round(dist, 1)
        })
        if zone.risk_level in ["HIGH", "CRITICAL"]:
            await create_notification(
                db=db,
                tourist_id=tourist.id,
                title=f"⚠️ {zone.risk_level} Risk Zone Alert",
                message=f"You have entered {zone.name}. Please follow safety guidelines.",
                type="GEOFENCE_WARNING",
                priority="HIGH" if zone.risk_level == "HIGH" else "URGENT"
            )

    # Broadcast location update to authority dashboard
    await ws_manager.broadcast_to_authorities("TOURIST_LOCATION_UPDATE", {
        "tourist_id": tourist.id,
        "tourist_code": tourist.tourist_code,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "updated_at": tourist.last_location_updated_at.isoformat(),
        "active_breaches": warnings
    })

    return {
        "status": "success",
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "breaches": warnings
    }

@router.get("")
def get_recent_locations(db: Session = Depends(get_db)):
    locs = db.query(Location).order_by(Location.recorded_at.desc()).limit(100).all()
    return locs
