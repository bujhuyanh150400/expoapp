import {ForgotPasswordRequest, LoginRequest, LoginResponse, RegisterRequest} from "@/api/auth/type";
import {client} from "@/api/client";
import {ResponseSuccessType} from "@/api/commonType";

const authAPI = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await client.post('/auth/login', data);
        return response.data;
    },
    register: async (data: RegisterRequest): Promise<ResponseSuccessType> => {
        const response = await client.post('/auth/register', data);
        return response.data;
    },
    forgotPassword: async (data: ForgotPasswordRequest): Promise<ResponseSuccessType> => {
        const response = await client.post('/auth/forgot-password', data);
        return response.data;
    }
}

export default authAPI;