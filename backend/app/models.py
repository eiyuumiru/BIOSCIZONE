from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Bio-Buddy Models
class BioBuddyBase(BaseModel):
    full_name: str
    student_id: Optional[str] = None
    course: str
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
