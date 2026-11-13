# UNIGUIDE (Monorepo)

Nền tảng kết nối cộng đồng nghiên cứu khoa học tại Thành phố Hồ Chí Minh. Đây là dự án Monorepo bao gồm cả Frontend (React) và Backend (FastAPI).

## Cấu trúc thư mục
```
.
├── frontend/             # Ứng dụng React + Vite + Tailwind
├── backend/              # API FastAPI + Turso (SQLite Edge) + Chatbot Gemini
├── .env                  # Lưu trữ biến môi trường dùng chung
└── README.md             # Hướng dẫn chung
```

---

## 🚀 Chạy local (nhanh nhất)

### 1. Backend
```powershell
cd backend
python -m venv venv                    # lần đầu tiên
.\venv\Scripts\pip install -r requirements.txt   # lần đầu tiên
.\venv\Scripts\python -m app.init_local        # tạo DB + admin mặc định (lần đầu)
.\venv\Scripts\python -m app.seed_demo         # seed bài viết demo (lần đầu)
.\venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```
- API Docs: http://127.0.0.1:8000/docs
- Backend đọc cấu hình từ `backend/.env` (đã có sẵn cấu hình local với SQLite file `uniguide_local.db`).
- Chatbot Gemini: điền `GEMINI_API_KEY` trong `backend/.env` (key miễn phí tại https://aistudio.google.com/apikey). Không điền → widget báo "chưa cấu hình", mọi thứ khác vẫn chạy.

### 2. Frontend
```powershell
cd frontend
npm install          # lần đầu tiên
npm run dev
```
- Truy cập: http://localhost:5173
- Frontend đọc `VITE_API_URL` từ `frontend/.env` (mặc định `http://localhost:8000`).

### 3. Tài khoản dùng thử
- **Sinh viên/Giảng viên**: tự đăng ký tại `/register` (sinh viên cần MSSV).
- **Admin**: đăng nhập tại `/admin` với `admin` / `admin123` (theo `ADMIN_USERNAME`/`ADMIN_PASSWORD` trong `backend/.env`, hoặc seed qua `POST /api/admin/seed-admin`).

---

## 🔧 Cấu hình biến môi trường

### backend/.env
```env
TURSO_DATABASE_URL=uniguide_local.db   # hoặc URL libsql của Turso khi deploy
TURSO_AUTH_TOKEN=                        # token Turso khi deploy
JWT_SECRET=...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
GEMINI_API_KEY=                          # cho chatbot
GEMINI_MODEL=gemini-3.1-flash-lite
SMTP_USER=                               # tùy chọn, gửi email feedback
SMTP_PASSWORD=
```

### frontend/.env
```env
VITE_API_URL=http://localhost:8000
```

---

## 🧪 Kiểm thử
```powershell
cd backend
.\venv\Scripts\python test_auth_smoke.py       # auth student/lecturer
.\venv\Scripts\python test_chatbot_smoke.py    # chatbot validation + context
cd ..\frontend
npm run build                                  # build + type-check
```

---

## Đăng nhập Student / Lecturer
- Đăng ký / đăng nhập tại `/login` và `/register` (roles: `student`, `lecturer`).
- API: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (JWTBearer).
- Sinh viên bắt buộc khai báo MSSV; giảng viên chỉ cần email + mật khẩu.

---

## 🤖 Chatbot
- Widget chat nổi (góc phải) trên mọi trang chính.
- Backend endpoint: `POST /api/chatbot/chat`.
- Bot trả lời dựa trên nội dung thực của trang (bài viết, đề tài Uni-Buddy, phòng thí nghiệm) được nạp từ DB vào prompt Gemini mỗi lượt hỏi.

---

## 🛠 Công nghệ sử dụng
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React.
- **Backend:** FastAPI (Python), Turso/libSQL, JWT Auth, Pydantic, Google Gemini.
- **Hosting:** Render.com (backend), Vercel (frontend).

## Quy trình vận hành Admin
1. Admin đăng nhập qua `/api/admin/login`.
2. Truy xuất danh sách Ý tưởng chờ duyệt từ sinh viên.
3. Đăng bài báo mới trực tiếp vào mục UNI-MAGAZINE.

---

## Liên hệ
Mạng lưới kết nối sinh viên, giảng viên và các nguồn lực nghiên cứu khoa học tại Thành phố Hồ Chí Minh.
