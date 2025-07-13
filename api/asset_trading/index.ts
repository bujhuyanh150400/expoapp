import {
    AddFavoriteSymbolsRequest,
    AssetTradingListResponse,
    AssetTradingQueryParams, DeletedFavoriteSymbolsRequest, getFavoriteSymbolsResponse,
    SearchSymbolRequest,
    SearchSymbolResponse
} from "@/api/asset_trading/type";
import {client} from "@/api/client";


const defaultURI = "/asset-trading";
const assetTradingAPI = {
    list: async (params: AssetTradingQueryParams): Promise<AssetTradingListResponse> => {
        const response = await client.get(`${defaultURI}/list`, {params});
        return response.data;
    },
    searchSymbol: async (params: SearchSymbolRequest): Promise<SearchSymbolResponse> => {
        const response = await client.get(`${defaultURI}/search-symbol`, {params});
        return response.data;
    },
    getFavoriteSymbols: async (): Promise<getFavoriteSymbolsResponse> => {
        const response = await client.get(`${defaultURI}/favorite-symbols`);
        return response.data;
    },
    addFavoriteSymbolsRequest: async (data: DeletedFavoriteSymbolsRequest): Promise<getFavoriteSymbolsResponse> => {
        const response = await client.post(`${defaultURI}/favorite-symbols`, data);
        return response.data;
    },
    deletedFavoriteSymbols: async (data: DeletedFavoriteSymbolsRequest): Promise<getFavoriteSymbolsResponse> => {
        const response = await client.delete(`${defaultURI}/favorite-symbols`, {data});
        return response.data;
    },
}

export default assetTradingAPI;