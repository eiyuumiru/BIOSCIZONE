from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import List
import libsql
import uuid
import json
from ..database import get_db
from ..auth import (
    authenticate_user, 
    create_access_token, 
    get_current_user,
    get_current_user_with_role,
    require_superadmin,
    get_password_hash,
    settings
)
from ..models import (
    Token, BioBuddyResponse, ArticleCreate, ArticleUpdate, ArticleResponse,
    AdminCreate, AdminResponse, AdminUpdate,
    SystemSettingResponse, SystemSettingUpdate,
    AuditLogResponse
)

router = APIRouter()

# Helper function to log audit events
def log_audit(db: libsql.Connection, username: str, action: str, entity_type: str, entity_id: str = None, details: dict = None):
    db.execute(
        "INSERT INTO audit_logs (admin_username, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
        [username, action, entity_type, entity_id, json.dumps(details) if details else None]
    )
    db.commit()

# Authentication
@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: libsql.Connection = Depends(get_db)):
    # authenticate_user now returns dict with username and role
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}, 
        expires_delta=access_token_expires
    )
    log_audit(db, user["username"], "login", "session", None, {"role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}

# Get current user info (for frontend to determine role)
@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user_with_role)):
    return current_user

# Seed initial admin or register new admin if enabled
@router.post("/seed-admin")
async def seed_admin(username: str, password: str, role: str = "admin", db: libsql.Connection = Depends(get_db)):
    # Check if registration is enabled in settings
    rs = db.execute("SELECT value FROM system_settings WHERE key = 'registration_enabled'")
    row = rs.fetchone()
    registration_enabled = row[0] == 'true' if row else False

    # Check if any admin exists
    cursor = db.execute("SELECT COUNT(*) FROM admins")
    count = cursor.fetchone()[0]
    
    # Allow if no admin exists (bootstrap) OR if registration is explicitly enabled
    if count > 0 and not registration_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Registration is disabled. Please contact a system administrator."
        )
    
    # Check if username exists
    rs = db.execute("SELECT id FROM admins WHERE username = ?", [username])
    if rs.fetchone():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username already exists"
        )
    
    # Create admin with hashed password
    admin_id = str(uuid.uuid4())
    hashed_password = get_password_hash(password)
    db.execute(
        "INSERT INTO admins (id, username, hashed_password, role) VALUES (?, ?, ?, ?)",
        [admin_id, username, hashed_password, role]
    )
    db.commit()
    
    action = "register" if count > 0 else "seed"
    log_audit(db, username, action, "admin", admin_id, {"role": role})
    
    return {"message": f"Admin '{username}' with role '{role}' created successfully"}

# ==========================================
# SUPERADMIN ENDPOINTS - System Settings
# ==========================================

@router.get("/settings", response_model=List[SystemSettingResponse])
def get_settings(db: libsql.Connection = Depends(get_db), current_user: dict = Depends(require_superadmin)):
    rs = db.execute("SELECT key, value, updated_at, updated_by FROM system_settings")
    columns = [col[0] for col in rs.description]
    return [dict(zip(columns, row)) for row in rs.fetchall()]

@router.get("/settings/{key}", response_model=SystemSettingResponse)
def get_setting(key: str, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(require_superadmin)):
    rs = db.execute("SELECT key, value, updated_at, updated_by FROM system_settings WHERE key = ?", [key])
    row = rs.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Setting not found")
    columns = [col[0] for col in rs.description]
    return dict(zip(columns, row))

@router.patch("/settings/{key}")
def update_setting(key: str, data: SystemSettingUpdate, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(require_superadmin)):
    # Check if setting exists
    rs = db.execute("SELECT key FROM system_settings WHERE key = ?", [key])
    if not rs.fetchone():
        # Create new setting
        db.execute(
            "INSERT INTO system_settings (key, value, updated_by) VALUES (?, ?, ?)",
            [key, data.value, current_user["username"]]
        )
    else:
        # Update existing
        db.execute(
            "UPDATE system_settings SET value = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ? WHERE key = ?",
            [data.value, current_user["username"], key]
        )
    db.commit()
    log_audit(db, current_user["username"], "update", "setting", key, {"value": data.value})
    return {"message": f"Setting '{key}' updated"}

