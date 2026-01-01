from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..database import get_db
from ..models import BioBuddyResponse, BioBuddyCreate, ArticleResponse, FeedbackCreate, LabResponse
import libsql_client

router = APIRouter()


@router.get("/buddies", response_model=List[BioBuddyResponse])
def get_approved_buddies(course: str = None, db: libsql_client.Client = Depends(get_db)):
    query = "SELECT * FROM bio_buddies WHERE status = 'approved'"
    params = []
    if course and course != "All":
        query += " AND course = ?"
        params.append(course)
    
    rs = db.execute(query, params)
    return [dict(row) for row in rs.rows]

@router.post("/buddies/submit")
def submit_buddy(buddy: BioBuddyCreate, db: libsql_client.Client = Depends(get_db)):
    query = """
    INSERT INTO bio_buddies (full_name, student_id, course, email, phone, research_topic, research_field, research_subject, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    db.execute(query, [
        buddy.full_name, buddy.student_id, buddy.course, buddy.email, 
        buddy.phone, buddy.research_topic, buddy.research_field, 
        buddy.research_subject, buddy.description
    ])
    return {"message": "Submitted for approval"}

@router.get("/articles", response_model=List[ArticleResponse])
def get_articles(category: str = None, db: libsql_client.Client = Depends(get_db)):
    query = "SELECT * FROM articles"
    params = []
    if category:
        query += " WHERE category = ?"
        params.append(category)
    
    rs = db.execute(query, params)
    return [dict(row) for row in rs.rows]

@router.get("/search")
def global_search(q: str, db: libsql_client.Client = Depends(get_db)):
    keyword = f"%{q}%"
    
    # Search in approved buddies
    buddies_rs = db.execute(
        "SELECT * FROM bio_buddies WHERE status = 'approved' AND (full_name LIKE ? OR research_topic LIKE ? OR description LIKE ?)",
        [keyword, keyword, keyword]
    )
    
    # Search in articles
    articles_rs = db.execute(
        "SELECT * FROM articles WHERE title LIKE ? OR content LIKE ? OR author LIKE ?",
        [keyword, keyword, keyword]
    )
    
    return {
        "buddies": [dict(row) for row in buddies_rs.rows],
        "articles": [dict(row) for row in articles_rs.rows]
    }

@router.get("/labs", response_model=List[LabResponse])
def get_labs(db: libsql_client.Client = Depends(get_db)):
    rs = db.execute("SELECT * FROM labs")
    return [dict(row) for row in rs.rows]
