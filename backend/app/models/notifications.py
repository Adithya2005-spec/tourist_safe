from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from datetime import datetime
from backend.app.database.connection import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    tourist_id = Column(Integer, ForeignKey("tourists.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="SAFETY_ALERT") # SAFETY_ALERT, GEOFENCE_WARNING, INCIDENT_UPDATE, SOS_CONFIRMATION
    priority = Column(String, default="NORMAL") # LOW, NORMAL, HIGH, URGENT
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
