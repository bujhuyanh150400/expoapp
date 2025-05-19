import {create} from 'zustand';
import storage from "@/lib/storage";
import {AUTH_TOKEN} from "@/lib/storage/key";
import {_AuthStatus} from "@/lib/@type";
import {LoginResponse} from "@/api/auth/type";


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
        await storage.setItem<LoginResponse>(AUTH_TOKEN, data)
        set({status: _AuthStatus.AUTHORIZED, auth_data: data});
    },
    logout: async () => {
        await storage.removeItem(AUTH_TOKEN)
        set({status: _AuthStatus.UNAUTHORIZED, auth_data: null});
    },
    hydrate: async () => {
        try {
            const data = await storage.getItem<LoginResponse>(AUTH_TOKEN)
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