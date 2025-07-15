import {_Timeframe} from "@/lib/@type";


export type TimeSeriesRequest = {
    symbol: string,
    interval: _Timeframe,
    outputsize: number,
    order: 'ASC' | 'DESC',
    startdate?: string,
    enddate?: string
}


export type TimeSeriesResponse = {
    meta: {
        symbol: string;
        interval: string;
        currency: string | null;
        exchangeTimezone: string | null;
        exchange: string;
        micCode: string | null;
        currencyBase: string;
        currencyQuote: string;
        type: string;
    };
    values: TimeSeriesItem[];
    status: string;
};

export type TimeSeriesItem = {
    datetime: {
        date: string; // ISO format "2025-07-14 10:37:00.000000"
        timezone_type: number;
        timezone: string; // e.g., "UTC"
    };
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string | null;
};
