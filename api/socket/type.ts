
export type QuotePriceResponseType = {
    "event": string,
    "symbol": string,
    "currency": string,
    "exchange": string,
    "type": string,
    "timestamp": number,
    "price":  string, // ?? chưa rõ lắm
    "day_volume": number | null
}