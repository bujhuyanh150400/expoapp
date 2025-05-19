import {Stack} from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {FocusAwareStatusBar} from "@/components/FocusAwareStatusBar";
import React from "react";


export default function AuthLayout() {
    return (
        <SafeAreaProvider >
            <FocusAwareStatusBar/>
            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="login" options={{headerShown: false}}/>
                <Stack.Screen name="register" options={{headerShown: false}}/>
                <Stack.Screen name="registerSuccess" options={{headerShown: false}}/>
                <Stack.Screen name="forgotPassword" options={{headerShown: false}}/>
                <Stack.Screen name="enterPin" options={{headerShown: false}}/>
            </Stack>
        </SafeAreaProvider>
    )
}