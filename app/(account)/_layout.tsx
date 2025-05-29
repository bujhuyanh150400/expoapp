import {Stack, useRouter} from "expo-router";
import useAuthStore from "@/lib/store/authStore";
import {useEffect} from "react";
import {_AuthStatus} from "@/lib/@type";

export default function AccountLayout() {
    const {status} = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        if (status === _AuthStatus.UNAUTHORIZED) {
            router.replace('/(auth)')
        }
    }, [status]);

    return (
        <Stack>
            <Stack.Screen name="addStepOne" options={{
                title: 'Tạo tài khoản',
                headerShown: true,
                headerTintColor: '#000',
                headerBackButtonDisplayMode:"minimal",
            }}/>
            <Stack.Screen name="addStepTwo" options={{
                title: 'Tạo tài khoản',
                headerShown: true,
                headerTintColor: '#000',
                headerBackButtonDisplayMode:"minimal",
            }}/>
            <Stack.Screen name="addStepThree" options={{
                title: 'Tạo tài khoản',
                headerShown: true,
                headerTintColor: '#000',
                headerBackButtonDisplayMode:"minimal",
            }}/>
            <Stack.Screen name="addStepFour" options={{
                title: 'Mật khẩu tài khoản',
                headerShown: true,
                headerTintColor: '#000',
                headerBackButtonDisplayMode:"minimal",
            }}/>
        </Stack>
    )

}