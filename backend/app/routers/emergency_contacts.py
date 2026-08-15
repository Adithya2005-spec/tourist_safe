from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.connection import get_db
from backend.app.models.users import User
from backend.app.models.tourists import Tourist
from backend.app.models.emergency_contacts import EmergencyContact
from backend.app.schemas.emergency_contacts import (
    EmergencyContactCreate,
    EmergencyContactUpdate,
    EmergencyContactOut
)
from backend.app.auth.deps import get_current_user

router = APIRouter(prefix="/emergency-contacts", tags=["Emergency Contacts"])

@router.get("", response_model=List[EmergencyContactOut])
def get_emergency_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")
    
    contacts = db.query(EmergencyContact).filter(
        EmergencyContact.tourist_id == tourist.id
    ).order_by(EmergencyContact.is_primary.desc(), EmergencyContact.id.asc()).all()
    return contacts

@router.post("", response_model=EmergencyContactOut, status_code=status.HTTP_201_CREATED)
def create_emergency_contact(
    payload: EmergencyContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")

    # If new contact is set as primary, unmark previous primaries
    if payload.is_primary:
        db.query(EmergencyContact).filter(
            EmergencyContact.tourist_id == tourist.id
        ).update({"is_primary": 0})

    contact = EmergencyContact(
        tourist_id=tourist.id,
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        relationship=payload.relationship.strip(),
        is_primary=1 if payload.is_primary else 0
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

@router.patch("/{contact_id}", response_model=EmergencyContactOut)
def update_emergency_contact(
    contact_id: int,
    payload: EmergencyContactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")

    contact = db.query(EmergencyContact).filter(
        EmergencyContact.id == contact_id,
        EmergencyContact.tourist_id == tourist.id
    ).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Emergency contact not found")

    if payload.is_primary == 1:
        db.query(EmergencyContact).filter(
            EmergencyContact.tourist_id == tourist.id
        ).update({"is_primary": 0})
        contact.is_primary = 1
    elif payload.is_primary == 0:
        contact.is_primary = 0

    if payload.name is not None:
        contact.name = payload.name.strip()
    if payload.phone is not None:
        contact.phone = payload.phone.strip()
    if payload.relationship is not None:
        contact.relationship = payload.relationship.strip()

    db.commit()
    db.refresh(contact)
    return contact

@router.delete("/{contact_id}")
def delete_emergency_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")

    contact = db.query(EmergencyContact).filter(
        EmergencyContact.id == contact_id,
        EmergencyContact.tourist_id == tourist.id
    ).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Emergency contact not found")

    db.delete(contact)
    db.commit()
    return {"message": "Emergency contact deleted successfully", "id": contact_id}
