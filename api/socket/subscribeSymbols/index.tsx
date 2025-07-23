import useSubscribeSymbolStore from "@/api/socket/subscribeSymbols/store";
import {useContext, useEffect, useRef} from "react";
import {WebSocketContext} from "@/api/socket/provider";


const useSubscribeSymbols = (symbols: string[], userId?: number, secret?: string, enable:boolean = true) => {
    const ws = useContext(WebSocketContext);
    const { updatePrice, setSubscribedSymbols } = useSubscribeSymbolStore();
    const mountedSymbols = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        if (!userId || !secret) return;
        symbols.filter(s => s.trim() !== "")
        const toSub = symbols.filter((s) => !mountedSymbols.current.has(s));
        const toUnsub = Array.from(mountedSymbols.current).filter((s) => !symbols.includes(s));
        // Gửi subscribe
        if (toSub.length > 0 && enable) {
            ws.send(
                JSON.stringify({
                    action: 'subscribe',
                    params: { user_id: userId, secret, symbols: toSub.join(',') },
                })
            );
        }
        // Gửi unsubscribe
        if (toUnsub.length > 0) {
            ws.send(
                JSON.stringify({
                    action: 'unsubscribe',
                    params: { user_id: userId, secret, symbols: toUnsub.join(',') },
                })
            );
        }
        mountedSymbols.current = new Set(symbols);
        setSubscribedSymbols(new Set(symbols));
    }, [ws, userId, secret, symbols.join(','), enable]);


    useEffect(() => {
        if (!ws) return;
        const handler = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (data.symbol && data.price) {
                    updatePrice({
                        symbol: data.symbol,
                        timestamp: data.timestamp,
                        price: parseFloat(data.price),
                        percent: data.percent ?? null,
                    });
                }
            } catch (err) {
                console.log('Invalid message:', event.data);
            }
        };

        ws.addEventListener('message', handler);
        return () => {
            ws.removeEventListener('message', handler);
        };
    }, [ws]);
}
export default useSubscribeSymbols;