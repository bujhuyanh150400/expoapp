import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();


/**
 * Constant
 */
const KEY_AUTH_TOKEN = 'AUTH_TOKEN';


/**
 * Auth Storage
 */
export const AuthStorage = {
    set: (dataToken: { token: string, refreshToken: string }): void => {
        const dataTokenJson = JSON.stringify(dataToken);
        storage.set(KEY_AUTH_TOKEN, dataTokenJson);
    },
    get: (): string | null => {
        const dataTokenJson = storage.getString(KEY_AUTH_TOKEN);
        if (!dataTokenJson) {
            return null;
        }
        return dataTokenJson;
    },
    destroy: () => {
        storage.delete(KEY_AUTH_TOKEN);
    }
}