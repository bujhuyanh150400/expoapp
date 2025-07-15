import {useQuery} from "@tanstack/react-query";
import twelveAPI from "@/api/twelveapi";
import {TimeSeriesRequest} from "@/api/twelveapi/type";
import {BATCH_SIZE_CHART_VIEW} from "@/lib/constant";
import {_TypeChart} from "@/lib/@type";
import {useEffect, useRef, useState} from "react";
import useAuthStore from "@/lib/store/authStore";
import useSubscribeSymbols from "@/api/socket/subscribeSymbols";
import useWebsocketSymbolStore from "@/api/socket/subscribeSymbols/store";
import {CandleChartType, LineChartType} from "@/components/chart/type";
import {formatDataCandleChart, formatDataLineChart, getBucketTime} from "@/lib/utils";
import {throttle} from "lodash";
import { shallow } from 'zustand/shallow';
const updateLineChartData = (prev: LineChartType[], price: number, bucketTime: number, interval: TimeSeriesRequest['interval']): LineChartType[] => {
    if (!prev.length) return prev;
    const last = prev[prev.length - 1];
    const lastBucket = getBucketTime(last.timestamp, interval);
    if (bucketTime === lastBucket) {
        const updated = {...last, value: price};
        return [...prev.slice(0, -1), updated];
    } else if (bucketTime > lastBucket) {
        return [...prev, {timestamp: bucketTime, value: price}];
    }
    return prev;
};

const updateCandleChartData = (prev: CandleChartType[], price: number, bucketTime: number, interval: TimeSeriesRequest['interval']): CandleChartType[] => {
    if (!prev.length) return prev;
    const last = prev[prev.length - 1];
    const lastBucket = getBucketTime(last.timestamp, interval);
    if (bucketTime === lastBucket) {
        const updated = {
            ...last,
            high: Math.max(last.high, price),
            low: Math.min(last.low, price),
            close: price,
        };
        return [...prev.slice(0, -1), updated];
    } else if (bucketTime > lastBucket) {
        const newCandle: CandleChartType = {
            timestamp: bucketTime,
            open: price,
            high: price,
            low: price,
            close: price,
        };
        return [...prev, newCandle];
    }
    return prev;
};

type Params = {
    symbol?: string;
    interval: TimeSeriesRequest['interval'];
};

const useTrading = ({symbol, interval}: Params) => {
    const [loading, setLoading] = useState<boolean>(false);

    const authData = useAuthStore(s => s.auth_data);

    const chartCandleRef = useRef<CandleChartType[]>([]);
    const chartLineRef = useRef<LineChartType[]>([]);

    const {data, isLoading, isRefetching, isError} = useQuery({
        queryKey: ['twelveAPI-timeSeries', symbol, interval],
        enabled: !!symbol,
        queryFn: async () => {
            return await twelveAPI.timeSeries({
                symbol: symbol || '',
                interval,
                outputsize: BATCH_SIZE_CHART_VIEW,
                order: 'ASC',
            });
        },
        select: (res) => res.values ?? [],
    });

    // set loading
    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isLoading, isRefetching]);

    // set data
    useEffect(() => {
        if (!data || !data.length) return;
        chartCandleRef.current = formatDataCandleChart(data);
        chartLineRef.current = formatDataLineChart(data);
    }, [data]);

    // get realtime
    useSubscribeSymbols([symbol || ''], authData?.user?.id, authData?.user?.secret);
    const priceRealtime = useWebsocketSymbolStore(s => s.prices[symbol || '']);

    useEffect(() => {
        if (!priceRealtime) return;
        const price = priceRealtime.price;
        const bucketTime = getBucketTime(priceRealtime.timestamp * 1000, interval);

        chartLineRef.current = updateLineChartData(chartLineRef.current, price, bucketTime, interval);
        chartCandleRef.current = updateCandleChartData(chartCandleRef.current, price, bucketTime, interval);

    }, [priceRealtime, symbol, interval]);

    return {
        loading,
        lineData: chartLineRef.current,
        candleData: chartCandleRef.current,
        priceRealtime,
        isError
    };
}

export default useTrading;