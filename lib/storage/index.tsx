import AsyncStorage from '@react-native-async-storage/async-storage';

 const storage = {
     async getItem<T>(key: string): Promise<T | null> {
         try {
             const value = await AsyncStorage.getItem(key);
             return value ? (JSON.parse(value) as T) : null;
         } catch (e) {
             return null;
         }
     },
     async setItem<T>(key: string, value: T): Promise<void> {
         try {
             await AsyncStorage.setItem(key, JSON.stringify(value));
         } catch (e) {
         }
     },
     async  removeItem(key: string): Promise<void> {
         try {
             await AsyncStorage.removeItem(key);
         } catch (e) {
         }
     }
}

export default storage;