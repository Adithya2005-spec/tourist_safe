from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from backend.app.database.connection import Base

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    tourist_id = Column(Integer, ForeignKey("tourists.id"), nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    relationship = Column(String, nullable=False) # Family, Friend, Spouse, Doctor, Other
    is_primary = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
