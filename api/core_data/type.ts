import {_Timeframe} from "@/lib/@type";

/**
 * Time series data request types
 */
export type TimeSeriesRequest = {
    symbol: string;                             // eg: "EUR/USD"
    interval?: _Timeframe;                          // eg: "1min", "1day", "1month", etc.
    figi?: string;
    exchange?: string;
    mic_code?: string;
    country?: string;
    type?: string;
    outputSize?: string;                        // number of data points
    delimiter?: string;
    prepost?: 'true' | 'false';
    dp?: number;                                // decimal precision
    order?: 'asc' | 'desc';
    timezone?: string;
    date?: string;                              // 'YYYY-MM-DD'
    start_date?: string;                        // 'YYYY-MM-DD hh:mm:ss'
    end_date?: string;                          // 'YYYY-MM-DD hh:mm:ss'
    previous_close?: 'true' | 'false';
    adjust?: string;                            // eg: "splits,dividends"
}
type MetaDataTimeSeries = {
    symbol: string;
    interval: string;
    currency: string | null;
    exchangeTimezone: string | null;
    exchange: string | null;
    micCode: string | null;
    currencyBase: string;
    currencyQuote: string;
    type: string;
};
export type TimeSeriesValue = {
    datetime: {
        date: string; // ISO format string: "2025-05-30 00:00:00.000000"
        timezone_type: number; // usually 3
        timezone: string; // e.g., "UTC"
    };
    open: string;  // giá trị dạng string
    high: string;
    low: string;
    close: string;
    volume: string | null;
};

export type TimeSeriesResponse = {
    meta: MetaDataTimeSeries;
    values: TimeSeriesValue[];
    status: string; // e.g., "ok"
};
