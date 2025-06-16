import {Stack} from "expo-router";


export default function InfoLayout() {
    return (
        <Stack>
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
        </Stack>

    )
}

