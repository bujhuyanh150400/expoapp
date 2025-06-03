import {
    ForgotPasswordRequest,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    VerifyCodeRequest,
    ResetPasswordRequest, UserLogin, VerifyUserRequest
} from "@/api/auth/type";
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
    },
    verifyCode: async (data: VerifyCodeRequest): Promise<ResponseSuccessType> => {
        const response = await client.post('/auth/verify-code', data);
        return response.data;
    },
    resetPassword: async (data: ResetPasswordRequest): Promise<ResponseSuccessType> => {
        const response = await client.post('/auth/reset-password', data);
        return response.data;
    },
    userProfile: async () : Promise<UserLogin> => {
        const response = await client.get('/auth/user-profile');
        return response.data;
    },
    verifyAccount: async (data: VerifyUserRequest): Promise<ResponseSuccessType>  =>  {
        const response = await client.post('/auth/verify-account', data);
        return response.data;
    }
}

export default authAPI;