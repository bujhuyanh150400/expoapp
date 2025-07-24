import {client} from "@/api/client";
import {
    StoreTransactionRequestType,
    StoreTransactionResponseType,
    TotalTransactionRequestType,
    TransactionClosedRequestType,
    TransactionHistoryRequestType,
    TransactionHistoryResponseType
} from "@/api/transaction/type";
import {ResponseSuccessType} from "@/api/commonType";

const prefix = '/transaction';
const transactionAPI = {
    store: async (data: StoreTransactionRequestType): Promise<ResponseSuccessType> => {
        const response = await client.post(`${prefix}/store`, data);
        return response.data;
    },
    total: async (data: TotalTransactionRequestType): Promise<StoreTransactionResponseType> => {
        const response = await client.get(`${prefix}/total/${data.account_id}`);
        return response.data;
    },
    history: async (data: TransactionHistoryRequestType): Promise<TransactionHistoryResponseType> => {
        const response = await client.get(`${prefix}/history/${data.account_id}`, {
            params: {
                status: data.status,
            }
        });
        return response.data;
    },
    closed: async (data: TransactionClosedRequestType): Promise<ResponseSuccessType> => {
        const response = await client.post(`${prefix}/close`, data);
        return response.data;
    },
}
export default transactionAPI