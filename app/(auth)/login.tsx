import { Alert, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import React, {useState} from 'react'
import { Button, Form, H6, Input, Label, YStack, XStack } from 'tamagui'
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Định nghĩa kiểu dữ liệu
type FormData = {
    email: string
    password: string
}

// Xác thực form với Yup
const schema = yup.object({
    email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
})

export default function LoginScreen() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    })
    const [showPassword, setShowPassword] = useState(false)
    const onSubmit = (data: FormData) => {
        Alert.alert('Đăng nhập thành công', JSON.stringify(data, null, 2))
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={64}
            >
                <Form gap="$4" padding="$8" onSubmit={handleSubmit(onSubmit)}>
                    <YStack gap="$2">
                        <H6>Vui lòng điền địa chỉ email và mật khẩu</H6>

                        <Label htmlFor="email">Email của bạn</Label>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    id="email"
                                    placeholder="example@email.com"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            )}
                        />
                        {!!errors.email && (
                            <Label color="red" size="$2">
                                {errors.email.message}
                            </Label>
                        )}

                        <Label htmlFor="password">Mật khẩu</Label>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <XStack alignItems="center" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
                                    <Input
                                        id="password"
                                        flex={1}
                                        placeholder="Mật khẩu"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showPassword}
                                        paddingRight="$10"
                                    />
                                    <XStack
                                        paddingHorizontal="$3"
                                        onPress={() => setShowPassword((prev) => !prev)}
                                        cursor="pointer"
                                    >
                                        {showPassword ? (
                                            <FontAwesome name="eye-slash" size={20} color="black" />
                                        ) : (
                                            <FontAwesome name="eye" size={20} color="black" />
                                        )}
                                    </XStack>
                                </XStack>
                            )}
                        />
                        {!!errors.password && (
                            <Label color="red" size="$2">
                                {errors.password.message}
                            </Label>
                        )}

                        <Button
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            theme="active"
                            size="$4"
                            marginTop="$4"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Đăng nhập'}
                        </Button>
                    </YStack>
                </Form>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
