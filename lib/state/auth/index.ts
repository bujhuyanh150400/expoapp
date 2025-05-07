import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {IAuthState} from "@/lib/state/auth/type";
import {KEY_AUTH_TOKEN, storage} from "@/lib/storage";

export const useAuthStore = create<IAuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: ({ user, token }) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
        }),
        {
            name: KEY_AUTH_TOKEN,
            storage: createJSONStorage(() => ({
                setItem: (name, value) => {
                    storage.set(name, value);
                    return Promise.resolve(true);
                },
                getItem: (name) => {
                    const value = storage.getString(name);
                    return Promise.resolve(value ?? null);
                },
                removeItem: (name) => {
                    storage.delete(name);
                    return Promise.resolve();
                },
            })),
        }
    )
);