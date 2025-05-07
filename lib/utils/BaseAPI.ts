import axios from 'axios';
import {AuthStorage} from "@/lib/storage";


const BaseAPI = axios.create({
    baseURL: 'https://dummyjson.com',
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
});

BaseAPI.interceptors.request.use((config) => {
    const authToken = AuthStorage.get();
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken.token}`;
    }
    return config;
});

BaseAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        // handle error + refresh token (để sau)
        return Promise.reject(error);
    }
);

export default BaseAPI;
