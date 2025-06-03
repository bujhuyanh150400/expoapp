import {Stack} from "expo-router";


export default function InfoLayout() {
    return (
        <Stack initialRouteName="index">
            <Stack.Screen name="index" options={{
                headerShown: false,
            }} />

            {/* Xác nhận người dùng */}
            <Stack.Screen name="verify_user/stepOne" options={{
                title: 'Xác thực người dùng',
                headerShown: true,
                headerTintColor: '#000',
                headerBackButtonDisplayMode:"minimal",
            }} />
            <Stack.Screen name="verify_user/stepTwo" options={{
                title: 'Chụp xác thực người dùng',
                headerShown: true,
                headerTintColor: '#000',
                headerBackButtonDisplayMode:"minimal",
            }} />

        </Stack>

    )
}

