import {_TradeType, _TransactionStatus, _TransactionTriggerType} from "@/lib/@type";
import {Symbol} from "@/api/asset_trading/type";


export type StoreTransactionRequestType = {
    account_id: number;
    asset_trading_id: number;
    type: _TradeType;
    type_trigger: _TransactionTriggerType,
    volume: string;
    entry_price: string;
    trigger_price?: string;
    percent_take_profit?: string;
    percent_stop_loss?: string;
}

export type TotalTransactionRequestType = {
    account_id: number;
}

export type StoreTransactionResponseType = {
    "message": string,
    "data": {
        "open": number,
        "waiting": number,
        "close": number
    }
}

export type Transaction = {
    "id": number,
    "type": _TradeType,
    "volume": number,
    "type_trigger": _TransactionTriggerType,
    "entry_price": number,
    "close_price": number | null,
    "trigger_price": number | null,
    "take_profit": number | null,
    "stop_loss": number | null,
    "status": _TransactionStatus,
    "open_at": string | null, // ISO 8601 format
    "trigger_at": string | null, // ISO 8601 format
    "close_at": string | null, // ISO 8601 format
    symbol: Symbol
}

export type TransactionHistoryRequestType = {
    account_id: number;
    status: _TransactionStatus;
}

export type TransactionHistoryResponseType = {
    message: string,
    data: Transaction[]
}