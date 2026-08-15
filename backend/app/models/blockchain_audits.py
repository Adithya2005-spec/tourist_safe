from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime
from backend.app.database.connection import Base

class BlockchainAudit(Base):
    __tablename__ = "blockchain_audits"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    incident_code = Column(String, index=True, nullable=False)
    incident_hash = Column(String, nullable=False) # Cryptographic hash of canonical incident
    transaction_hash = Column(String, nullable=True) # On-chain transaction hash
    block_number = Column(Integer, nullable=True)
    contract_address = Column(String, nullable=True)
    audit_status = Column(String, default="VERIFIED") # VERIFIED, PENDING, FAILED
    verified_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
