import {Image, Text, View} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from "expo-router";
import {XStack, YStack, Button} from 'tamagui'
import AntDesign from '@expo/vector-icons/AntDesign';
import {APP_NAME} from "@/lib/constant";


export default function OnboardScreen() {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 items-center justify-center flex-col">
            <View className="mb-32 flex flex-row items-center justify-center">
                <Image
                    source={require('@/assets/images/zentrix_logo.png')}
                    style={{
                        width: 100,
                        height: 100
                    }}
                    resizeMode="contain"
                />
                <Text className="font-extrabold text-5xl">
                    {APP_NAME}
                </Text>
            </View>
            <XStack paddingHorizontal="$8" alignSelf="center" gap="$2">
                <YStack
                    flex={1}
                    gap="$2"
                    padding="$2"
                >
                    <Button onPress={() => router.push('/(auth)/register')} theme="accent">Đăng ký</Button>
                    <Button onPress={() => router.push('/(auth)/enterPin')}>Đăng nhập</Button>
                </YStack>
            </XStack>
            <XStack alignItems="center" justifyContent="center" marginVertical={15} paddingHorizontal="$8">
                <View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
                <Text style={{ marginHorizontal: 10, color: 'gray' }}>Hoặc</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
            </XStack>
            <XStack paddingHorizontal="$8" justifyContent="center" alignSelf="center" gap="$2">
                <Button variant="outlined" style={{flex: 1}}><AntDesign name="google" size={20} color="black" /> Google</Button>
                <Button variant="outlined" style={{flex: 1}}><AntDesign name="apple1" size={20} color="black" /> Apple</Button>
            </XStack>
        </SafeAreaView>
    )
}