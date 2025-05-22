import {Animated, Image, Text, View} from "react-native";
import {useRouter} from "expo-router";
import {useCallback, useEffect, useRef} from "react";
import {APP_NAME} from "@/lib/constant";
import useAuthStore from "@/lib/store/authStore";
import {_AuthStatus} from "@/lib/@type";

export default function SplashedScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    const {hydrate} = useAuthStore();

    const checkLogin = useCallback(async () => {
        await hydrate()
        const freshStatus = useAuthStore.getState().status
        if (freshStatus === _AuthStatus.NEED_ACCESS_PIN) {
            router.replace('/(auth)/verify')
        } else {
            router.replace('/(auth)') // Nếu chưa login
        }
    }, []);

    useEffect(() => {
        // animate the fade-in and scale-up effect
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            checkLogin().catch()
        }, 2000);

        return () => clearTimeout(timer);
    }, []);
    return (
        <View className="flex-1 items-center justify-center">
            <Animated.View
                style={[
                    {
                        alignItems: "center"
                    },
                    {
                        opacity: fadeAnim,
                        transform: [{scale: scaleAnim}],
                    },
                ]}
            >
                <Image
                    source={require('@/assets/images/zentrix_logo.png')}
                    style={{
                        width: 100,
                        height: 100,

                    }}
                    resizeMode="contain"
                />
                <Text className="text-3xl font-extrabold mt-[20px]">{APP_NAME}</Text>
            </Animated.View>
        </View>
    )
}