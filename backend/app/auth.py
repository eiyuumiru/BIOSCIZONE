from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .config import settings
import libsql

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/admin/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_admin_from_db(username: str):
    """Get admin from database by username"""
    conn = libsql.connect(
        settings.TURSO_DATABASE_URL,
        auth_token=settings.TURSO_AUTH_TOKEN
    )
    cursor = conn.execute(
        "SELECT username, hashed_password FROM admins WHERE username = ?",
        [username]
    )
    row = cursor.fetchone()
    conn.close()
    return row

def authenticate_user(username: str, password: str):
    # First, check database for admin
    admin = get_admin_from_db(username)
    if admin:
        # admin is a tuple: (username, hashed_password)
        stored_hash = admin[1]
        if verify_password(password, stored_hash):
            return True
        return False
    
    # Fallback to env vars (for backward compatibility)
    if settings.ADMIN_USERNAME and settings.ADMIN_PASSWORD:
        if username == settings.ADMIN_USERNAME and password == settings.ADMIN_PASSWORD:
            return True
    
    return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username
