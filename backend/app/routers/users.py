from fastapi import APIRouter, Depends, HTTPException, status
from ..database import get_db
from ..auth import (
    get_password_hash,
    verify_password,
    authenticate_email_user,
    create_access_token,
    require_any_user,
    settings,
)
from datetime import timedelta
import libsql
import uuid
from ..models import UserRegister, UserLogin, UserResponse

router = APIRouter()

VALID_ROLES = ("student", "lecturer")


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister, db: libsql.Connection = Depends(get_db)):
    """Register a new student or lecturer account."""
    existing = db.execute("SELECT id FROM users WHERE email = ?", [user.email]).fetchone()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    if user.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail="Role must be 'student' or 'lecturer'")
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    if user.role == "student" and not user.student_id:
        raise HTTPException(status_code=400, detail="Students must provide a student ID (MSSV)")

    user_id = str(uuid.uuid4())
    db.execute(
        "INSERT INTO users (id, email, hashed_password, full_name, role, student_id, course, academic_title, academic_degree, workplace) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [user_id, user.email, get_password_hash(user.password), user.full_name,
         user.role, user.student_id, user.course,
         user.academic_title, user.academic_degree, user.workplace]
    )
    db.commit()

    return UserResponse(
        id=user_id, email=user.email, full_name=user.full_name,
        role=user.role, student_id=user.student_id, course=user.course,
        academic_title=user.academic_title, academic_degree=user.academic_degree, workplace=user.workplace
    )


@router.post("/login", response_model=dict)
def login_user(credentials: UserLogin, db: libsql.Connection = Depends(get_db)):
    """Login for students and lecturers, returns JWT with role claim."""
    user = authenticate_email_user(credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"], "name": user["full_name"]},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "student_id": user["student_id"],
            "course": user["course"],
            "academic_title": user["academic_title"],
            "academic_degree": user["academic_degree"],
            "workplace": user["workplace"],
        },
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(require_any_user), db: libsql.Connection = Depends(get_db)):
    """Get current logged-in user info."""
    row = db.execute(
        "SELECT id, email, full_name, role, student_id, course, academic_title, academic_degree, workplace FROM users WHERE email = ?",
        [current_user["email"]]
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=row[0], email=row[1], full_name=row[2], role=row[3],
        student_id=row[4], course=row[5],
        academic_title=row[6], academic_degree=row[7], workplace=row[8]
    )
