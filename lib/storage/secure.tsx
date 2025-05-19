import * as SecureStore from 'expo-secure-store'
import AsyncStorage from "@react-native-async-storage/async-storage";


const secureStore = {
    async getItem<T>(key: string): Promise<T | null> {
        try {
            const value = await SecureStore.getItem(key);
            return value ? (JSON.parse(value) as T) : null;
        } catch (e) {
            console.error('Error reading value', e);
            return null;
        }
    },
    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving value', e);
        }
    },
    async  removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing value', e);
        }
    }
}

export default secureStore