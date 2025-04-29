import {Tabs} from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';
import {useColorScheme} from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Tài khoản',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="trading"
                options={{
                    title: 'Giao dịch',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="market"
                options={{
                    title: 'Thị trường',
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="info"
                options={{
                    title: 'Hồ sơ',
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
