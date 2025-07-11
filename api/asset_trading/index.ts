import {
    AssetTradingListResponse,
    AssetTradingQueryParams,
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
    }
}

export default assetTradingAPI;