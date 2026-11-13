"""Smoke test for user auth: register -> login -> me, using local sqlite file."""
import os, tempfile, sys

db = os.path.join(tempfile.gettempdir(), "uniguide_test.db")
if os.path.exists(db):
    os.remove(db)
os.environ["TURSO_DATABASE_URL"] = db
os.environ["TURSO_AUTH_TOKEN"] = ""
os.environ["JWT_SECRET"] = "testsecret"

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db

init_db()
client = TestClient(app)

# 1. Register student
r = client.post("/api/auth/register", json={
    "email": "sv@example.com", "password": "secret123",
    "full_name": "Nguyen Van A", "role": "student",
    "student_id": "2112000", "course": "Năm 2",
})
assert r.status_code == 201, r.text
me_created = r.json()
assert me_created["role"] == "student"

# 2. Duplicate register -> 409
r2 = client.post("/api/auth/register", json={
    "email": "sv@example.com", "password": "secret123",
    "full_name": "X", "role": "student",
})
assert r2.status_code == 409, r2.text

# 3. Register lecturer
r3 = client.post("/api/auth/register", json={
    "email": "gv@example.com", "password": "secret123",
    "full_name": "Tran Thi B", "role": "lecturer",
})
assert r3.status_code == 201, r3.text

# 4. Invalid role rejected
r4 = client.post("/api/auth/register", json={
    "email": "x@example.com", "password": "secret123",
    "full_name": "X", "role": "admin",
})
assert r4.status_code == 400, r4.text

# 5. Student without MSSV rejected
r5 = client.post("/api/auth/register", json={
    "email": "y@example.com", "password": "secret123",
    "full_name": "Y", "role": "student",
})
assert r5.status_code == 400, r5.text

# 6. Login student
r6 = client.post("/api/auth/login", json={"email": "sv@example.com", "password": "secret123"})
assert r6.status_code == 200, r6.text
tok = r6.json()["access_token"]
assert r6.json()["user"]["role"] == "student"

# 7. Wrong password
r7 = client.post("/api/auth/login", json={"email": "sv@example.com", "password": "wrong"})
assert r7.status_code == 401, r7.text

# 8. /me with token
r8 = client.get("/api/auth/me", headers={"Authorization": f"Bearer {tok}"})
assert r8.status_code == 200, r8.text
assert r8.json()["email"] == "sv@example.com"

# 9. /me without token -> 401
r9 = client.get("/api/auth/me")
assert r9.status_code in (401, 403), r9.text

print("ALL AUTH SMOKE TESTS PASSED")
