from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User (Student / Lecturer) Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str  # 'student' | 'lecturer'
    student_id: Optional[str] = None
    course: Optional[str] = None
    academic_title: Optional[str] = None
    academic_degree: Optional[str] = None
    workplace: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    student_id: Optional[str] = None
    course: Optional[str] = None
    academic_title: Optional[str] = None
    academic_degree: Optional[str] = None
    workplace: Optional[str] = None

    class Config:
        from_attributes = True

# Uni-Buddy Models
class BioBuddyBase(BaseModel):
    full_name: str
    student_id: Optional[str] = None
    course: Optional[str] = None
    academic_title: Optional[str] = None
    academic_degree: Optional[str] = None
    workplace: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    research_topic: str
    research_field: Optional[str] = None
    research_subject: Optional[str] = None
    description: str

class BioBuddyCreate(BioBuddyBase):
    pass

class BioBuddyResponse(BioBuddyBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Article Models
class ArticleBase(BaseModel):
    category: str
    title: str
    content: Optional[str] = None
    author: Optional[str] = None
    external_link: Optional[str] = None
    file_url: Optional[str] = None
    publication_date: Optional[str] = None

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    external_link: Optional[str] = None
    file_url: Optional[str] = None
    publication_date: Optional[str] = None

class ArticleResponse(ArticleBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Feedback Model
class FeedbackCreate(BaseModel):
    sender_name: str
    email: EmailStr
    student_id: Optional[str] = None
    subject: str
    message: str

class LabResponse(BaseModel):
    id: int
    name: str
    lead_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    research_areas: Optional[str] = None

    class Config:
        from_attributes = True

# Admin Management Models (Superadmin)
class AdminBase(BaseModel):
    username: str
    role: str = "admin"
    email: Optional[str] = None

class AdminCreate(AdminBase):
    password: str

class AdminResponse(AdminBase):
    id: str

    class Config:
        from_attributes = True

class AdminUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None

# System Settings Models (Superadmin)
class SystemSettingResponse(BaseModel):
    key: str
    value: str
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

class SystemSettingUpdate(BaseModel):
    value: str

# Audit Log Models (Superadmin)
class AuditLogResponse(BaseModel):
    id: int
    admin_username: str
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Uni-Guard: Idea Privacy Models ============

class IdeaPrivacyUpdate(BaseModel):
    privacy_level: str  # 'public' | 'restricted' | 'private'

class IdeaPrivacyResponse(BaseModel):
    id: int
    buddy_id: int
    privacy_level: str
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

    class Config:
        from_attributes = True


# ============ Uni-Guard: Idea Version Models ============

class IdeaVersionCreate(BaseModel):
    buddy_id: int
    content_snapshot: str  # JSON string
    content_hash: str  # SHA-256 hash
    previous_hash: Optional[str] = None
    created_by: Optional[str] = None
    change_note: Optional[str] = None

class IdeaVersionResponse(BaseModel):
    id: str
    buddy_id: int
    version_number: int
    content_snapshot: str
    content_hash: str
    previous_hash: Optional[str] = None
    created_at: datetime
    created_by: Optional[str] = None
    change_note: Optional[str] = None

    class Config:
        from_attributes = True


# ============ Uni-Guard: Idea Access Request Models ============

class IdeaAccessRequestCreate(BaseModel):
    buddy_id: int
    requester_id: str
    message: Optional[str] = None

class IdeaAccessRequestResponse(BaseModel):
    id: str
    buddy_id: int
    requester_id: str
    status: str
    requested_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    message: Optional[str] = None

    class Config:
        from_attributes = True

class IdeaAccessRequestReview(BaseModel):
    status: str  # 'approved' | 'rejected'
    reviewed_by: str


# ============ Uni-Guard: Idea Access Grant Models ============

class IdeaAccessGrantCreate(BaseModel):
    buddy_id: int
    user_id: str
    access_level: str = 'restricted'  # 'restricted' | 'private'
    granted_by: str

class IdeaAccessGrantResponse(BaseModel):
    id: str
    buddy_id: int
    user_id: str
    access_level: str
    granted_at: datetime
    granted_by: str
    revoked_at: Optional[datetime] = None
    revoked_by: Optional[str] = None

    class Config:
        from_attributes = True


# ============ Uni-Guard: Idea Access Log Models ============

class IdeaAccessLogCreate(BaseModel):
    buddy_id: int
    user_id: str
    action: str  # 'view' | 'download' | 'grant_access' | 'revoke_access'
    resource_type: str = 'idea_content'
    ip_address: Optional[str] = None
    details: Optional[str] = None

class IdeaAccessLogResponse(BaseModel):
    id: str
    buddy_id: int
    user_id: str
    action: str
    resource_type: str
    ip_address: Optional[str] = None
    accessed_at: datetime
    details: Optional[str] = None

    class Config:
        from_attributes = True
