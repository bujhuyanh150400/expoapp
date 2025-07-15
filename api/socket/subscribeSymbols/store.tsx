import { create } from 'zustand';

type SymbolPrice = {
    symbol: string;
    timestamp: number;
    price: number;
    percent: number | null;
};

type WebsocketSymbolStoreType = {
    prices: Record<string, SymbolPrice>;
    subscribedSymbols: Set<string>;
    updatePrice: (data: SymbolPrice) => void;
    setSubscribedSymbols: (symbols: Set<string>) => void;
};

export const useWebsocketSymbolStore = create<WebsocketSymbolStoreType>((set) => ({
    prices: {},
    subscribedSymbols: new Set(),
    updatePrice: (data) =>
        set((s) => ({
            prices: { ...s.prices, [data.symbol]: data },
        })),
    setSubscribedSymbols: (symbols) => set({ subscribedSymbols: new Set(symbols) }),
}));
export default useWebsocketSymbolStore;
