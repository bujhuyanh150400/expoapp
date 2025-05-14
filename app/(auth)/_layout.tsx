import {Stack, useRouter} from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Button} from "tamagui";


export default function AuthLayout() {
    const router = useRouter();
    return (
        <SafeAreaProvider >
            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="login" options={{headerShown: false}}/>
            </Stack>
        </SafeAreaProvider>
    )
}