from pydantic import BaseModel
from typing import Optional

class UserRegister(BaseModel):
    email: str
    username: str
    password: str
    full_name: str
    phone_number: Optional[str] = None
    role: Optional[str] = "TOURIST"
    nationality: Optional[str] = "Indian"

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    role: str
    tourist_code: Optional[str] = None

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
