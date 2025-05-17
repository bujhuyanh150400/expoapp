import {LoginRequest, LoginResponse} from "@/api/auth/type";
import {client} from "@/api/client";


const authAPI = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await client.post('/auth/login', {
            username: 'emilys',
            password: 'emilyspass',
        });
        return response.data;
    }
}

export default authAPI;