import { useRouter } from 'expo-router'
import { YStack, H5, Paragraph, Button, Circle  } from 'tamagui'
import {View} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function RegisterSuccessScreen() {
    const router = useRouter()

    const goToHome = () => {
        router.replace('/(auth)')
    }

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <YStack gap="$4" padding="$8" alignItems="center" justifyContent="center">
                <Circle size={200} backgroundColor="$green4" alignItems="center" justifyContent="center">
                    <Circle size={150} backgroundColor="$green5" alignItems="center" justifyContent="center">
                        <AntDesign name="check" size={80} color="#3ecf65" />
                    </Circle>
                </Circle>
                <H5 style={{
                    fontWeight: 'bold',
                }}>Đăng ký thành công!</H5>
                <YStack gap="$2" alignItems="center" justifyContent="center">
                    <Paragraph>
                        Tài khoản của bạn đã được tạo.
                    </Paragraph>
                    <Paragraph>
                        Vui lòng kiểm tra email để xác minh email.
                    </Paragraph>
                </YStack>
                <Button size="$4" backgroundColor="$green8" color="white" borderColor="$green6" theme="active" onPress={goToHome}>
                    Quay trở lại trang chủ
                </Button>
            </YStack>
        </View>
    )
}
