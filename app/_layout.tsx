import { Stack} from "expo-router";
import {ReactNode, useEffect} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {StyleSheet} from 'react-native';
import {APIProvider} from "@/api/ApiProvider";
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import FlashMessage from 'react-native-flash-message';
import './global.css'
import * as SplashScreen from 'expo-splash-screen';
import {defaultConfig} from '@tamagui/config/v4' // for quick config install this
import {createTamagui, TamaguiProvider} from 'tamagui'
import { useFonts } from 'expo-font';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    return (
        <LayoutProvider>
            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen name="(app)" options={{headerShown: false}}/>
            </Stack>
        </LayoutProvider>
    )
}
const config = createTamagui(defaultConfig)

function LayoutProvider({children}: { children: ReactNode }) {
    /**
     * react-native-gesture-handler - xử lý cử chỉ mượt hơn
     * react-native-keyboard-controller - tăng cường khả năng kiểm soát bàn phím
     * - Đồng bộ chuyển động bàn phím (keyboard animations) với giao diện người dùng.
     * - Tùy chỉnh hoặc xử lý chuyển động giao diện khi bàn phím xuất hiện hoặc ẩn đi.
     * - Giúp UI (giao diện) phản hồi mượt mà hơn khi người dùng tương tác với bàn phím.
     */
    return (
        <GestureHandlerRootView
            style={{
                flex: 1
            }}
            // className={theme.dark ? `dark` : undefined}
        >
            <TamaguiProvider config={config}>
                <APIProvider>
                    <BottomSheetModalProvider>
                        {children}
                        <FlashMessage position="top"/>
                    </BottomSheetModalProvider>
                </APIProvider>
            </TamaguiProvider>
        </GestureHandlerRootView>
    );
}