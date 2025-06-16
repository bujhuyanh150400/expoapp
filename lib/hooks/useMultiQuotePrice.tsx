import { useEffect, useRef, useState } from 'react';
import { QuotePriceResponseType } from '@/api/socket/type';
import {WSQuotePriceClient} from "@/api/socket";

type QuotePriceMap = Record<string, QuotePriceResponseType | null>;

export const useMultiQuotePrice = (symbols: string[]) => {
    const [prices, setPrices] = useState<QuotePriceMap>(() => {
        const initial: QuotePriceMap = {};
        symbols.forEach(symbol => {
            initial[symbol] = null;
        });
        return initial;
    });

    const symbolsRef = useRef<string[]>(symbols);

    useEffect(() => {
        symbolsRef.current = symbols;
        WSQuotePriceClient.connect();

        // Subscribe
        if (symbols.length > 0){
            symbols.forEach(symbol => {
                WSQuotePriceClient.subscribe(symbol);
            });
        }

        const handle = (data: QuotePriceResponseType) => {
            if (symbolsRef.current.includes(data.symbol)) {
                setPrices(prev => ({
                    ...prev,
                    [data.symbol]: data,
                }));
            }
        };

        WSQuotePriceClient.onMessage(handle);

        return () => {
            symbols.forEach(symbol => {
                WSQuotePriceClient.unsubscribe(symbol);
            });
            WSQuotePriceClient.offMessage(handle);
        };
    }, [JSON.stringify(symbols)]); // đảm bảo useEffect re-run khi danh sách thay đổi

    return prices;
};
