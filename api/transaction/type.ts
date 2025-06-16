import {_TradeType} from "@/lib/@type";

export type StoreTransactionRequestType = {
    account_id: number;
    currency: string;
    symbol: string;
    type: _TradeType;
    number: string;
    price_buy?: number | null;
    price_sell?: number | null;
}