# ==========================================
# SUPERADMIN ENDPOINTS - Admin Management
# ==========================================

@router.get("/admins", response_model=List[AdminResponse])
def list_admins(db: libsql.Connection = Depends(get_db), current_user: dict = Depends(require_superadmin)):
    rs = db.execute("SELECT id, username, role FROM admins ORDER BY username")
    columns = [col[0] for col in rs.description]
    return [dict(zip(columns, row)) for row in rs.fetchall()]

@router.post("/admins", response_model=AdminResponse)
def create_admin(admin: AdminCreate, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(require_superadmin)):
    # Check if username exists
    rs = db.execute("SELECT id FROM admins WHERE username = ?", [admin.username])
    if rs.fetchone():
        raise HTTPException(status_code=400, detail="Username already exists")
    
    admin_id = str(uuid.uuid4())
    hashed_password = get_password_hash(admin.password)
    db.execute(
        "INSERT INTO admins (id, username, hashed_password, role) VALUES (?, ?, ?, ?)",
        [admin_id, admin.username, hashed_password, admin.role]
    )
    db.commit()
    log_audit(db, current_user["username"], "create", "admin", admin_id, {"username": admin.username, "role": admin.role})
    return {"id": admin_id, "username": admin.username, "role": admin.role}

@router.patch("/admins/{id}")
def update_admin(id: str, admin: AdminUpdate, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(require_superadmin)):
    # Check if admin exists
    rs = db.execute("SELECT username FROM admins WHERE id = ?", [id])
    existing = rs.fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    updates = []
    params = []
    audit_details = {}
    
    if admin.username:
        # Check if new username conflicts
        rs = db.execute("SELECT id FROM admins WHERE username = ? AND id != ?", [admin.username, id])
        if rs.fetchone():
            raise HTTPException(status_code=400, detail="Username already exists")
        updates.append("username = ?")
        params.append(admin.username)
        audit_details["username"] = admin.username
    
    if admin.password:
        updates.append("hashed_password = ?")
        params.append(get_password_hash(admin.password))
        audit_details["password"] = "[changed]"
    
    if admin.role:
        updates.append("role = ?")
        params.append(admin.role)
        audit_details["role"] = admin.role
    
    if updates:
        params.append(id)
        db.execute(f"UPDATE admins SET {', '.join(updates)} WHERE id = ?", params)
        db.commit()
        log_audit(db, current_user["username"], "update", "admin", id, audit_details)
    
    return {"message": "Admin updated"}

@router.delete("/admins/{id}")
def delete_admin(id: str, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(require_superadmin)):
    # Check if admin exists
    rs = db.execute("SELECT username FROM admins WHERE id = ?", [id])
    existing = rs.fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    # Prevent deleting self
    if existing[0] == current_user["username"]:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db.execute("DELETE FROM admins WHERE id = ?", [id])
    db.commit()
    log_audit(db, current_user["username"], "delete", "admin", id, {"username": existing[0]})
    return {"message": "Admin deleted"}

# ==========================================
# SUPERADMIN ENDPOINTS - Audit Logs
# ==========================================

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(limit: int = 100, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(require_superadmin)):
    rs = db.execute("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?", [limit])
    columns = [col[0] for col in rs.description]
    return [dict(zip(columns, row)) for row in rs.fetchall()]

# ==========================================
# REGULAR ADMIN ENDPOINTS - Content Management
# ==========================================

@router.get("/pending", response_model=List[BioBuddyResponse])
def get_pending_buddies(db: libsql.Connection = Depends(get_db), current_user: str = Depends(get_current_user)):
    rs = db.execute("SELECT * FROM bio_buddies WHERE status = 'pending'")
    columns = [col[0] for col in rs.description]
    return [dict(zip(columns, row)) for row in rs.fetchall()]

