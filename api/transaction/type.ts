import {_TradeType, _TransactionTriggerType} from "@/lib/@type";

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