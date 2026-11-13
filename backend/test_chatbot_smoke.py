"""Smoke test for chatbot router: validation, missing API key, context builder."""
import os, tempfile, sys

db = os.path.join(tempfile.gettempdir(), "uniguide_test_chatbot.db")
if os.path.exists(db):
    os.remove(db)
os.environ["TURSO_DATABASE_URL"] = db
os.environ["TURSO_AUTH_TOKEN"] = ""
os.environ["JWT_SECRET"] = "testsecret"
os.environ["GEMINI_API_KEY"] = ""

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) or ".")
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db, get_db
from app.routers.chatbot import _build_context

init_db()
client = TestClient(app)

# 1. Empty message -> 400
r = client.post("/api/chatbot/chat", json={"message": "   "})
assert r.status_code == 400, r.text

# 2. Message too long -> 400
r2 = client.post("/api/chatbot/chat", json={"message": "x" * 2001})
assert r2.status_code == 400, r2.text

# 3. Missing GEMINI_API_KEY -> 503 (not a crash)
r3 = client.post("/api/chatbot/chat", json={"message": "Uni-Buddy la gi?"})
assert r3.status_code == 503, r3.text
assert "GEMINI_API_KEY" in r3.json()["detail"], r3.text

# 4. Context builder works against DB (empty state)
gen = get_db()
conn = next(gen)
ctx = _build_context(conn)
assert isinstance(ctx, str) and len(ctx) > 0, ctx

# 5. Context picks up an inserted article
conn.execute("INSERT INTO articles (category, title, content) VALUES ('magazine', 'Tap chi thu nghiem', 'Noi dung')")
conn.commit()
ctx2 = _build_context(conn)
assert "Tap chi thu nghiem" in ctx2, ctx2

print("ALL CHATBOT SMOKE TESTS PASSED")
