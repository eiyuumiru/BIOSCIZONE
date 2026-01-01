# BIOSCIZONE (Monorepo)

Nền tảng kết nối NCKH cho sinh viên, giảng viên và nguồn lực nghiên cứu khoa học thuộc Khoa Sinh học - Công nghệ Sinh học. Đây là dự án Monorepo bao gồm cả Frontend (React) và Backend (FastAPI).

## Cấu trúc thư mục
```
.
├── frontend/             # Ứng dụng React + Vite + Tailwind
├── backend/              # API FastAPI + Turso (SQLite Edge)
├── .env                  # Lưu trữ biến môi trường dùng chung
└── README.md             # Hướng dẫn chung
```

---

## Hướng dẫn khởi chạy

### 1. Cấu trúc biến môi trường
Tạo file `.env` ở thư mục gốc (root) với các thông tin sau:
```env
# Turso DB
TURSO_DATABASE_URL=Your_Libsql_URL
TURSO_AUTH_TOKEN=Your_Auth_Token

# Security
JWT_SECRET=Your_Secret_Key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
```

### 2. Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
Truy cập: `http://localhost:5173`

### 3. Chạy Backend
```bash
cd backend
python -m venv venv
# Chạy từ thư mục gốc (root)
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```
Truy cập API Docs: `http://127.0.0.1:8000/docs`

---

## 🛠 Công nghệ sử dụng
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React.
- **Backend:** FastAPI (Python), Turso (SQLite Edge), JWT Auth, Pydantic.
- **Hosting:** Render.com.

## Quy trình vận hành Admin
1. Admin đăng nhập qua `/api/admin/login`.
2. Truy xuất danh sách Ý tưởng chờ duyệt từ sinh viên.
3. Đăng bài báo mới trực tiếp vào mục Bio-Magazine.

---

## Liên hệ
Dự án thuộc khuôn khổ công trình thanh niên của Đoàn khoa Sinh học - Công nghệ Sinh học, Trường Đại học Khoa học tự nhiên, ĐHQG-HCM.
