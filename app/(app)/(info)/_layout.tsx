import {router, Stack} from "expo-router";
import {TouchableOpacity, View} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import DefaultColor from "@/components/ui/DefaultColor";
import HeaderBack from "@/components/HeaderBack";

export default function InfoLayout() {
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: DefaultColor.white },
            }}
        >
            <Stack.Screen name="userInfo" options={{
                title: '',
                headerShown: true,
                headerTintColor: '#000',
                headerBackButtonDisplayMode:"minimal",
            }} />
            {/* Xác nhận người dùng */}
            <Stack.Screen name="verify_user/stepOne" options={{
                title: '',
                headerShown: true,
                headerTintColor: '#000',
                headerBackButtonDisplayMode:"minimal",
            }} />
            <Stack.Screen name="verify_user/stepTwo" options={{
                title: '',
                headerShown: true,
                headerTintColor: '#000',
                headerBackButtonDisplayMode:"minimal",
            }} />
            <Stack.Screen name="verify_user/stepThree" options={{
                headerShown: false,
            }} />
            <Stack.Screen name="support/support" options={{
                header: () => <HeaderBack/>,
            }} />
            <Stack.Screen name="support/reply" options={{
                header: () => <HeaderBack/>,
            }} />
            <Stack.Screen name="support/create/stepOne" options={{
                header: () => <HeaderBack/>,
            }} />
            <Stack.Screen name="support/create/stepTwo" options={{
                header: () => <HeaderBack/>,
            }} />
        </Stack>

    )
}

