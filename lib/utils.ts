import dayjs from "dayjs";
import {TimeSeriesItem} from "@/api/twelveapi/type";
import {CandleChartType, LineChartType} from "@/components/chart/type";

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

export const formatDataLineChart = (data: TimeSeriesItem[]): LineChartType[] => {
    return data.reduce((acc, c) => {
        const timestamp = new Date(c.datetime.date).getTime();
        const close = parseFloat(c.close);
        acc.push({timestamp, value: close});
        return acc;
    }, [] as LineChartType[])
}

export const formatDataCandleChart = (data: TimeSeriesItem[]): CandleChartType[] => {
    return data.reduce((acc, c) => {
        const timestamp = new Date(c.datetime.date).getTime();
        const open = parseFloat(c.open);
        const high = parseFloat(c.high);
        const low = parseFloat(c.low);
        const close = parseFloat(c.close);
        acc.push({ timestamp, open, high, low, close });
        return acc;
    }, [] as CandleChartType[])
}