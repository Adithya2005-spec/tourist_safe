from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class IncidentCreate(BaseModel):
    incident_type: str # Medical Emergency, Accident, Unsafe Area, Suspicious Activity, Lost Tourist, Other
    severity: str # LOW, MEDIUM, HIGH, CRITICAL
    description: Optional[str] = None
    latitude: float
    longitude: float
    offline_created_at: Optional[datetime] = None

class SOSCreate(BaseModel):
    latitude: float
    longitude: float
    current_risk_score: Optional[float] = None
    current_risk_level: Optional[str] = None
    note: Optional[str] = "Emergency SOS Triggered by Tourist"

class IncidentStatusUpdate(BaseModel):
    status: str # VERIFIED, ASSIGNED, RESPONDING, RESOLVED
    comment: Optional[str] = None
    assigned_responder: Optional[str] = None
    assigned_responder_contact: Optional[str] = None
    estimated_arrival_minutes: Optional[int] = None
    resolution_notes: Optional[str] = None

class StatusHistoryOut(BaseModel):
    id: int
    status: str
    comment: Optional[str] = None
    changed_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class IncidentOut(BaseModel):
    id: int
    incident_code: str
    tourist_id: int
    incident_type: str
    severity: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    current_status: str
    assigned_responder: Optional[str] = None
    assigned_responder_contact: Optional[str] = None
    estimated_arrival_minutes: Optional[int] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    status_history: List[StatusHistoryOut] = []
    blockchain_verified: bool = False
    transaction_hash: Optional[str] = None
    incident_hash: Optional[str] = None

    class Config:
        from_attributes = True
