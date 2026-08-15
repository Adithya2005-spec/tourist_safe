from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationOut(BaseModel):
    id: int
    tourist_id: int
    title: str
    message: str
    type: str
    priority: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationCreate(BaseModel):
    tourist_id: int
    title: str
    message: str
    type: str = "SAFETY_ALERT"
    priority: str = "NORMAL"
