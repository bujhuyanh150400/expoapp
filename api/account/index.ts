import {client} from "@/api/client";
import {AccountTypeListResponse, CreateAccountRequest, CurrencyResponse, LeverResponse} from "@/api/account/type";


const accountAPI = {
    currencies:  async (): Promise<CurrencyResponse> => {
        const response = await client.get('/currencies');
        return response.data;
    },
    levers: async (): Promise<LeverResponse> => {
        const response = await client.get('/levers');
        return response.data;
    },
    accountTypeList: async (): Promise<AccountTypeListResponse> => {
        const response = await client.get('/account-types/list');
        return response.data;
    },
    createAccount: async (data: CreateAccountRequest): Promise<any> => {
        const response = await client.post('/create-account', data);
        return response.data;
    },
}

export default accountAPI;