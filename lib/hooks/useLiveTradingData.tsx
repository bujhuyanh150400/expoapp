import {_Timeframe} from "@/lib/@type";
import {CandleChartType, LineChartType} from "@/components/chart/type";
import {useEffect, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import coreDataApi from "@/api/core_data";
import {QuotePriceResponseType} from "@/api/socket/type";
import {MetaDataTimeSeries} from "@/api/core_data/type";
import useWSQuotePrice from "@/lib/hooks/useWSQuotePrice";

// function tính toán thời gian bucket
const getBucketTime = (timestamp: number, timeframe: _Timeframe): number => {
    const minutesMap: Record<_Timeframe, number> = {
        [_Timeframe.OneMinute]: 1,
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

const useLiveTradingData = (symbol?: string, timeframe: _Timeframe = _Timeframe.OneMinute) => {
    const [candles, setCandles] = useState<CandleChartType[]>([]);
    const [lines,setLines] = useState<LineChartType[]>([]);
    const [meta, setMeta] = useState<MetaDataTimeSeries | null>(null)
    const lastCandleRef = useRef<CandleChartType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const {data: history, isLoading, isRefetching, error} = useQuery({
        queryKey: ['coreDataApi-time_series', symbol, timeframe],
        enabled: !!symbol,
        queryFn: async () => {
            const res = await coreDataApi.time_series({
                symbol: symbol || '',
                interval: timeframe
            });
            const { lineChart, candleChart } = res.values.reduce((acc, c) => {
                const timestamp = new Date(c.datetime).getTime();
                const open = parseFloat(c.open);
                const high = parseFloat(c.high);
                const low = parseFloat(c.low);
                const close = parseFloat(c.close);
                if ([open, high, low, close].some(isNaN)) return acc;
                acc.candleChart.push({ timestamp, open, high, low, close });
                acc.lineChart.push({ timestamp, value: close });
                return acc;
            }, {
                candleChart: [] as CandleChartType[],
                lineChart: [] as LineChartType[],
            });
            return {
                meta: res.meta,
                candles: candleChart,
                lines: lineChart
            };
        },
    });

    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isLoading, isRefetching]);

    // Sync state after query
    useEffect(() => {
        if (history && history.candles.length > 0 && history.lines.length > 0) {
            setCandles(history.candles);
            setLines(history.lines);
            setMeta(history.meta);
            lastCandleRef.current = history.candles[history.candles.length - 1];
        }
    }, [history]);

    const dataRealtime = symbol ? useWSQuotePrice(symbol) : null;
    useEffect(() => {
        if (!dataRealtime) return;

        const price = parseFloat(dataRealtime.price);
        const bucketTime = getBucketTime(dataRealtime.timestamp * 1000, timeframe);

        // Update candles
        setCandles((prev) => {
            if (!prev.length) return prev;
            const last = prev[prev.length - 1];
            const lastBucket = getBucketTime(last.timestamp, timeframe);
            if (bucketTime === lastBucket) {
                const updated = {
                    ...last,
                    high: Math.max(last.high, price),
                    low: Math.min(last.low, price),
                    close: price,
                };
                lastCandleRef.current = updated;
                return [...prev.slice(0, -1), updated];
            } else if (bucketTime > lastBucket) {
                const newCandle = {
                    timestamp: bucketTime,
                    open: price,
                    high: price,
                    low: price,
                    close: price,
                };
                lastCandleRef.current = newCandle;
                return [...prev, newCandle];
            }
            return prev;
        });

        // Update lines
        setLines((prev) => {
            if (!prev.length) return prev;
            const last = prev[prev.length - 1];
            const lastBucket = getBucketTime(last.timestamp, timeframe);
            if (bucketTime === lastBucket) {
                const updated = { ...last, value: price };
                return [...prev.slice(0, -1), updated];
            } else if (bucketTime > lastBucket) {
                const newPoint = { timestamp: bucketTime, value: price };
                return [...prev, newPoint];
            }
            return prev;
        });

    }, [dataRealtime, symbol, timeframe]);

    return {
        meta,
        lines,
        candles,
        loading,
        error,
    };
}
export default useLiveTradingData;