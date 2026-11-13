# Hướng dẫn khắc phục lỗi "Failed to fetch"

## Các lỗi đã sửa

### 1. Backend - Validation quá strict
**File:** `backend/app/routers/public.py`

**Vấn đề:** Backend yêu cầu `research_field` và `research_subject` bắt buộc phải có giá trị, gây lỗi khi submit.

**Đã sửa:** Chỉ validate khi các trường này được cung cấp.

```python
# Trước:
if not buddy.research_field or not buddy.research_subject or not is_valid_direction(buddy.research_field, buddy.research_subject):
    raise HTTPException(status_code=400, detail="Lĩnh vực hoặc hướng nghiên cứu không hợp lệ")

# Sau:
if buddy.research_field and buddy.research_subject:
    if not is_valid_direction(buddy.research_field, buddy.research_subject):
        raise HTTPException(status_code=400, detail="Lĩnh vực hoặc hướng nghiên cứu không hợp lệ")
```

### 2. Frontend - Error handling cải thiện
**Files:** 
- `frontend/src/services/api.ts`
- `frontend/src/services/authApi.ts`
- `frontend/src/services/chatbotApi.ts`
- `frontend/src/services/adminApi.ts`

**Vấn đề:** Lỗi "Failed to fetch" không rõ ràng, không phân biệt được lỗi kết nối hay lỗi API.

**Đã sửa:** Thêm try-catch để phân biệt:
- Lỗi kết nối (TypeError): "Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không."
- Lỗi API: Hiển thị message từ backend

## Cách kiểm tra lỗi

### Bước 1: Kiểm tra backend có đang chạy không

```powershell
# Kiểm tra port 8000
Test-NetConnection -ComputerName localhost -Port 8000 -InformationLevel Quiet

# Hoặc kiểm tra API root endpoint
Invoke-RestMethod -Uri "http://localhost:8000/" -Method GET
```

Nếu backend không chạy, chạy lệnh:
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### Bước 2: Kiểm tra CORS

File `backend/app/config.py` phải có:
```python
CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
```

### Bước 3: Test API bằng file HTML

Mở file `test_api.html` trong browser và test các endpoint:
- Test Root Endpoint
- Test Get Buddies
- Test Submit Buddy

### Bước 4: Kiểm tra frontend

Mở DevTools (F12) trong browser và xem tab Console và Network để thấy lỗi chi tiết.

## Thông báo lỗi mới

Sau khi sửa, người dùng sẽ thấy thông báo rõ ràng hơn:

- **Khi backend không chạy:** "Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không."
- **Khi validation lỗi:** Message cụ thể từ backend (vd: "Năm học không hợp lệ", "Lĩnh vực hoặc hướng nghiên cứu không hợp lệ")
- **Khi API lỗi khác:** Thông báo tiếng Việt phù hợp với từng endpoint

## Kiểm tra sau khi sửa

1. Chạy backend: `cd backend && python -m uvicorn app.main:app --reload --port 8000`
2. Chạy frontend: `cd frontend && npm run dev`
3. Mở browser và thử submit ý tưởng nghiên cứu
4. Kiểm tra xem thông báo lỗi có rõ ràng không

## File đã thay đổi

- ✅ `backend/app/routers/public.py` - Sửa validation logic
- ✅ `frontend/src/services/api.ts` - Thêm error handling cho tất cả functions
- ✅ `frontend/src/services/authApi.ts` - Thêm error handling
- ✅ `frontend/src/services/chatbotApi.ts` - Thêm error handling
- ✅ `frontend/src/services/adminApi.ts` - Thêm helper function và error handling
