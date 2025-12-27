import React from 'react';
import {
    FileText,
    BookOpen,
    PlayCircle,
    Share2
} from 'lucide-react';

export const newsItems = [
    { id: 1, title: "Hội thảo: Ứng dụng AI trong phân tích gen", date: "15/01/2026", category: "Sự kiện" },
    { id: 2, title: "Công bố kết quả NCKH sinh viên cấp Khoa 2025", date: "10/01/2026", category: "Tin tức" },
    { id: 3, title: "Kỹ năng viết bài báo khoa học chuẩn APA", date: "05/01/2026", category: "Hướng dẫn" }
];

export const bioBuddies = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        course: "K22",
        topic: "Vi tảo và ứng dụng xử lý nước thải công nghiệp...",
        skills: ["Phân tích số liệu", "Lab technique"],
        lookingFor: "Bạn viết báo cáo tốt"
    },
    {
        id: 2,
        name: "Trần Thị B",
        course: "K23",
        topic: "Nghiên cứu ứng dụng công nghệ tế bào gốc...",
        skills: ["Tiếng Anh", "Đọc tài liệu"],
        lookingFor: "Bạn có kỹ năng nuôi cấy mô"
    },
    {
        id: 3,
        name: "Lê Văn C",
        course: "K21",
        topic: "Tin sinh học & Docking phân tử",
        skills: ["Python", "R Language", "Data Mining"],
        lookingFor: "Bạn am hiểu về Protein"
    },
    {
        id: 4,
        name: "Phạm Thị D",
        course: "K22",
        topic: "Vi sinh vật học thực phẩm",
        skills: ["Cấy vi sinh", "Thống kê"],
        lookingFor: "Thành viên chăm chỉ"
    },
    {
        id: 5,
        name: "Hoàng Minh E",
        course: "K23",
        topic: "Ứng dụng enzyme trong chế biến thực phẩm",
        skills: ["Hóa sinh", "Làm việc nhóm"],
        lookingFor: "Bạn có kỹ năng chạy sắc ký"
    },
    {
        id: 6,
        name: "Đỗ Thị F",
        course: "K21",
        topic: "Bảo tồn nguồn gen cây thuốc quý",
        skills: ["Thực địa", "Phân loại học"],
        lookingFor: "Bạn sức khỏe tốt, chịu khó"
    },
];

export const labInfo = [
    { id: 1, name: "Bộ môn Di truyền", lead: "PGS.TS Nguyễn Văn X", email: "nvx@hcmus.edu.vn", research: "Nghiên cứu đa dạng di truyền, Bệnh di truyền ở người, Di truyền học ung thư." },
    { id: 2, name: "Bộ môn Vi sinh", lead: "TS. Trần Thị Y", email: "tty@hcmus.edu.vn", research: "Vi sinh vật học môi trường, Vi sinh vật học thực phẩm, Probiotics." },
    { id: 3, name: "Bộ môn Sinh hóa", lead: "PGS.TS Lê Văn Z", email: "lvz@hcmus.edu.vn", research: "Enzyme và ứng dụng, Hóa sinh lâm sàng, Hợp chất thiên nhiên." },
    { id: 4, name: "Bộ môn Sinh lý Thực vật", lead: "TS. Phạm Văn K", email: "pvk@hcmus.edu.vn", research: "Nuôi cấy mô tế bào thực vật, Sinh lý stress ở thực vật." },
];

export const resourcesList = [
    { id: 1, title: "Cách trích dẫn tài liệu tham khảo theo chuẩn APA (7th Edition)", date: "10/01/2026", type: "guide", icon: <FileText size={24} /> },
    { id: 2, title: "Quy trình đăng ký đề tài NCKH cấp Trường", date: "08/01/2026", type: "guide", icon: <FileText size={24} /> },
    { id: 3, title: "Tổng hợp các tạp chí khoa học uy tín ngành Sinh học", date: "01/01/2026", type: "list", icon: <BookOpen size={24} /> },
];

export const scienceCornerItems = [
    { id: 1, title: "Hành trình từ phòng Lab đến bài báo quốc tế đầu tiên", author: "Lê Minh (K20)", type: "share", icon: <Share2 size={24} />, desc: "Những khó khăn và bài học kinh nghiệm khi thực hiện đề tài tốt nghiệp." },
    { id: 2, title: "Video: Cơ chế CRISPR/Cas9 giải thích trong 5 phút", author: "Bio-Science Team", type: "video", icon: <PlayCircle size={24} />, desc: "Video hoạt họa dễ hiểu về công nghệ chỉnh sửa gen." },
    { id: 3, title: "Kinh nghiệm xin học bổng thạc sĩ tại Hàn Quốc", author: "Trần Lan (Alumni)", type: "share", icon: <Share2 size={24} />, desc: "Chia sẻ về hồ sơ, phỏng vấn và tìm giáo sư hướng dẫn." },
    { id: 4, title: "Video: Kỹ thuật PCR cơ bản cho người mới bắt đầu", author: "Lab Skill Series", type: "video", icon: <PlayCircle size={24} />, desc: "Hướng dẫn thực hành kỹ thuật PCR trong phòng thí nghiệm." },
];

export const bioMagazineItems = [
    { id: 1, title: "Isolation and characterization of plant growth-promoting rhizobacteria", authors: "Nguyen Van A, Tran Thi B", journal: "Vietnam Journal of Biotechnology", year: "2025", vol: "Vol 23, No 1" },
    { id: 2, title: "Study on the extraction of bioactive compounds from medicinal plants", authors: "Le Van C, Pham Thi D", journal: "Journal of Science: Natural Sciences", year: "2024", vol: "Vol 15, No 4" },
    { id: 3, title: "Application of Next-Generation Sequencing in genetic diversity analysis", authors: "Hoang Minh E, Dr. Nguyen Van X", journal: "International Journal of Genomics", year: "2024", vol: "Vol 10, Issue 2" },
];

export const achievementsItems = [
    { id: 1, title: "Giải Nhất Giải thưởng Sinh viên Nghiên cứu Khoa học Euréka 2025", recipient: "Nhóm SV: Nguyễn Văn A, Trần Thị B", project: "Ứng dụng vi tảo xử lý nước thải", level: "Cấp Thành phố" },
    { id: 2, title: "Giải Nhì Hội nghị Khoa học Sinh viên Khoa SH-CNSH 2024", recipient: "Lê Văn C", project: "Nghiên cứu docking phân tử", level: "Cấp Khoa" },
    { id: 3, title: "Bài báo xuất sắc nhất Hội nghị Công nghệ Sinh học Toàn quốc", recipient: "Nhóm nghiên cứu PTN Vi sinh", project: "Probiotics tiềm năng", level: "Cấp Quốc gia" },
];

export const styles = {
    colors: {
        bg: "bg-[#EDEDED]",        // 60%
        primary: "bg-[#000033]",   // 30%
        action: "bg-[#0066CC]",    // Accent
        highlight: "bg-[#0099FF]", // Highlight
        card: "bg-white",
    },
    fonts: {
        heading: "font-['Montserrat']",
        body: "font-['Inter']",
    }
};
