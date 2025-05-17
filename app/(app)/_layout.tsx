import {Link, Redirect, SplashScreen, Stack, Tabs} from 'expo-router';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {FocusAwareStatusBar} from "@/components/FocusAwareStatusBar";
import React from "react";

export default function AppLayout() {
    return (
        <Tabs

        >
            <Tabs.Screen
                name="index"

            />
        </Tabs>
    )
}