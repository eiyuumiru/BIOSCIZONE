export const YEAR_LEVELS = ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', '> Năm 4'] as const;

export const ALL_YEARS = 'All';

export interface ResearchField {
    name: string;
    directions: string[];
}

export const RESEARCH_FIELDS: ResearchField[] = [
    {
        name: 'Công nghệ Thông tin',
        directions: [
            'Toán tin học',
            'Công nghệ phần mềm',
            'Khoa học máy tính',
            'Điện tử viễn thông',
            'Mạng máy tính truyền thông',
            'Trí tuệ nhân tạo',
            'Công nghệ thông tin khác',
        ],
    },
    {
        name: 'Công nghệ thực phẩm',
        directions: [
            'Công nghệ chế biến thực phẩm, đồ uống',
            'Công nghệ sau thu hoạch',
            'Công nghệ lên men',
            'Khoa học thực phẩm - Dinh dưỡng',
            'Công nghệ thực phẩm khác',
        ],
    },
    {
        name: 'Hành chính - Pháp lý',
        directions: [
            'Cải cách hành chính',
            'Quản lý nhà nước',
            'Luật Dân sự',
            'Luật Hình sự',
            'Luật Kinh tế - Luật Hành chính',
            'Luật Quốc tế',
            'Hành chính - Pháp lý khác',
        ],
    },
    {
        name: 'Hóa học',
        directions: [
            'Hóa hữu cơ',
            'Hóa vô cơ và hạt nhân',
            'Hóa lý',
            'Hóa học cao phân tử',
            'Điện hóa',
            'Hóa keo',
            'Hóa phân tích',
            'Vật liệu mới và Công nghệ nano',
            'Khoa học Hóa học khác',
        ],
    },
    {
        name: 'Khoa học Giáo dục',
        directions: [
            'Giáo dục học',
            'Quản lý giáo dục',
            'Tâm lý giáo dục',
            'Giáo dục thể chất - kỹ năng',
            'Giáo dục nâng cao chất lượng nguồn nhân lực',
            'Khoa học Giáo dục khác',
        ],
    },
    {
        name: 'Khoa học Nông nghiệp',
        directions: [
            'Trồng trọt',
            'Chăn nuôi',
            'Thú y',
            'Lâm nghiệp',
            'Thủy sản',
            'Khoa học Nông nghiệp khác',
        ],
    },
    {
        name: 'Khoa học Y, Dược',
        directions: [
            'Y học cơ sở',
            'Y học lâm sàng',
            'Y tế',
            'Dược học',
            'Y tế công cộng',
            'Khoa học Y, Dược khác',
        ],
    },
    {
        name: 'Khoa học Xã hội',
        directions: [
            'Tâm lý học',
            'Xã hội học',
            'Khoa học chính trị',
            'Địa lý kinh tế và xã hội',
            'Thông tin đại chúng và truyền thông',
            'Quan hệ quốc tế',
            'Ngôn ngữ học',
            'Công tác xã hội',
            'Triết học',
            'Khoa học Xã hội khác',
        ],
    },
    {
        name: 'Kinh tế',
        directions: [
            'Tài chính, Ngân hàng, Chứng khoán, Kế - Kiểm toán, Bảo hiểm - Tín dụng',
            'Thương mại, Quản trị kinh doanh, Marketing',
            'Kinh tế học, Kinh tế phát triển',
            'Kinh tế chính trị',
            'Khoa học Kinh tế khác',
        ],
    },
    {
        name: 'Kỹ thuật Công nghệ',
        directions: [
            'Điện, điện tử',
            'Cơ khí, tự động hoá',
            'Kỹ thuật nhiệt',
            'Công nghệ kỹ thuật ô tô',
            'Giao thông vận tải',
            'Kỹ thuật công nghệ khác',
        ],
    },
    {
        name: 'Quy hoạch, Kiến trúc và Xây dựng',
        directions: [
            'Quy hoạch',
            'Kiến trúc',
            'Xây dựng',
            'Mỹ thuật công nghiệp',
            'Quy hoạch, Kiến trúc và Xây dựng khác',
        ],
    },
    {
        name: 'Sinh học',
        directions: [
            'Sinh học lý thuyết',
            'Tế bào học, Mô phôi học',
            'Vi sinh vật học',
            'Vi rút học',
            'Hoá sinh và phương pháp nghiên cứu Hoá sinh',
            'Sinh học phân tử',
            'Sinh thái học',
            'Công nghệ Sinh học',
            'Đa dạng Sinh học',
            'Di truyền học',
            'Động vật học',
            'Thực vật học',
            'Khoa học Sinh học khác',
        ],
    },
    {
        name: 'Tài nguyên và Môi trường',
        directions: [
            'Khoa học Trái Đất',
            'Tài nguyên',
            'Môi trường',
            'Công nghệ môi trường',
            'Kỹ thuật môi trường',
            'Biến đổi khí hậu',
            'Tài nguyên và Môi trường khác',
        ],
    },
    {
        name: 'Văn hoá - Nghệ thuật',
        directions: [
            'Văn hoá học',
            'Nghệ thuật và lịch sử nghệ thuật',
            'Mỹ thuật',
            'Nghệ thuật kiến trúc',
            'Du lịch',
            'Thời trang',
            'Nhân học',
            'Dân tộc học',
            'Lịch sử',
            'Khu vực học',
            'Các vấn đề nghiên cứu Văn hoá - Nghệ thuật khác',
        ],
    },
    {
        name: 'Vật lý',
        directions: [
            'Vật lý lý thuyết',
            'Vật lý ứng dụng',
            'Vật lý hạt nhân',
            'Quang học',
            'Âm học',
            'Thiên văn học: Khoa học vũ trụ',
            'Khoa học Vật lý khác',
        ],
    },
];

export const DEFAULT_FIELD = 'Sinh học';

export function directionsOf(fieldName: string): string[] {
    return RESEARCH_FIELDS.find((field) => field.name === fieldName)?.directions ?? [];
}
