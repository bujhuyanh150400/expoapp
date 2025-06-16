import {client} from "@/api/client";
import {API_KEY} from "@/lib/constant";
import {TimeSeriesResponse} from "@/api/core_data/type";
import axios from "axios";
import {_Timeframe} from "@/lib/@type";


const coreDataApi = {
    time_series: async (params: {symbol: string, interval: _Timeframe}): Promise<TimeSeriesResponse> => {
        const response = await axios.get('https://api.twelvedata.com/time_series', {
            params: {
                apikey: 'be8d011480234c0cb633f6880e5930f6',
                symbol: params.symbol,
                interval: params.interval,
                order: 'ASC',
                outputsize: 150
            }
        });
        return response.data;
    },
}

export default coreDataApi;