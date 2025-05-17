import {BACKEND_API_URL} from "@/lib/constant";
import axios from "axios";
import storage from "@/lib/storage";
import {AUTH_TOKEN} from "@/lib/storage/key";

export const client = axios.create({
    baseURL: BACKEND_API_URL,
    timeout: 10000, // Set a timeout for requests
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
client.interceptors.request.use(
    async (config) => {
        // Add authorization token if available
        const token = await storage.getItem(AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
client.interceptors.response.use(
    (response) => {
        // Handle successful response
        return response;
    },
    (error) => {
        // Handle response errors
        if (error.response?.status === 401) {
            // Handle unauthorized error (e.g., redirect to login)
            console.error("Unauthorized! Redirecting to login...");
        }
        return Promise.reject(error);
    }
);
