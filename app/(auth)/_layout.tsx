import {Stack, useRouter} from "expo-router";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {FocusAwareStatusBar} from "@/components/FocusAwareStatusBar";
import React, {useEffect} from "react";
import {_AuthStatus} from "@/lib/@type";
import useAuthStore from "@/lib/store/authStore";


export default function AuthLayout() {
    const {status} = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        if (status === _AuthStatus.AUTHORIZED) {
            router.replace('/(app)/(account)')
        }
    }, [status]);
    return (
        <SafeAreaProvider>
            <FocusAwareStatusBar/>
            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="login" options={{headerShown: false}}/>
                <Stack.Screen name="register" options={{headerShown: false}}/>
                <Stack.Screen name="registerSuccess" options={{headerShown: false}}/>
                <Stack.Screen name="enterPin" options={{headerShown: false}}/>
                <Stack.Screen name="verify" options={{headerShown: false}}/>

                <Stack.Screen name="forgotPassword" options={{headerShown: false}}/>
                <Stack.Screen name="verifyCodeForgotPass" options={{headerShown: false}}/>
                <Stack.Screen name="resetPassword" options={{headerShown: false}}/>
                <Stack.Screen name="resetPasswordSuccess" options={{headerShown: false}}/>
            </Stack>
        </SafeAreaProvider>
    )
}