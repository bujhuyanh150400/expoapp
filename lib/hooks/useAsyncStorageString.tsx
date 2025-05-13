import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useAsyncStorageString(key: string, defaultValue = ''): [string, (value: string) => Promise<void>] {
    const [value, setValue] = useState<string>(defaultValue);

    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem(key);
            if (stored !== null) {
                setValue(stored);
            }
        })();
    }, [key]);

    const setStoredValue = async (newValue: string) => {
        await AsyncStorage.setItem(key, newValue);
        setValue(newValue);
    };

    return [value, setStoredValue];
}
