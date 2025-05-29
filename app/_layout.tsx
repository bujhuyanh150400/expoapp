import { Stack } from "expo-router";
import {ReactNode, useEffect} from "react";
import {loadSelectedTheme, useThemeConfig} from "@/lib/hooks/use-selected-theme";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import { StyleSheet } from 'react-native';
import {ThemeProvider} from "@react-navigation/core";
import {APIProvider} from "@/api/ApiProvider";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import FlashMessage from 'react-native-flash-message';
import * as SplashScreen from 'expo-splash-screen';
import './global.css'
export { ErrorBoundary } from 'expo-router';
import { defaultConfig } from '@tamagui/config/v4' // for quick config install this
import { createTamagui,TamaguiProvider } from 'tamagui'
const config = createTamagui(defaultConfig)

export default function RootLayout() {

    return (
      <LayoutProvider>
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="(account)" options={{ headerShown: false }} />
        </Stack>
      </LayoutProvider>
  )
}

function LayoutProvider({ children }: { children: ReactNode }) {
  /**
   * react-native-gesture-handler - xử lý cử chỉ mượt hơn
   * react-native-keyboard-controller - tăng cường khả năng kiểm soát bàn phím
   * - Đồng bộ chuyển động bàn phím (keyboard animations) với giao diện người dùng.
   * - Tùy chỉnh hoặc xử lý chuyển động giao diện khi bàn phím xuất hiện hoặc ẩn đi.
   * - Giúp UI (giao diện) phản hồi mượt mà hơn khi người dùng tương tác với bàn phím.
   */
  return (
    <GestureHandlerRootView
        style={styles.container}
        // className={theme.dark ? `dark` : undefined}
    >
        <TamaguiProvider config={config}>
          <APIProvider>
            <BottomSheetModalProvider>
              {children}
              <FlashMessage position="top" />
            </BottomSheetModalProvider>
          </APIProvider>
        </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});