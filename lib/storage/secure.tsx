import * as SecureStore from 'expo-secure-store';

const secureStore = {
    async getItem<T>(key: string): Promise<T | null> {
        try {
            const value = await SecureStore.getItemAsync(key);
            return value ? (JSON.parse(value) as T) : null;
        } catch (e) {
            return null;
        }
    },
    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await SecureStore.setItemAsync(key, jsonValue);
        } catch (e) {
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (e) {
        }
    },
};
export default secureStore