from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from datetime import datetime
from backend.app.database.connection import Base

class RiskZone(Base):
    __tablename__ = "risk_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius = Column(Float, nullable=False) # In meters
    risk_score = Column(Float, nullable=False) # 0 - 100
    risk_level = Column(String, nullable=False) # LOW, MODERATE, HIGH, CRITICAL
    description = Column(Text, nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
