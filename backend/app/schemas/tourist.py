from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EmergencyContactCreate(BaseModel):
    name: str
    phone: str
    relationship: str
    is_primary: Optional[int] = 0

class EmergencyContactOut(EmergencyContactCreate):
    id: int
    tourist_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class TouristProfileOut(BaseModel):
    id: int
    user_id: int
    tourist_code: str
    full_name: str
    email: str
    phone_number: Optional[str] = None
    nationality: str
    verification_status: str
    credential_status: str
    did_identifier: Optional[str] = None
    last_latitude: Optional[float] = None
    last_longitude: Optional[float] = None
    last_risk_score: float
    last_risk_level: str
    last_location_updated_at: Optional[datetime] = None
    emergency_contacts: List[EmergencyContactOut] = []

    class Config:
        from_attributes = True

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    speed: Optional[float] = None
    heading: Optional[float] = None
