import {create} from 'zustand';
import {SECURE_AUTH_TOKEN, SECURE_PIN_CODE} from "@/lib/storage/key";
import {_AuthStatus} from "@/lib/@type";
import {LoginResponse} from "@/api/auth/type";
import secureStore from "@/lib/storage/secure";


interface IAuthState {
    status: _AuthStatus;
    auth_data: LoginResponse | null;
    pin_code: string | null;
    setAuthData: (data: LoginResponse) => void;
    login: (data: string) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
    verify: () => void;
    unVerify: () => void;
}

const useAuthStore = create<IAuthState>((set, get) => ({
    /**
     * State
     */
    status: _AuthStatus.UNAUTHORIZED,
    auth_data: null,
    pin_code: null,
    /**
     * Method
     */
    setAuthData: (data: LoginResponse) => {
        set({auth_data: data});
    },
    login: async  (pinData) => {
        const {auth_data} = get();
        if (!auth_data) {
            throw new Error('Login data is not set');
        }
        await secureStore.setItem<string>(SECURE_PIN_CODE,pinData);
        await secureStore.setItem<LoginResponse>(SECURE_AUTH_TOKEN, auth_data)
        set({status: _AuthStatus.AUTHORIZED, auth_data: auth_data});
    },
    logout: async () => {
        await secureStore.removeItem(SECURE_PIN_CODE)
        await secureStore.removeItem(SECURE_AUTH_TOKEN)
        set({
            status: _AuthStatus.UNAUTHORIZED,
            auth_data: null,
            pin_code: null
        });
    },
    hydrate: async () => {
        const authData =await secureStore.getItem<LoginResponse>(SECURE_AUTH_TOKEN);
        const pinData =await secureStore.getItem<string>(SECURE_PIN_CODE);

        if (authData && pinData) {
            set({
                status: _AuthStatus.NEED_ACCESS_PIN,
                auth_data: authData,
                pin_code: pinData
            });
        } else {
            set({
                status: _AuthStatus.UNAUTHORIZED,
                auth_data: null,
                pin_code: null
            });
        }
    },

    verify: () => {
        set({status: _AuthStatus.AUTHORIZED})
    },
    unVerify : () => {
        set({status: _AuthStatus.NEED_ACCESS_PIN})
    }
}));

export default useAuthStore