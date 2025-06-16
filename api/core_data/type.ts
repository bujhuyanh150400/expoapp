import {_Timeframe} from "@/lib/@type";

/**
 * Time series data request types
 */

export type MetaDataTimeSeries = {
    "symbol": string,
    "interval": string,
    "currency_base": string,
    "currency_quote": string,
    "exchange": string,
    "type": string
};
export type TimeSeriesValue = {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string | null;
};

export type TimeSeriesResponse = {
    meta: MetaDataTimeSeries;
    values: TimeSeriesValue[];
    status: string;
};
