import dayjs from "dayjs";

export const formatMessageTime = (createdAt: string) => {
    const created = dayjs(createdAt);
    const now = dayjs();

    const diffInDays = now.diff(created, 'day');

    if (diffInDays > 1) {
        // Quá 1 ngày → hiển thị ngày/tháng/năm
        return created.format('DD/MM/YYYY');
    } else {
        // Trong hôm nay hoặc hôm qua → chỉ hiện giờ
        return created.format('HH:mm');
    }
};