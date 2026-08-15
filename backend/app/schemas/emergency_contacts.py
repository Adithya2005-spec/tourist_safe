from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EmergencyContactBase(BaseModel):
    name: str
    phone: str
    relationship: str = "Family"
    email: Optional[str] = None
    is_primary: Optional[int] = 0

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContactUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    relationship: Optional[str] = None
    email: Optional[str] = None
    is_primary: Optional[int] = None

class EmergencyContactOut(EmergencyContactBase):
    id: int
    tourist_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
