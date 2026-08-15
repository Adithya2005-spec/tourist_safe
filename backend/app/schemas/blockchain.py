from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BlockchainRegisterRequest(BaseModel):
    incident_id: int
    incident_code: str

class BlockchainAuditOut(BaseModel):
    id: int
    incident_id: int
    incident_code: str
    incident_hash: str
    transaction_hash: Optional[str] = None
    block_number: Optional[int] = None
    contract_address: Optional[str] = None
    audit_status: str
    verified_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class BlockchainAuditDetail(BaseModel):
    incident_code: str
    audit_status: str
    incident_hash: str
    transaction_hash: Optional[str] = None
    contract_address: Optional[str] = None
    block_number: Optional[int] = None
    verified_at: Optional[datetime] = None
    on_chain_status: Optional[str] = None
    history_count: int = 0
