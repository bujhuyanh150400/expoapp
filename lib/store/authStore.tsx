import { create } from 'zustand';
import {_AuthStatus} from "@/lib/constant";
import {getItem, removeItem, setItem} from "@/lib/storage";
import {AUTH_TOKEN, SELECTED_THEME} from "@/lib/storage/key";

export type TokenType = {
    access: string;
    refresh: string;
};

interface AuthState {
    token: TokenType | null;
    status: _AuthStatus;
    signIn: (data: TokenType) => void;
    signOut: () => void;
    hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
    status: _AuthStatus.AUTHORIZED,
    token: null,
    signIn: async (token) => {
        await setItem<TokenType>(AUTH_TOKEN,token)
        set({ status: _AuthStatus.AUTHORIZED, token });
    },
    signOut: async () => {
        await removeItem(AUTH_TOKEN)
        set({ status: _AuthStatus.UNAUTHORIZED, token: null });
    },
    hydrate: async () => {
        try {
            const token = await getItem<TokenType>(AUTH_TOKEN)
            if (token) {
                set({ token });
            } else {
                set({ status: _AuthStatus.UNAUTHORIZED });
            }
        } catch (e) {
        }
    },
}));