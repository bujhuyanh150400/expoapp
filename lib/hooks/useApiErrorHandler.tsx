import {FieldValues, UseFormSetError, Path} from "react-hook-form";
import {useCallback} from "react";
import ErrorAPIServer from "@/api/commonType";
import {showMessage} from "react-native-flash-message";

type Params<T extends FieldValues> = {
    error: unknown;
    setError?: UseFormSetError<T>;
};
export default function useApiErrorHandler<T extends FieldValues>() {
    return useCallback(({ error, setError }: Params<T>) => {
        if (error instanceof ErrorAPIServer) {
            if (error.validateError && setError) {
                const validationErrors = error.validateError;
                Object.entries(validationErrors).forEach(([field, messages]) => {
                    setError(field as Path<T>, {
                        type: 'validate',
                        message: messages[0],
                    });
                });
            } else if (error.message) {
                showMessage({
                    message: error.message,
                    type: 'danger',
                    duration: 3000,
                });
            }
        } else {
            showMessage({
                message: 'Đã xảy ra lỗi không xác định, vui lòng thử lại sau',
                type: 'danger',
                duration: 3000,
            });
        }
    }, []);
}