import {client} from "@/api/client";
import {StoreTransactionRequestType} from "@/api/transaction/type";
import {ResponseSuccessType} from "@/api/commonType";

const prefix = '/transaction';
const transactionAPI = {
    store: async (data: StoreTransactionRequestType): Promise<ResponseSuccessType> => {
        const response = await client.post(`${prefix}/store`, data);
        return response.data;
    },
}
export default transactionAPI