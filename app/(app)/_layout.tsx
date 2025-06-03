import {Tabs, useRouter} from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import useAuthStore from "@/lib/store/authStore";
import {useEffect, useMemo} from "react";
import {_AuthStatus} from "@/lib/@type";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';


export const styleLayout = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        height: 64,
        // SHADOW cho iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // SHADOW cho Android
        elevation: 10,
    }
});

export default function AppLayout() {
    const {status} = useAuthStore();

    const router = useRouter();

    useEffect(() => {
        if (status === _AuthStatus.UNAUTHORIZED) {
            router.replace('/(auth)')
        }
    }, [status]);

    return (
        <Tabs
            initialRouteName="(account)"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#8c8c8c',
                tabBarItemStyle: {
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                },
                tabBarLabelStyle: {
                    marginTop: 4,
                },
                tabBarStyle: styleLayout.tabBarStyle,
        }}
        >
            <Tabs.Screen
                name="(account)"
                options={{
                    title: 'Tài khoản',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="wallet" size={24} color={props.focused ? '#000' : '#8c8c8c'} />
                }}
            />
            <Tabs.Screen
                name="trade"
                options={{
                    title: 'Giao dịch',
                    tabBarIcon: (props) =>
                        <MaterialIcons name="candlestick-chart" size={24} color={props.focused ? '#000' : '#8c8c8c'} />
                }}
            />
            <Tabs.Screen
                name="market"
                options={{
                    title: 'Thị trường',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="globe" size={24} color={props.focused ? '#000' : '#8c8c8c'} />
                }}
            />
            <Tabs.Screen
                name="(info)"
                options={{
                    title: 'Hồ sơ',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="house-user" size={24} color={props.focused ? '#000' : '#8c8c8c'} />,

                }}
            />
        </Tabs>
    )
}