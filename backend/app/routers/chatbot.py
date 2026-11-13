"""Chatbot router: answers questions about UniGuide content using Gemini."""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
import json

from ..database import get_db
from ..config import settings
import libsql

router = APIRouter()

try:
    from google import genai as genai
    from google.genai import types as genai_types
    _SDK_AVAILABLE = True
except ImportError:
    _SDK_AVAILABLE = False


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    reply: str


SYSTEM_PROMPT = """Bạn là trợ lý ảo của UNIGUIDE - nền tảng kết nối cộng đồng nghiên cứu khoa học tại Thành phố Hồ Chí Minh.

Nhiệm vụ: trả lời các câu hỏi xoay quanh nội dung của trang web UNIGUIDE, bao gồm:
- Uni-Buddy (Uni-Match): nơi sinh viên đăng đề tài NCKH để tìm bạn nghiên cứu cùng khóa/lĩnh vực.
- UNI-MAGAZINE: tạp chí chia sẻ bài viết khoa học.
- Science Corner: góc khoa học với các bài viết thú vị.
- Achievements: thành tích nghiên cứu của sinh viên, giảng viên.
- Resources: tài nguyên học tập, nghiên cứu.
- Đăng ký / đăng nhập tài khoản sinh viên (cần MSSV) hoặc giảng viên.
- Đăng ký ý tưởng nghiên cứu và gửi phản hồi (feedback).

Quy tắc:
- Trả lời bằng tiếng Việt, ngắn gọn, thân thiện.
- CHỈ trả lời dựa trên nội dung trang web được cung cấp trong ngữ cảnh dưới đây.
- Nếu câu hỏi nằm ngoài nội dung trang web, lịch sự từ chối và gợi ý hỏi lại về UNIGUIDE.
- Nếu không chắc về thông tin cụ thể (ví dụ số liệu, ngày tháng), hãy nói người dùng
  nên liên hệ trực tiếp qua mục Liên hệ (Contact) của trang web.

=== NỘI DUNG TRANG WEB HIỆN TẠI ===
{context}
=== HẾT NỘI DUNG TRANG WEB ===
"""


def _build_context(db: libsql.Connection) -> str:
    """Collect current site content from the database as chatbot context."""
    parts: List[str] = []

    # Articles (latest 30, all categories)
    try:
        rs = db.execute(
            "SELECT category, title, author, external_link FROM articles ORDER BY created_at DESC LIMIT 30"
        )
        cols = [c[0] for c in rs.description]
        rows = rs.fetchall()
        if rows:
            arts = []
            for row in rows:
                d = dict(zip(cols, row))
                line = f"- [{d['category']}] {d['title']}"
                if d.get("author"):
                    line += f" (tác giả: {d['author']})"
                arts.append(line)
            parts.append("Bài viết trên trang:\n" + "\n".join(arts))
    except Exception:
        pass

    # Approved Uni-Buddy topics (latest 20)
    try:
        rs = db.execute(
            "SELECT full_name, course, research_field, research_subject, research_topic "
            "FROM bio_buddies WHERE status = 'approved' ORDER BY created_at DESC LIMIT 20"
        )
        cols = [c[0] for c in rs.description]
        rows = rs.fetchall()
        if rows:
            buddies = []
            for row in rows:
                d = dict(zip(cols, row))
                buddies.append(
                    f"- {d['full_name']} (khóa: {d['course']}) - lĩnh vực: {d.get('research_field') or 'N/A'}, "
                    f"hướng: {d.get('research_subject') or 'N/A'} - đề tài: {d['research_topic']}"
                )
            parts.append("Đề tài Uni-Buddy đang chờ ghép cặp:\n" + "\n".join(buddies))
    except Exception:
        pass

    # Labs
    try:
        rs = db.execute("SELECT name, lead_name, research_areas FROM labs LIMIT 20")
        cols = [c[0] for c in rs.description]
        rows = rs.fetchall()
        if rows:
            labs = []
            for row in rows:
                d = dict(zip(cols, row))
                line = f"- {d['name']}"
                if d.get("lead_name"):
                    line += f" (chủ nhiệm: {d['lead_name']})"
                if d.get("research_areas"):
                    line += f" - hướng nghiên cứu: {d['research_areas']}"
                labs.append(line)
            parts.append("Phòng thí nghiệm của khoa:\n" + "\n".join(labs))
    except Exception:
        pass

    if not parts:
        return "(Chưa có nội dung động nào trên trang web.)"
    return "\n\n".join(parts)


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, db: libsql.Connection = Depends(get_db)):
    """Answer a question about UniGuide content using Gemini."""
    question = payload.message.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Tin nhắn trống")
    if len(question) > 2000:
        raise HTTPException(status_code=400, detail="Tin nhắn quá dài (tối đa 2000 ký tự)")

    if not settings.GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Chatbot chưa được cấu hình (thiếu GEMINI_API_KEY)",
        )
    if not _SDK_AVAILABLE:
        raise HTTPException(status_code=503, detail="Chatbot SDK chưa được cài đặt")

    context = _build_context(db)
    system_prompt = SYSTEM_PROMPT.format(context=context)

    contents = []
    for m in (payload.history or [])[-10:]:
        role = "user" if m.role == "user" else "model"
        contents.append(genai_types.Content(
            role=role,
            parts=[genai_types.Part(text=m.content[:2000])],
        ))
    contents.append(genai_types.Content(role="user", parts=[genai_types.Part(text=question)]))

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        resp = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config=genai_types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.4,
                max_output_tokens=800,
            ),
        )
        reply = (resp.text or "").strip()
        if not reply:
            raise ValueError("Empty response")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Lỗi gọi Gemini: {e}")

    return ChatResponse(reply=reply)
