import {Stack, useRouter} from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Button} from "tamagui";
import {FocusAwareStatusBar} from "@/components/FocusAwareStatusBar";
import React from "react";


export default function AuthLayout() {
    return (
        <SafeAreaProvider >
            <FocusAwareStatusBar/>
            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="login" options={{headerShown: false}}/>
            </Stack>
        </SafeAreaProvider>
    )
}