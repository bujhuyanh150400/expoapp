import {QuotePriceResponseType} from "@/api/socket/type";

const quote_price = "wss://ws.twelvedata.com/v1/quotes/price?apikey=be8d011480234c0cb633f6880e5930f6"

type Callback = (data: QuotePriceResponseType) => void;

export const WSQuotePriceClient = (() => {
    let socket: WebSocket | null = null;
    const callbacks: Callback[] = [];
    const subscribedSymbols = new Set<string>();

    const connect = () => {
        if (socket) return;

        socket = new WebSocket(quote_price);

        socket.onopen = () => {
            subscribedSymbols.forEach(sendSubscribe);
        };

        socket.onmessage = (event) => {
            const data: QuotePriceResponseType = JSON.parse(event.data);
            callbacks.forEach(cb => cb(data));
        };

        socket.onclose = () => {
            socket = null;
            setTimeout(connect, 3000);
        };

        socket.onerror = (err) => {
        };
    };

    const disconnect = () => {
        socket?.close();
        socket = null;
    };

    const onMessage = (callback: Callback) => {
        callbacks.push(callback);
    };

    const subscribe = (symbol: string) => {
        if (subscribedSymbols.has(symbol)) {
            console.log(`[WebSocket] Symbol ${symbol} already subscribed`);
            return;
        }
        subscribedSymbols.add(symbol);
        sendSubscribe(symbol);
    };

    const unsubscribe = (symbol: string) => {
        if (!subscribedSymbols.has(symbol)) {
            console.log(`[WebSocket] Symbol ${symbol} was not subscribed`);
            return;
        }
        subscribedSymbols.delete(symbol);
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action: 'unsubscribe', params: { symbols: symbol } }));
        }
    };
    const offMessage = (callback: Callback) => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
    };

    const sendSubscribe = (symbol: string) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action: 'subscribe', params: { symbols: symbol } }));
        }
    };

    return {
        connect,
        disconnect,
        onMessage,
        subscribe,
        unsubscribe,
        offMessage
    };
})();


