from typing import Optional
from sqlalchemy.orm import Session
from backend.app.models.notifications import Notification
from backend.app.websocket.manager import ws_manager

async def create_notification(
    db: Session,
    tourist_id: int,
    title: str,
    message: str,
    type: str = "SAFETY_ALERT",
    priority: str = "NORMAL"
) -> Notification:
    notification = Notification(
        tourist_id=tourist_id,
        title=title,
        message=message,
        type=type,
        priority=priority,
        is_read=False
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)

    # Push to mobile app over WebSocket
    payload = {
        "id": notification.id,
        "tourist_id": notification.tourist_id,
        "title": notification.title,
        "message": notification.message,
        "type": notification.type,
        "priority": notification.priority,
        "created_at": notification.created_at.isoformat()
    }
    await ws_manager.send_to_tourist(tourist_id, "NOTIFICATION", payload)
    return notification
