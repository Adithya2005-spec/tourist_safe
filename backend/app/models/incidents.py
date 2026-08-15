from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from datetime import datetime
from backend.app.database.connection import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_code = Column(String, unique=True, index=True, nullable=False) # e.g. INC-1024
    tourist_id = Column(Integer, ForeignKey("tourists.id"), nullable=False)
    incident_type = Column(String, nullable=False) # SOS, Medical Emergency, Accident, Unsafe Area, Suspicious Activity, Lost Tourist, Other
    severity = Column(String, nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    current_status = Column(String, default="NEW") # NEW, VERIFIED, ASSIGNED, RESPONDING, RESOLVED
    assigned_responder = Column(String, nullable=True)
    assigned_responder_contact = Column(String, nullable=True)
    estimated_arrival_minutes = Column(Integer, nullable=True)
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
