from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import List
import libsql_client
from ..database import get_db
from ..auth import (
    authenticate_user, 
    create_access_token, 
    get_current_user, 
    get_password_hash,
    settings
)
from ..models import Token, BioBuddyResponse, ArticleCreate, ArticleResponse

router = APIRouter()

# Authentication
@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: libsql_client.Client = Depends(get_db)):
    # Simple check against settings/DB for demo
    # In a real app, you'd check encrypted pass in DB
    if form_data.username != settings.ADMIN_USERNAME or form_data.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Content Management
@router.get("/pending", response_model=List[BioBuddyResponse])
def get_pending_buddies(db: libsql_client.Client = Depends(get_db), current_user: str = Depends(get_current_user)):
    rs = db.execute("SELECT * FROM bio_buddies WHERE status = 'pending'")
    return [dict(row) for row in rs.rows]

@router.patch("/approve-buddy/{id}")
def approve_buddy(id: int, db: libsql_client.Client = Depends(get_db), current_user: str = Depends(get_current_user)):
    db.execute("UPDATE bio_buddies SET status = 'approved' WHERE id = ?", [id])
    return {"message": "Buddy approved"}

@router.post("/articles", response_model=ArticleResponse)
def create_article(article: ArticleCreate, db: libsql_client.Client = Depends(get_db), current_user: str = Depends(get_current_user)):
    query = """
    INSERT INTO articles (category, title, content, author, external_link, file_url, publication_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """
    db.execute(query, [
        article.category, article.title, article.content, 
        article.author, article.external_link, article.file_url, article.publication_date
    ])
    # Fetch latest to return
    rs = db.execute("SELECT * FROM articles WHERE id = last_insert_rowid()")
    return dict(rs.rows[0])

@router.delete("/articles/{id}")
def delete_article(id: int, db: libsql_client.Client = Depends(get_db), current_user: str = Depends(get_current_user)):
    db.execute("DELETE FROM articles WHERE id = ?", [id])
    return {"message": "Article deleted"}
