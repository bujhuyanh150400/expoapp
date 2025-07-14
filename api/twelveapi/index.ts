import {TimeSeriesRequest, TimeSeriesResponse} from "@/api/twelveapi/type";
import {client} from "@/api/client";

const twelveAPI = {
    timeSeries: async (params: TimeSeriesRequest): Promise<TimeSeriesResponse> => {
        const response = await client.get('/time_series', {params});
        return response.data;
    }
}
export default twelveAPI;