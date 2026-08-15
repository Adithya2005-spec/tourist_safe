from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from backend.app.database.connection import Base

class Tourist(Base):
    __tablename__ = "tourists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    tourist_code = Column(String, unique=True, index=True, nullable=False) # e.g. TOURIST-1024
    nationality = Column(String, default="Indian")
    verification_status = Column(String, default="VERIFIED") # VERIFIED, PENDING, UNVERIFIED
    credential_status = Column(String, default="ACTIVE") # ACTIVE, SUSPENDED, EXPIRED
    did_identifier = Column(String, unique=True, nullable=True) # Decentralized ID reference
    last_latitude = Column(Float, nullable=True)
    last_longitude = Column(Float, nullable=True)
    last_risk_score = Column(Float, default=15.0)
    last_risk_level = Column(String, default="LOW")
    last_location_updated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
