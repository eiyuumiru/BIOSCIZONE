from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .config import settings
import libsql

# Argon2 password hasher - no password length limit, memory-hard
ph = PasswordHasher()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/admin/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password using Argon2"""
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except VerifyMismatchError:
        return False

def get_password_hash(password: str) -> str:
    """Hash password using Argon2"""
    return ph.hash(password)

def get_admin_from_db(username: str):
    """Get admin from database by username, including role"""
    conn = libsql.connect(
        settings.TURSO_DATABASE_URL,
        auth_token=settings.TURSO_AUTH_TOKEN
    )
    cursor = conn.execute(
        "SELECT username, hashed_password, role FROM admins WHERE username = ?",
        [username]
    )
    row = cursor.fetchone()
    conn.close()
    return row  # Returns (username, hashed_password, role) or None

def authenticate_user(username: str, password: str):
    """Authenticate user and return role if successful"""
    # First, check database for admin
    admin = get_admin_from_db(username)
    if admin:
        # admin is a tuple: (username, hashed_password, role)
        stored_hash = admin[1]
        role = admin[2] or "admin"
        if verify_password(password, stored_hash):
            return {"username": username, "role": role}
        return None
    
    # Fallback to env vars (for backward compatibility) - treated as superadmin
    if settings.ADMIN_USERNAME and settings.ADMIN_PASSWORD:
        if username == settings.ADMIN_USERNAME and password == settings.ADMIN_PASSWORD:
            return {"username": username, "role": "superadmin"}
    
    return None

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
    """Get current user from token (backward compatible - returns username string)"""
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

async def get_current_user_with_role(token: str = Depends(oauth2_scheme)):
    """Get current user with role from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role", "admin")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return {"username": username, "role": role}

async def require_superadmin(current_user: dict = Depends(get_current_user_with_role)):
    """Dependency that requires superadmin role"""
    if current_user.get("role") != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Superadmin access required"
        )
    return current_user


# ============ User (Student / Lecturer) Authentication ============

def get_user_from_db(email: str):
    """Get a student/lecturer user from database by email."""
    conn = libsql.connect(
        settings.TURSO_DATABASE_URL,
        auth_token=settings.TURSO_AUTH_TOKEN
    )
    cursor = conn.execute(
        "SELECT id, email, hashed_password, full_name, role, student_id, course, academic_title, academic_degree, workplace FROM users WHERE email = ?",
        [email]
    )
    row = cursor.fetchone()
    conn.close()
    return row  # (id, email, hash, full_name, role, student_id, course, academic_title, academic_degree, workplace) or None


def authenticate_email_user(email: str, password: str):
    """Authenticate a student/lecturer user by email and password."""
    row = get_user_from_db(email)
    if not row:
        return None
    if verify_password(password, row[2]):
        return {
            "id": row[0],
            "email": row[1],
            "full_name": row[3],
            "role": row[4],
            "student_id": row[5],
            "course": row[6],
            "academic_title": row[7],
            "academic_degree": row[8],
            "workplace": row[9],
        }
    return None


def require_role(*allowed_roles: str):
    """Dependency factory: returns a dependency enforcing one of the allowed roles."""
    async def role_checker(token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
            email = payload.get("sub")
            role = payload.get("role")
            if email is None or role is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access requires one of roles: {', '.join(allowed_roles)}"
            )
        return {"email": email, "role": role}
    return role_checker


# Ready-made dependencies
require_student = require_role("student")
require_lecturer = require_role("lecturer")
require_any_user = require_role("student", "lecturer")



