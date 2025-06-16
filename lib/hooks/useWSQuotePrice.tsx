import {useEffect, useState} from "react";
import {WSQuotePriceClient} from "@/api/socket";
import {QuotePriceResponseType} from "@/api/socket/type";

const useWSQuotePrice = (symbol: string): QuotePriceResponseType | null => {
    const [realtimeData, setRealtimeData] = useState<QuotePriceResponseType | null>(null);
    useEffect(() => {
        WSQuotePriceClient.connect();
        WSQuotePriceClient.subscribe(symbol);
        const handle = (data: QuotePriceResponseType) => {
            if (data.symbol === symbol && data.event === 'price') {
                setRealtimeData(data);
            }
        }
        WSQuotePriceClient.onMessage(handle);
        return () => {
            WSQuotePriceClient.unsubscribe(symbol);
            WSQuotePriceClient.offMessage(handle);
        };
    }, [symbol]);

    return realtimeData;
}

export default useWSQuotePrice;