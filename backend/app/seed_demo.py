"""Seed demo articles into the local database (idempotent: skip if data exists)."""
import libsql

ARTICLES = [
    # ---- Uni_Information (giống Bio-Information, đổi tên theo UNIGUIDE) ----
    # ---- Science Corner (type video/share is inferred from external_link) ----
    ("science_corner",
     "Hành trình từ phòng Lab đến bài báo quốc tế đầu tiên",
     "Những khó khăn và bài học kinh nghiệm khi thực hiện đề tài tốt nghiệp: từ lúc chọn đề tài, thiết kế thí nghiệm đến khâu viết và nộp bài. Chia sẻ thực tế dành cho sinh viên năm cuối đang chuẩn bị làm NCKH.",
     "Lê Minh (K20)", None, None, "2025-03-10"),
    ("science_corner",
     "Video: Cơ chế CRISPR/Cas9 giải thích trong 5 phút",
     "Video hoạt họa dễ hiểu về công nghệ chỉnh sửa gen CRISPR/Cas9 - công cụ đắc lực trong phòng thí nghiệm sinh học phân tử hiện đại.",
     "Bio-Science Team", None, "https://www.youtube.com/watch?v=4auBFibEptU", "2025-04-02"),
    ("science_corner",
     "Kinh nghiệm xin học bổng thạc sĩ tại Hàn Quốc",
     "Chia sẻ về hồ sơ chuẩn bị, cách viết letter of intent, phỏng vấn với giáo sư và kinh nghiệm tìm advisor phù hợp với ngành Sinh học - Công nghệ Sinh học.",
     "Trần Lan (Alumni)", None, None, "2025-05-20"),
    ("science_corner",
     "Video: Kỹ thuật PCR cơ bản cho người mới bắt đầu",
     "Hướng dẫn thực hành kỹ thuật PCR trong phòng thí nghiệm: chuẩn bị mẫu, pha reaction mix, chu trình nhiệt và cách đọc kết quả điện di.",
     "Lab Skill Series", None, "https://www.youtube.com/watch?v=2OxnNkD1ZMo", "2025-06-15"),

    # ---- UNI-MAGAZINE (bài báo khoa học) ----
    ("magazine",
     "Isolation and characterization of plant growth-promoting rhizobacteria",
     "Nghiên cứu phân lập và đặc điểm vi khuẩn nhẹ rễ (rhizobacteria) có khả năng thúc đẩy sinh trưởng thực vật, tiềm năng ứng dụng làm phân bón sinh học.",
     "Nguyen Van A, Tran Thi B",
     "https://vjbst.agu.edu.vn", None, "2025-08-01"),
    ("magazine",
     "Study on the extraction of bioactive compounds from medicinal plants",
     "Nghiên cứu chiết xuất các hợp chất hoạt tính sinh học từ dược liệu bản địa bằng phương pháp siêu âm hỗ trợ dung môi xanh.",
     "Le Van C, Pham Thi D",
     None, None, "2024-11-15"),
    ("magazine",
     "Application of Next-Generation Sequencing in genetic diversity analysis",
     "Ứng dụng công nghệ giải trình tự thế hệ mới (NGS) trong phân tích đa dạng di truyền của các giống lúa địa phương vùng ĐBSCL.",
     "Hoang Minh E, Dr. Nguyen Van X",
     None, None, "2024-09-30"),

    # ---- Achievements (Bảng vàng thành tích) ----
    ("achievement",
     "Giải Nhất Giải thưởng Sinh viên Nghiên cứu Khoa học Euréka 2025",
     "Đề tài: Ứng dụng vi tảo xử lý nước thải - Giải Nhất khu vực khối Khoa học Tự nhiên, cấp Thành phố.",
     "Nhóm SV: Nguyễn Văn A, Trần Thị B", None, None, "2025-05-18"),
    ("achievement",
     "Giải Nhì Hội nghị Khoa học Sinh viên Khoa TP HCM 2024",
     "Đề tài: Nghiên cứu docking phân tử các hợp chất ức chế enzyme - Giải Nhì cấp Khoa.",
     "Lê Văn C", None, None, "2024-12-05"),
    ("achievement",
     "Bài báo xuất sắc nhất Hội nghị Công nghệ Sinh học Toàn quốc",
     "Đề tài: Probiotics tiềm năng từ chế phẩm lên men truyền thống - Giải thưởng bài báo xuất sắc cấp Quốc gia.",
     "Nhóm nghiên cứu PTN Vi sinh", None, None, "2024-10-22"),
]


def main() -> None:
    conn = libsql.connect("uniguide_local.db", auth_token="")
    count = conn.execute("SELECT COUNT(*) FROM articles").fetchone()[0]
    if count > 0:
        print(f"Database already has {count} articles, skipping seed.")
        return
    for cat, title, content, author, link, file_url, pub in ARTICLES:
        conn.execute(
            "INSERT INTO articles (category, title, content, author, external_link, file_url, publication_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [cat, title, content, author, link, file_url, pub],
        )
    conn.commit()
    rows = conn.execute("SELECT category, COUNT(*) FROM articles GROUP BY category").fetchall()
    for cat, n in rows:
        print(f"  {cat}: {n}")
    print("Seed completed.")


if __name__ == "__main__":
    main()
