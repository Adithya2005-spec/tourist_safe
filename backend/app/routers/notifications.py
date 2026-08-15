from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.database.connection import get_db
from backend.app.models.users import User
from backend.app.models.tourists import Tourist
from backend.app.models.notifications import Notification
from backend.app.schemas.notification import NotificationOut
from backend.app.auth.deps import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationOut])
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        return []
    notifications = db.query(Notification).filter(
        Notification.tourist_id == tourist.id
    ).order_by(Notification.created_at.desc()).limit(50).all()
    return notifications

@router.patch("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tourist = db.query(Tourist).filter(Tourist.user_id == current_user.id).first()
    if not tourist:
        raise HTTPException(status_code=404, detail="Tourist profile not found")
        
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.tourist_id == tourist.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notif.is_read = True
    db.commit()
    return {"message": "Notification marked as read"}
