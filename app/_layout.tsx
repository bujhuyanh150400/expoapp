import { Stack } from "expo-router";
import {ReactNode, useEffect} from "react";
import {loadSelectedTheme, useThemeConfig} from "@/lib/hooks/use-selected-theme";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import { StyleSheet } from 'react-native';
import {ThemeProvider} from "@react-navigation/core";
import {APIProvider} from "@/api/common";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import FlashMessage from 'react-native-flash-message';
import * as SplashScreen from 'expo-splash-screen';
import './global.css'
export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
    initialRouteName: 'login',
};


export default function RootLayout() {
//     useEffect(() => {
//         loadSelectedTheme();
// // Prevent the splash screen from auto-hiding before asset loading is complete.
//         SplashScreen.preventAutoHideAsync();
// // Set the animation options. This is optional.
//         SplashScreen.setOptions({
//             duration: 500,
//             fade: true,
//         });
//     }, []);

    return (
      <LayoutProvider>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </LayoutProvider>
  )
}

function LayoutProvider({ children }: { children: ReactNode }) {

  const theme = useThemeConfig();
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
        className={theme.dark ? `dark` : undefined}
    >
        <ThemeProvider value={theme}>
          <APIProvider>
            <BottomSheetModalProvider>
              {children}
              <FlashMessage position="top" />
            </BottomSheetModalProvider>
          </APIProvider>
        </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});