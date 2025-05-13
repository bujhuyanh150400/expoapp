import {useRouter} from 'expo-router';
import {FocusAwareStatusBar} from "@/api/FocusAwareStatusBar";
import {Text, View, Alert, Platform, KeyboardAvoidingView, TextInput, SafeAreaView} from 'react-native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from "react-hook-form";
import {ControlledInput} from "@/components/ui/ControlInput";
import {Button} from "@/components/ui/Button";


type FormData = {
    email: string;
    password: string;
};

const schema = yup.object({
    email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
});


export default function LoginScreen() {
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        Alert.alert('Dữ liệu gửi đi', JSON.stringify(data, null, 2));
    };
    return (
        <>
            {/*<FocusAwareStatusBar />*/}
            <SafeAreaView className="container px-7 bg-white h-full w-full flex-1 items-center justify-center">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}
                    keyboardVerticalOffset={64}
                >
                    <View className="flex-1 flex-col gap-4">
                        <Text className="text-[32px] font-extrabold leading-tight tracking-tight text-gray-900">
                            Sign in
                        </Text>
                    </View>
                    <Controller
                        control={control}
                        name="email"
                        render={({field: {onChange, value, onBlur}}) => (
                            <View>
                                <Text className="mb-2 text-sm font-medium text-gray-900">
                                    Email
                                </Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5  focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Email"
                                    onChangeText={onChange}
                                    value={value}
                                    onBlur={onBlur}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {errors.email && <Text className="text-red-500 mb-2">{errors.email.message}</Text>}
                            </View>
                        )}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}