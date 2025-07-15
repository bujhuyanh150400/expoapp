import dayjs from "dayjs";
import {TimeSeriesItem} from "@/api/twelveapi/type";
import {CandleChartType, LineChartType} from "@/components/chart/type";
import {_Timeframe} from "@/lib/@type";

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
        acc.push({timestamp, open, high, low, close});
        return acc;
    }, [] as CandleChartType[])
}

export const getBucketTime = (timestamp: number, timeframe: _Timeframe): number => {
    const minutesMap: Record<_Timeframe, number> = {
        [_Timeframe.OneMinute]: 1,
        [_Timeframe.FiveMinute]: 5,
        [_Timeframe.FifteenMinutes]: 15,
        [_Timeframe.ThirtyMinutes]: 30,
        [_Timeframe.FortyFiveMinutes]: 45,
        [_Timeframe.OneHour]: 60,
        [_Timeframe.OneDay]: 1440,
        [_Timeframe.OneWeek]: 10080,
    };
    const bucketMinutes = minutesMap[timeframe] || 1;
    const bucketMs = bucketMinutes * 60 * 1000;
    return Math.floor(timestamp / bucketMs) * bucketMs;
}

export const calculateBidAskSpread = (price: number, spread: string) => {
    const floatSpread = parseFloat(spread);
    if (floatSpread) {
        const bid = +(price - floatSpread / 2).toFixed(5); // SELL
        const ask = +(price + floatSpread / 2).toFixed(5); // BUY
        return {bid, ask, spread};
    } else {
        return {bid: 0, ask: 0, spread};
    }

}