import {_AssetType} from "@/lib/@type";

export type AssetTradingQueryParams = {
    type?: _AssetType;
    keyword?: string;
    favorite?: boolean;
    per_page?: number;
    page?: number;
};

export type AssetTrading = {
    id: number;
    symbol: string;
    name: string | null;
    currency_base: string | null;
    currency_quote: string | null;
    available_exchanges: string[] | null;
    category: string | null;
    type: number;
    favorite: number;
    created_at: string;
    updated_at: string;
};

export type AssetTradingListResponse = {
    data: AssetTrading[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};