from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.models.users import User
from backend.app.models.tourists import Tourist
from backend.app.schemas.auth import UserRegister, UserLogin, Token
from backend.app.auth.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    # Check if username or email exists
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create user
    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        phone_number=payload.phone_number,
        role=payload.role or "TOURIST"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    tourist_code = None
    if user.role == "TOURIST":
        count = db.query(Tourist).count() + 1024
        tourist_code = f"TOURIST-{count}"
        tourist = Tourist(
            user_id=user.id,
            tourist_code=tourist_code,
            nationality=payload.nationality or "Indian",
            verification_status="VERIFIED",
            credential_status="ACTIVE",
            did_identifier=f"did:sih:{tourist_code.lower()}:demo"
        )
        db.add(tourist)
        db.commit()

    token = create_access_token({"sub": user.username, "role": user.role, "user_id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
        "role": user.role,
        "tourist_code": tourist_code
    }

@router.post("/login", response_model=Token)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == payload.username_or_email) | (User.email == payload.username_or_email)
    ).first()
    
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    tourist_code = None
    if user.role == "TOURIST":
        tourist = db.query(Tourist).filter(Tourist.user_id == user.id).first()
        if tourist:
            tourist_code = tourist.tourist_code
            
    token = create_access_token({"sub": user.username, "role": user.role, "user_id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
        "role": user.role,
        "tourist_code": tourist_code
    }
