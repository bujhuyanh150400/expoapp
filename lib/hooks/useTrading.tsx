import {useQuery} from "@tanstack/react-query";
import twelveAPI from "@/api/twelveapi";
import {TimeSeriesRequest} from "@/api/twelveapi/type";
import {BATCH_SIZE_CHART_VIEW} from "@/lib/constant";
import {_TypeChart} from "@/lib/@type";
import {useEffect, useState} from "react";
import useAuthStore from "@/lib/store/authStore";
import useSubscribeSymbols from "@/api/socket/subscribeSymbols";
import useWebsocketSymbolStore from "@/api/socket/subscribeSymbols/store";
import {CandleChartType, LineChartType} from "@/components/chart/type";
import {formatDataCandleChart, formatDataLineChart, getBucketTime} from "@/lib/utils";

const updateLineChartData = (prev: LineChartType[], price: number, bucketTime: number, interval: TimeSeriesRequest['interval']): LineChartType[] => {
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
    type_chart: _TypeChart
};

const useTrading = ({symbol, interval, type_chart}: Params) => {
    const [loading, setLoading] = useState<boolean>(false);

    const authData = useAuthStore(s => s.auth_data);

    const [dataChart, setDataChart] = useState<CandleChartType[] | LineChartType[]>([]);

    const {data, isLoading, isRefetching, isError} = useQuery({
        queryKey: ['twelveAPI-timeSeries', symbol, interval, type_chart],
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
        if (data && data.length > 0) {
            if (type_chart === _TypeChart.LINE) {
                const chart = formatDataLineChart(data);
                setDataChart(chart);
            } else if (type_chart === _TypeChart.CANDLE) {
                const chart = formatDataCandleChart(data);
                setDataChart(chart);
            }
        }
    }, [data, type_chart]);

    // get realtime
    useSubscribeSymbols([symbol || ''], authData?.user?.id, authData?.user?.secret);
    const prices = useWebsocketSymbolStore((s) => s.prices);
    const priceRealtime = prices[symbol || ''];

    useEffect(() => {
        if (!priceRealtime) return;
        const price = priceRealtime.price;
        const bucketTime = getBucketTime(priceRealtime.timestamp * 1000, interval);
        setDataChart((prev) => {
            if (!prev.length) return prev;
            if (type_chart === _TypeChart.LINE) {
                return updateLineChartData(prev as LineChartType[], price, bucketTime, interval);
            } else if (type_chart === _TypeChart.CANDLE) {
                return updateCandleChartData(prev as CandleChartType[], price, bucketTime, interval);
            }
            return prev;
        });
    }, [priceRealtime, symbol, type_chart, interval]);

    return {
        loading,
        dataChart,
        priceRealtime,
        isError
    };
}

export default useTrading;