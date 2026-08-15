from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class LocationShareStartRequest(BaseModel):
    emergency_contact_id: Optional[int] = None
    duration_minutes: int = Field(default=30, ge=5, le=1440)
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LocationShareUpdateRequest(BaseModel):
    share_id: int
    latitude: float
    longitude: float

class LocationShareStopRequest(BaseModel):
    share_id: int

class LocationShareSessionOut(BaseModel):
    id: int
    tourist_id: int
    emergency_contact_id: Optional[int] = None
    emergency_contact_name: Optional[str] = None
    started_at: datetime
    expires_at: datetime
    active: int
    last_latitude: Optional[float] = None
    last_longitude: Optional[float] = None
    last_updated_at: Optional[datetime] = None
    remaining_seconds: Optional[int] = 0

    class Config:
        from_attributes = True

class PublicLocationShareView(BaseModel):
    share_id: int
    tourist_code: str
    active: bool
    last_latitude: Optional[float] = None
    last_longitude: Optional[float] = None
    last_updated_at: Optional[datetime] = None
    expires_at: datetime
    contact_name: Optional[str] = None
    remaining_minutes: int
