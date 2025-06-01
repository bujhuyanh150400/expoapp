import {client} from "@/api/client";
import {API_KEY} from "@/lib/constant";
import {TimeSeriesRequest, TimeSeriesResponse} from "@/api/core_data/type";


const coreDataApi = {
    /**
     * Dung để lấy dữ liệu chuỗi thời gian (time series data)
     */
    time_series: async (params: TimeSeriesRequest): Promise<TimeSeriesResponse> => {
        const response = await client.get('/time_series', {
            params: {
                api_key: API_KEY,
                ...params,
            }
        });
        return response.data;
    },
}

export default coreDataApi;