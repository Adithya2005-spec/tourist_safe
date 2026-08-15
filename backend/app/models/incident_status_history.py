from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime
from backend.app.database.connection import Base

class IncidentStatusHistory(Base):
    __tablename__ = "incident_status_history"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    status = Column(String, nullable=False) # NEW, VERIFIED, ASSIGNED, RESPONDING, RESOLVED
    comment = Column(Text, nullable=True)
    changed_by = Column(String, default="SYSTEM")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
