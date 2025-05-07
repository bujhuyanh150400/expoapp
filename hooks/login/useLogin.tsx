// hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import {loginService} from "@/lib/service/auth";
import {useAuthStore} from "@/lib/state/auth";
import {IReqLoginService} from "@/lib/service/auth/type";

export const useLogin = () => {
    const setAuth = useAuthStore();

    return useMutation({
        mutationFn: ({ username, password }: IReqLoginService) => loginService({username, password}),
        onSuccess: (data) => {
            const { accessToken, refreshToken, ...user } = data;
            setAuth({
                user,
                token: { accessToken, refreshToken },
            });
        },
    });
};