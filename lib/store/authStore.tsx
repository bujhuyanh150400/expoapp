import {create} from 'zustand';
import {SECURE_AUTH_TOKEN} from "@/lib/storage/key";
import {_AuthStatus} from "@/lib/@type";
import {LoginResponse} from "@/api/auth/type";
import secureStore from "@/lib/storage/secure";


interface AuthState {
    auth_data: LoginResponse | null;
    status: _AuthStatus;
    login: (data: LoginResponse) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
    status: _AuthStatus.UNAUTHORIZED,
    auth_data: null,
    login: async (data) => {
        await secureStore.setItem<LoginResponse>(SECURE_AUTH_TOKEN, data)
        set({status: _AuthStatus.AUTHORIZED, auth_data: data});
    },
    logout: async () => {
        await secureStore.removeItem(SECURE_AUTH_TOKEN)
        set({status: _AuthStatus.UNAUTHORIZED, auth_data: null});
    },
    hydrate: async () => {
        try {
            const data = await secureStore.getItem<LoginResponse>(SECURE_AUTH_TOKEN)
            if (data) {
                set({status: _AuthStatus.AUTHORIZED, auth_data: data});
            } else {
                set({status: _AuthStatus.UNAUTHORIZED, auth_data: null});
            }
        } catch (e) {
            console.error(e)
        }
    },
}));

export default useAuthStore