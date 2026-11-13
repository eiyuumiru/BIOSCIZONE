from fastapi import APIRouter, Depends, HTTPException
from typing import List
import logging
import libsql
from ..database import get_db
from ..models import BioBuddyResponse, BioBuddyCreate, ArticleResponse, FeedbackCreate, LabResponse
from ..email_service import is_smtp_configured, send_email_async, create_feedback_notification_email
from ..taxonomy import is_valid_direction, is_valid_year

router = APIRouter()
logger = logging.getLogger(__name__)


def _ensure_bio_buddies_schema(db: libsql.Connection) -> None:
    """Ensure legacy databases have the lecturer columns on bio_buddies."""
    try:
        cols_rs = db.execute("PRAGMA table_info(bio_buddies)")
        existing_cols = {row[1] for row in cols_rs.fetchall()}
        if not existing_cols:
            return
        for col in ("academic_title", "academic_degree", "workplace"):
            if col not in existing_cols:
                db.execute(f"ALTER TABLE bio_buddies ADD COLUMN {col} TEXT")
        db.commit()
    except Exception as e:
        logger.warning(f"Could not auto-migrate bio_buddies columns: {e}")


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
    # Normalize empty strings to None so optional lecturer/student fields behave consistently
    student_id = buddy.student_id.strip() if buddy.student_id and buddy.student_id.strip() else None
    course = buddy.course.strip() if buddy.course and buddy.course.strip() else None
    academic_title = buddy.academic_title.strip() if buddy.academic_title and buddy.academic_title.strip() else None
    academic_degree = buddy.academic_degree.strip() if buddy.academic_degree and buddy.academic_degree.strip() else None
    workplace = buddy.workplace.strip() if buddy.workplace and buddy.workplace.strip() else None
    phone = buddy.phone.strip() if buddy.phone and buddy.phone.strip() else None
    research_field = buddy.research_field.strip() if buddy.research_field and buddy.research_field.strip() else None
    research_subject = buddy.research_subject.strip() if buddy.research_subject and buddy.research_subject.strip() else None

    # Validate year only when course is provided (optional for lecturers)
    if course is not None:
        try:
            valid_year = is_valid_year(course)
        except Exception as e:
            logger.error(f"Error validating course '{course}': {e}")
            raise HTTPException(status_code=400, detail="Năm học không hợp lệ")
        if not valid_year:
            raise HTTPException(status_code=400, detail="Năm học không hợp lệ")

    # Validate research field and subject if both are provided
    if research_field and research_subject:
        try:
            valid_dir = is_valid_direction(research_field, research_subject)
        except Exception as e:
            logger.error(f"Error validating direction ({research_field}, {research_subject}): {e}")
            raise HTTPException(status_code=400, detail="Lĩnh vực hoặc hướng nghiên cứu không hợp lệ")
        if not valid_dir:
            raise HTTPException(status_code=400, detail="Lĩnh vực hoặc hướng nghiên cứu không hợp lệ")

    _ensure_bio_buddies_schema(db)

    query = """
    INSERT INTO bio_buddies (
        full_name, student_id, course, academic_title, academic_degree, workplace,
        email, phone, research_topic, research_field, research_subject, description
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    params = [
        buddy.full_name.strip(),
        student_id,
        course,
        academic_title,
        academic_degree,
        workplace,
        str(buddy.email).strip(),
        phone,
        buddy.research_topic.strip(),
        research_field,
        research_subject,
        buddy.description.strip(),
    ]

    try:
        db.execute(query, params)
        db.commit()
    except Exception as e:
        # Fallback if a legacy SQLite table still enforces NOT NULL on `course`
        if "NOT NULL constraint failed: bio_buddies.course" in str(e) and course is None:
            try:
                params[2] = ""
                db.execute(query, params)
                db.commit()
                return {"message": "Submitted for approval"}
            except Exception as retry_err:
                logger.exception(f"Failed to insert buddy on retry: {retry_err}")
                raise HTTPException(status_code=500, detail=f"Database error: {retry_err}")

        logger.exception(f"Failed to insert buddy: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

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
            logger.error(f"Failed to send notification email: {e}")

    return {"message": "Feedback submitted successfully"}