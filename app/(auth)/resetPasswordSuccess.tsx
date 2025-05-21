import {useRouter} from "expo-router";
import SuccessScreen from "@/components/SuccessScreen";


export default function ResetPasswordSuccessScreen() {
    const router = useRouter()

    return (
        <SuccessScreen
            title="Thay mật khẩu thành công!"
            messages={[
                'Tài khoản của bạn đã thay mật khẩu.',
                'Vui lòng đăng nhập lại tài khoản với mật khẩu mới.',
            ]}
            buttonText="Quay trở lại"
            onButtonPress={() => router.replace('/(auth)')}
        />
    )
}