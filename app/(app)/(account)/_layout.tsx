import {Stack} from "expo-router";

export default function AccountLayout() {

    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}}/>

            <Stack.Screen name="addStepOne" options={{
                title: 'Tạo tài khoản',
                headerShown: true,
                headerTintColor: '#000',
                headerBackButtonDisplayMode:"minimal",
            }}/>
        </Stack>
    )

}