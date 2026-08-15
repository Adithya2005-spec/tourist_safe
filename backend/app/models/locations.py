from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from datetime import datetime
from backend.app.database.connection import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    tourist_id = Column(Integer, ForeignKey("tourists.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=True)
    speed = Column(Float, nullable=True)
    heading = Column(Float, nullable=True)
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True)
