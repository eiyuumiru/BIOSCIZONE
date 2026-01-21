from fastapi import APIRouter, Depends, HTTPException
from typing import List
import libsql
import threading
from ..database import get_db
from ..models import BioBuddyResponse, BioBuddyCreate, ArticleResponse, FeedbackCreate, LabResponse
from ..email_service import is_smtp_configured, send_email_async, create_feedback_notification_email

router = APIRouter()


@router.get("/buddies", response_model=List[BioBuddyResponse])
def get_approved_buddies(course: str = None, db: libsql.Connection = Depends(get_db)):
    query = "SELECT * FROM bio_buddies WHERE status = 'approved'"
    params = []
    if course and course != "All":
        query += " AND course = ?"
        params.append(course)
    rs = db.execute(query, params)
    columns = [col[0] for col in rs.description]
    return [dict(zip(columns, row)) for row in rs.fetchall()]

@router.post("/buddies/submit")
def submit_buddy(buddy: BioBuddyCreate, db: libsql.Connection = Depends(get_db)):
    query = """
    INSERT INTO bio_buddies (full_name, student_id, course, email, phone, research_topic, research_field, research_subject, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    db.execute(query, [
        buddy.full_name, buddy.student_id, buddy.course, buddy.email, 
        buddy.phone, buddy.research_topic, buddy.research_field, 
        buddy.research_subject, buddy.description
    ])
    db.commit()
    return {"message": "Submitted for approval"}

@router.get("/articles", response_model=List[ArticleResponse])
def get_articles(category: str = None, db: libsql.Connection = Depends(get_db)):
    query = "SELECT * FROM articles"
    params = []
    if category:
        query += " WHERE category = ?"
        params.append(category)
    rs = db.execute(query, params)
    columns = [col[0] for col in rs.description]
    return [dict(zip(columns, row)) for row in rs.fetchall()]

@router.get("/articles/{article_id}", response_model=ArticleResponse)
def get_article(article_id: int, db: libsql.Connection = Depends(get_db)):
    rs = db.execute("SELECT * FROM articles WHERE id = ?", [article_id])
    row = rs.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Article not found")
    columns = [col[0] for col in rs.description]
    return dict(zip(columns, row))

@router.get("/search")
def global_search(q: str, db: libsql.Connection = Depends(get_db)):
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
    
    columns_b = [col[0] for col in buddies_rs.description]
    columns_a = [col[0] for col in articles_rs.description]
    
    return {
        "buddies": [dict(zip(columns_b, row)) for row in buddies_rs.fetchall()],
        "articles": [dict(zip(columns_a, row)) for row in articles_rs.fetchall()]
    }

@router.get("/labs", response_model=List[LabResponse])
def get_labs(db: libsql.Connection = Depends(get_db)):
    rs = db.execute("SELECT * FROM labs")
    columns = [col[0] for col in rs.description]
    return [dict(zip(columns, row)) for row in rs.fetchall()]

@router.get("/registration-status")
def get_registration_status(db: libsql.Connection = Depends(get_db)):
    """Check if admin registration is enabled (public endpoint)"""
    rs = db.execute("SELECT value FROM system_settings WHERE key = 'registration_enabled'")
    row = rs.fetchone()
    enabled = row[0] == 'true' if row else False
    return {"enabled": enabled}

@router.post("/feedback")
async def submit_feedback(feedback: FeedbackCreate, db: libsql.Connection = Depends(get_db)):
    # Save feedback to database
    query = """
    INSERT INTO feedbacks (sender_name, email, student_id, subject, message)
    VALUES (?, ?, ?, ?, ?)
    """
    db.execute(query, [
        feedback.sender_name, feedback.email, feedback.student_id,
        feedback.subject, feedback.message
    ])
    db.commit()
    
    # Send email notification to admins (if SMTP is configured)
    if is_smtp_configured():
        try:
            # Get all admin emails (where email is not null)
            admin_rs = db.execute("SELECT email FROM admins WHERE email IS NOT NULL AND email != ''")
            admin_emails = [row[0] for row in admin_rs.fetchall()]
            
            if admin_emails:
                # Create email content
                email_subject, html_content, text_content = create_feedback_notification_email(
                    sender_name=feedback.sender_name,
                    sender_email=feedback.email,
                    student_id=feedback.student_id,
                    subject=feedback.subject,
                    message=feedback.message
                )
                
                # Send email asynchronously
                await send_email_async(
                    to_emails=admin_emails,
                    subject=email_subject,
                    html_content=html_content,
                    text_content=text_content
                )
        except Exception as e:
            # Log error but don't fail the feedback submission
            import logging
            logging.getLogger(__name__).error(f"Failed to send notification email: {e}")
    
    return {"message": "Feedback submitted successfully"}

