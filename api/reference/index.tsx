import {client} from "@/api/client";
import {API_KEY} from "@/lib/constant";
import {ForexPairsRequestType, ForexPairsResponse} from "@/api/reference/type";


const referenceApi = {
    /**
     * Dùng để lấy danh sách các cặp tiền tệ ngoại hối (Forex pairs)
     */
    forex_pairs: async (params: ForexPairsRequestType): Promise<ForexPairsResponse> => {
        const response = await client.get('/forex_pairs', {
            params: {
                api_key: API_KEY,
                ...params,
            }
        });
        return response.data;
    },
}

export default referenceApi;