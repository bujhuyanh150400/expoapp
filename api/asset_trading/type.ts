import {_AssetType} from "@/lib/@type";

export type Symbol = {
    'id': number,
    'symbol': string,
    'currency_base': string,
    'currency_quote': string| null,
    'type': _AssetType
}

export type AssetTradingQueryParams = {
    type?: _AssetType;
};

export type AssetTradingListResponse = {
    data: Symbol[];
    message:string;
};

export type SearchSymbolRequest = {
    keyword?:string;
    page?: number;
}

export type SearchSymbolResponse = {
    data: Symbol[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export type getFavoriteSymbolsResponse = {
    data: Symbol[];
    message:string;
}

export type AddFavoriteSymbolsRequest = DeletedFavoriteSymbolsRequest

export type DeletedFavoriteSymbolsRequest = {
    asset_trading_id: number
}