import math
from typing import List, Tuple
from sqlalchemy.orm import Session
from backend.app.models.risk_zones import RiskZone

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate geographic distance between two points in meters using Haversine formula.
    """
    R = 6371000.0 # Earth's radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return R * c

def check_geofences(db: Session, lat: float, lon: float) -> List[Tuple[RiskZone, float]]:
    """
    Evaluates tourist location against all active risk zones.
    Returns list of breached zones with calculated distance in meters.
    """
    active_zones = db.query(RiskZone).filter(RiskZone.active == True).all()
    breaches = []
    for zone in active_zones:
        dist = calculate_haversine_distance(lat, lon, zone.latitude, zone.longitude)
        if dist <= zone.radius:
            breaches.append((zone, dist))
    return breaches
