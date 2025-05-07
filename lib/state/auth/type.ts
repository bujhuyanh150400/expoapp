import {IAuthToken, IUserAuth} from "@/lib/service/auth/type";


export interface IAuthState {
    user: IUserAuth | null;
    token: IAuthToken | null;
    setAuth: (data: {
        user: IUserAuth;
        token: IAuthToken;
    }) => void;
    logout: () => void;
}