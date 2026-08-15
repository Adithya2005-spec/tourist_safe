from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.auth.security import SECRET_KEY, ALGORITHM
from backend.app.schemas.auth import TokenPayload
from backend.app.models.users import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenPayload(sub=username, role=payload.get("role"))
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == token_data.sub).first()
    if user is None:
        raise credentials_exception
    return user

def require_authority_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ["AUTHORITY", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to authorized personnel"
        )
    return current_user
