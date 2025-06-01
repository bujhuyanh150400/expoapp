/**
 * forex_pairs
 */
export type ForexPairsRequestType = {
    symbol?: string;           // filter theo symbol, ví dụ "EUR/USD"
    currencyBase?: string;    // filter theo base currency, ví dụ "EUR"
    currencyQuote?: string;   // filter theo quote currency, ví dụ "USD"
}
export interface IForexPair {
    symbol: string;            // ví dụ "EUR/USD"
    currencyGroup: string; // nhóm tiền tệ, ví dụ "EUR/USD"
    currencyBase: string;     // ví dụ "EUR"
    currencyQuote: string;    // ví dụ "USD"
}
export type ForexPairsResponse = {
    data: IForexPair[];
    status: string;
}