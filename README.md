# BIOSCIZONE

Nền tảng kết nối NCKH cho sinh viên, giảng viên và nguồn lực nghiên cứu khoa học thuộc Khoa Sinh học - Công nghệ Sinh học. Giao diện gồm nhiều chuyên mục (Bio-Match, Science Corner, Bio-Magazine, Achievements, Resources, Contact) với thiết kế hiện đại, hiệu ứng chuyển động mượt.

## Tính năng chính
- Trang chủ có hero animation và lối tắt nhanh tới các khu vực nổi bật.
- Bio-Match: danh sách bạn đồng hành nghiên cứu + thông tin các phòng thí nghiệm.
- Science Corner: bài chia sẻ và video học thuật.
- Bio-Magazine: tổng hợp bài báo, tạp chí khoa học.
- Achievements: timeline thành tích nghiên cứu.
- Resources: tài nguyên, hướng dẫn và tài liệu tham khảo.
- Contact + Idea Modal: form liên hệ và gửi ý tưởng nghiên cứu (UI thuần, chưa có backend).

## Công nghệ
- React 18 + React Router DOM
- Vite
- Tailwind CSS
- lucide-react (icon)

## Cấu trúc thư mục
```
.
├─ src/
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ Navigation.jsx
│  │  │  ├─ Footer.jsx
│  │  │  └─ IdeaModal.jsx
│  │  └─ views/
│  │     ├─ HomeView.jsx
│  │     ├─ BioMatchView.jsx
│  │     ├─ ScienceCornerView.jsx
│  │     ├─ BioMagazineView.jsx
│  │     ├─ AchievementsView.jsx
│  │     ├─ ResourcesView.jsx
│  │     └─ ContactView.jsx
│  ├─ data.jsx
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ index.html
├─ vite.config.js
├─ tailwind.config.js
└─ vercel.json
```

## Routes
- `/` Trang chủ
- `/bio-match`
- `/science-corner`
- `/bio-magazine`
- `/achievements`
- `/resources`
- `/contact`
- `*` fallback về trang chủ

## Chạy dự án
```
npm install
npm run dev
```

## Build & Preview
```
npm run build
npm run preview
```

## Tùy biến nội dung
- Dữ liệu mẫu và cấu hình màu/font nằm ở `src/data.jsx`.
- Các view đọc dữ liệu từ `src/data.jsx`, nên chỉ cần chỉnh file này để cập nhật nội dung hiển thị.
- Font đang dùng: Montserrat (heading) và Inter (body) từ Google Fonts trong `src/index.css`.

## Triển khai
- `npm run build` sẽ tạo thư mục `dist/`.
- `vercel.json` đã cấu hình rewrite cho SPA routing.

## Ghi chú
- Các form (Contact, Idea Modal) hiện chỉ là UI, chưa tích hợp API gửi dữ liệu.
- Bộ lọc trong Bio-Match là giao diện mẫu, chưa có logic lọc dữ liệu.
