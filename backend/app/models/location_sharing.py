from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from datetime import datetime
from backend.app.database.connection import Base

class LocationShareSession(Base):
    __tablename__ = "location_share_sessions"

    id = Column(Integer, primary_key=True, index=True)
    tourist_id = Column(Integer, ForeignKey("tourists.id"), nullable=False)
    emergency_contact_id = Column(Integer, ForeignKey("emergency_contacts.id"), nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    active = Column(Integer, default=1) # 1 = active, 0 = inactive
    last_latitude = Column(Float, nullable=True)
    last_longitude = Column(Float, nullable=True)
    last_updated_at = Column(DateTime, default=datetime.utcnow)
