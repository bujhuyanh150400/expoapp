import {AssetTradingListResponse, AssetTradingQueryParams} from "@/api/asset_trading/type";
import {client} from "@/api/client";

const assetTradingAPI = {
    list: async (params: AssetTradingQueryParams): Promise<AssetTradingListResponse> => {
        const response = await client.get('/assert-trading/list', {params});
        return response.data;
    }
}

export default assetTradingAPI;