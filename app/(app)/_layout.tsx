import {Stack, router} from 'expo-router';
import useAuthStore from "@/lib/store/authStore";
import {useEffect} from "react";
import {_AuthStatus} from "@/lib/@type";
import DefaultColor from "@/components/ui/DefaultColor";
import useAppStore from "@/lib/store/appStore";
import FullScreenLoading from "@/components/FullScreenLoading";
import {WebSocketProvider} from "@/api/socket/provider";

export default function AppLayout() {
    const status = useAuthStore(state => state.status);
    const loading = useAppStore(state => state.loading);

    useEffect(() => {
        if (status === _AuthStatus.UNAUTHORIZED) {
            router.replace('/(auth)')
        }
    }, [status]);


    return (
        <WebSocketProvider>
            <FullScreenLoading loading={loading} />
            <Stack
                initialRouteName="(tab)"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: DefaultColor.white },
                }}
            >
                <Stack.Screen name="(tab)"/>
                <Stack.Screen name="(account)"/>
                <Stack.Screen name="(info)"/>
                <Stack.Screen name="(trade)"/>
            </Stack>
        </WebSocketProvider>
    )
}