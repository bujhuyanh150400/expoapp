import {Transaction} from "@/api/transaction/type";
import {useMemo} from "react";
import useAuthStore from "@/lib/store/authStore";
import useSubscribeSymbols from "@/api/socket/subscribeSymbols";
import useWebsocketSymbolStore from "@/api/socket/subscribeSymbols/store";

export type CalculateTransactionPrices = Transaction & {
    profit?: number;
    realtime_price?: number;
    entry_volume_price?: number;
    realtime_volume_price?: number;
}

const useCalculateTransactionPrices = (transaction: Transaction[], enable: boolean) => {
    const authData = useAuthStore(s => s.auth_data);

    const listSymbol = useMemo(() => {
        return (transaction && Array.isArray(transaction) && transaction.length > 0) ? transaction.map(item => item.symbol.symbol) : [] as string[];
    }, [transaction]);

    useSubscribeSymbols(listSymbol,authData?.user?.id,authData?.user?.secret, enable);

    const prices = useWebsocketSymbolStore((s) => s.prices);

    return transaction.reduce((acc, item) => {
        const symbolPrice = prices[item.symbol.symbol];
        if (symbolPrice) {
            const entryVolumePrice = item.entry_price * item.volume;
            const realtimeVolumePrice = symbolPrice.price * item.volume;
            const profit = (realtimeVolumePrice - entryVolumePrice);
            acc.total += profit;
            acc.data.push({
                ...item,
                profit: profit,
                realtime_price: symbolPrice.price,
                entry_volume_price: entryVolumePrice,
                realtime_volume_price: realtimeVolumePrice,
            });
        }
        return acc;
    }, {
        total: 0,
        data: [] as CalculateTransactionPrices[]
    })
}

export default useCalculateTransactionPrices;