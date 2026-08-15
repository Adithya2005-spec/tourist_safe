from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.connection import get_db
from backend.app.models.blockchain_audits import BlockchainAudit
from backend.app.models.incidents import Incident
from backend.app.schemas.blockchain import BlockchainAuditOut, BlockchainAuditDetail

router = APIRouter(prefix="/blockchain", tags=["Blockchain Audit"])

@router.get("/audits", response_model=List[BlockchainAuditOut])
def get_all_blockchain_audits(db: Session = Depends(get_db)):
    audits = db.query(BlockchainAudit).order_by(BlockchainAudit.created_at.desc()).all()
    return audits

@router.get("/{incident_code_or_id}", response_model=BlockchainAuditDetail)
def get_blockchain_audit_by_incident(incident_code_or_id: str, db: Session = Depends(get_db)):
    # Try finding by incident_code or by incident_id
    if incident_code_or_id.isdigit():
        audit = db.query(BlockchainAudit).filter(BlockchainAudit.incident_id == int(incident_code_or_id)).first()
    else:
        audit = db.query(BlockchainAudit).filter(BlockchainAudit.incident_code == incident_code_or_id).first()

    if not audit:
        raise HTTPException(status_code=404, detail="Blockchain audit not found for given incident")

    incident = db.query(Incident).filter(Incident.id == audit.incident_id).first()
    
    return {
        "incident_code": audit.incident_code,
        "audit_status": audit.audit_status,
        "incident_hash": audit.incident_hash,
        "transaction_hash": audit.transaction_hash,
        "contract_address": audit.contract_address,
        "block_number": audit.block_number,
        "verified_at": audit.verified_at,
        "on_chain_status": incident.current_status if incident else "VERIFIED",
        "history_count": 1
    }
