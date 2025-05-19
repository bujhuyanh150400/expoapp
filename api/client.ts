import {BACKEND_API_URL} from "@/lib/constant";
import axios from "axios";
import {SECURE_AUTH_TOKEN} from "@/lib/storage/key";
import ErrorAPIServer, {_HTTPStatus, ILaravelValidationErrors} from "@/api/commonType";
import secureStore from "@/lib/storage/secure";

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
        const token = await secureStore.getItem(SECURE_AUTH_TOKEN);
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
    (response) => response,
    (error) => {
        const errorResponse = error.response;
        const errorData = error.response?.data;
        //Nếu có lỗi trả ra từ server
        if (errorResponse && errorData) {
            let messageError: string | null | undefined = errorData.message;
            let statusCodeResponse: number | null | undefined = errorResponse?.status;

            if (!messageError) messageError = "Đã xảy ra lỗi, vui lòng liên hệ quản trị viên để được hỗ trợ.";
            if (!statusCodeResponse) statusCodeResponse = 0;
            if (statusCodeResponse === _HTTPStatus.VALIDATE_FAILED_REQUEST) {
                const errorValidate: ILaravelValidationErrors = errorData.errors;
                return Promise.reject(new ErrorAPIServer(statusCodeResponse, messageError, errorResponse, errorValidate));
            } else {
                return Promise.reject(new ErrorAPIServer(statusCodeResponse, messageError, errorResponse));
            }
        } else if (error.request) {
            return Promise.reject(
                new ErrorAPIServer(
                    _HTTPStatus.BAD_REQUEST,
                    'Không nhận được phản hồi từ máy chủ, vui lòng liên hệ quản trị viên để được hỗ trợ',
                    errorResponse
                )
            );
        } else {
            return Promise.reject(
                new ErrorAPIServer(
                    _HTTPStatus.INTERNAL_SERVER_ERROR,
                    'Đã xảy ra lỗi, vui lòng liên hệ quản trị viên để được hỗ trợ.',
                    errorResponse
                )
            );
        }
    }
);


