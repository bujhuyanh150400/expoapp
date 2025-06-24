import {router, Stack} from "expo-router";
import {TouchableOpacity, View} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import DefaultColor from "@/components/ui/DefaultColor";

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
                header: () => (
                    <View style={{ height: 60, backgroundColor: 'transparent', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                ),
            }} />
            <Stack.Screen name="support/create/stepOne" options={{
                header: () => (
                    <View
                        style={{
                            backgroundColor: DefaultColor.white,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 10,
                            paddingTop: 30,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                padding: 8,
                                borderRadius: 100,
                            }}
                        >
                            <Ionicons name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                ),
            }} />
            <Stack.Screen name="support/create/stepTwo" options={{
                header: () => (
                    <View
                        style={{
                            backgroundColor: DefaultColor.white,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 10,
                            paddingTop: 30,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                padding: 8,
                                borderRadius: 100,
                            }}
                        >
                            <Ionicons name="chevron-back" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                ),
            }} />
        </Stack>

    )
}