@router.patch("/approve-buddy/{id}")
def approve_buddy(id: int, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    # Get buddy name for logging
    rs = db.execute("SELECT full_name, research_topic FROM bio_buddies WHERE id = ?", [id])
    buddy = rs.fetchone()
    if not buddy:
        raise HTTPException(status_code=404, detail="Buddy not found")
    
    db.execute("UPDATE bio_buddies SET status = 'approved' WHERE id = ?", [id])
    db.commit()
    log_audit(db, current_user["username"], "approve", "bio_buddy", str(id), {"name": buddy[0], "topic": buddy[1]})
    return {"message": "Buddy approved"}

@router.post("/articles", response_model=ArticleResponse)
def create_article(article: ArticleCreate, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    query = """
    INSERT INTO articles (category, title, content, author, external_link, file_url, publication_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """
    db.execute(query, [
        article.category, article.title, article.content, 
        article.author, article.external_link, article.file_url, article.publication_date
    ])
    db.commit()
    # Fetch latest to return
    rs = db.execute("SELECT * FROM articles WHERE id = last_insert_rowid()")
    columns = [col[0] for col in rs.description]
    first_row = rs.fetchone()
    if not first_row:
        raise HTTPException(status_code=500, detail="Failed to create article")
    result = dict(zip(columns, first_row))
    log_audit(db, current_user["username"], "create", "article", str(result["id"]), {"title": article.title, "category": article.category})
    return result

@router.patch("/articles/{id}")
def update_article(id: int, data: ArticleUpdate, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    # Check if article exists
    rs = db.execute("SELECT title, category FROM articles WHERE id = ?", [id])
    existing = rs.fetchone()
    if not existing:
        raise HTTPException(status_code=404, detail="Article not found")
    
    updates = []
    params = []
    audit_details = {}
    
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        return {"message": "No changes provided"}

    for field, value in update_data.items():
        updates.append(f"{field} = ?")
        params.append(value)
        audit_details[field] = value
    
    if updates:
        params.append(id)
        db.execute(f"UPDATE articles SET {', '.join(updates)} WHERE id = ?", params)
        db.commit()
        log_audit(db, current_user["username"], "update", "article", str(id), audit_details)
    
    return {"message": "Article updated"}

@router.delete("/articles/{id}")
def delete_article(id: int, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    # Get article info for logging
    rs = db.execute("SELECT title, category FROM articles WHERE id = ?", [id])
    article = rs.fetchone()
    if article:
        log_audit(db, current_user["username"], "delete", "article", str(id), {"title": article[0], "category": article[1]})
    db.execute("DELETE FROM articles WHERE id = ?", [id])
    db.commit()
    return {"message": "Article deleted"}

@router.delete("/buddies/{id}")
def delete_buddy(id: int, db: libsql.Connection = Depends(get_db), current_user: dict = Depends(get_current_user_with_role)):
    # Get buddy info for logging
    rs = db.execute("SELECT full_name FROM bio_buddies WHERE id = ?", [id])
    buddy = rs.fetchone()
    if buddy:
        log_audit(db, current_user["username"], "delete", "bio_buddy", str(id), {"name": buddy[0]})
    db.execute("DELETE FROM bio_buddies WHERE id = ?", [id])
    db.commit()
    return {"message": "Buddy deleted"}

# Feedback Management
@router.get("/feedbacks")
def get_feedbacks(db: libsql.Connection = Depends(get_db), current_user: str = Depends(get_current_user)):
    rs = db.execute("SELECT * FROM feedbacks ORDER BY created_at DESC")
    columns = [col[0] for col in rs.description]
    return [dict(zip(columns, row)) for row in rs.fetchall()]

@router.patch("/feedbacks/{id}/read")
def mark_feedback_read(id: int, db: libsql.Connection = Depends(get_db), current_user: str = Depends(get_current_user)):
    db.execute("UPDATE feedbacks SET is_read = 1 WHERE id = ?", [id])
    db.commit()
    return {"message": "Feedback marked as read"}
