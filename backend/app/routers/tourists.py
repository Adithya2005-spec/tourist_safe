from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.connection import get_db
from backend.app.models.users import User
from backend.app.models.tourists import Tourist
from backend.app.models.emergency_contacts import EmergencyContact
from backend.app.schemas.tourist import TouristProfileOut, EmergencyContactCreate, EmergencyContactOut
from backend.app.auth.deps import get_current_user

router = APIRouter(prefix="/tourists", tags=["Tourists"])

@router.get("/me", response_model=TouristProfileOut)
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")
        
    contacts = db.query(EmergencyContact).filter(EmergencyContact.tourist_id == tourist.id).all()
    
    return {
        "id": tourist.id,
        "user_id": tourist.user_id,
        "tourist_code": tourist.tourist_code,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "nationality": tourist.nationality,
        "verification_status": tourist.verification_status,
        "credential_status": tourist.credential_status,
        "did_identifier": tourist.did_identifier,
        "last_latitude": tourist.last_latitude,
        "last_longitude": tourist.last_longitude,
        "last_risk_score": tourist.last_risk_score,
        "last_risk_level": tourist.last_risk_level,
        "last_location_updated_at": tourist.last_location_updated_at,
        "emergency_contacts": contacts
    }

@router.get("/all", response_model=List[TouristProfileOut])
def get_all_tourists(db: Session = Depends(get_db)):
    tourists = db.query(Tourist).all()
    results = []
    for t in tourists:
        user = db.query(User).filter(User.id == t.user_id).first()
        contacts = db.query(EmergencyContact).filter(EmergencyContact.tourist_id == t.id).all()
        results.append({
            "id": t.id,
            "user_id": t.user_id,
            "tourist_code": t.tourist_code,
            "full_name": user.full_name if user else "Tourist",
            "email": user.email if user else "",
            "phone_number": user.phone_number if user else "",
            "nationality": t.nationality,
            "verification_status": t.verification_status,
            "credential_status": t.credential_status,
            "did_identifier": t.did_identifier,
            "last_latitude": t.last_latitude,
            "last_longitude": t.last_longitude,
            "last_risk_score": t.last_risk_score,
            "last_risk_level": t.last_risk_level,
            "last_location_updated_at": t.last_location_updated_at,
            "emergency_contacts": contacts
        })
    return results

@router.post("/emergency-contacts", response_model=EmergencyContactOut)
def add_emergency_contact(payload: EmergencyContactCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")
    
    contact = EmergencyContact(
        tourist_id=tourist.id,
        name=payload.name,
        phone=payload.phone,
        relationship=payload.relationship,
        is_primary=payload.is_primary
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

@router.delete("/emergency-contacts/{contact_id}")
def delete_emergency_contact(contact_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")
        
    contact = db.query(EmergencyContact).filter(
        EmergencyContact.id == contact_id,
        EmergencyContact.tourist_id == tourist.id
    ).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted successfully"}
