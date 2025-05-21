import { useRouter } from 'expo-router'
import SuccessScreen from "@/components/SuccessScreen";

export default function RegisterSuccessScreen() {
    const router = useRouter()

    return (
        <SuccessScreen
            title="Đăng ký thành công!"
            messages={[
                'Tài khoản của bạn đã được tạo.',
                'Vui lòng kiểm tra email để xác minh email.',
            ]}
            buttonText="Quay trở lại"
            onButtonPress={() => router.replace('/(auth)')}
        />
    )
}
