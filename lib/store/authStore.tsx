import {create} from 'zustand';
import storage from "@/lib/storage";
import {AUTH_TOKEN} from "@/lib/storage/key";
import {_AuthStatus} from "@/lib/@type";
import {AuthTokenType} from "@/api/auth/type";


interface AuthState {
    token: AuthTokenType | null;
    status: _AuthStatus;
    setToken: (data: AuthTokenType) => Promise<void>;
    removeToken: () => Promise<void>;
    hydrate: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
    status: _AuthStatus.UNAUTHORIZED,
    token: null,
    setToken: async (token) => {
        await storage.setItem<AuthTokenType>(AUTH_TOKEN,token)
        set({ status: _AuthStatus.AUTHORIZED, token });
    },
    removeToken: async () => {
        await storage.removeItem(AUTH_TOKEN)
        set({ status: _AuthStatus.UNAUTHORIZED, token: null });
    },
    hydrate: async () => {
        try {
            const token = await storage.getItem<AuthTokenType>(AUTH_TOKEN)
            if (token) {
                set({ token, status: _AuthStatus.AUTHORIZED });
            } else {
                set({ status: _AuthStatus.UNAUTHORIZED, token: null });
            }
        } catch (e) {
            console.log(e)
        }
    },
}));

export default useAuthStore