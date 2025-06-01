import {Stack, useRouter} from "expo-router";
import useAuthStore from "@/lib/store/authStore";
import {useEffect} from "react";
import {_AuthStatus} from "@/lib/@type";

export default function TradeLayout() {
    const {status} = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        if (status === _AuthStatus.UNAUTHORIZED) {
            router.replace('/(auth)')
        }
    }, [status]);

    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false,}} />
        </Stack>
    )

}