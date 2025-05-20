import {Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback} from 'react-native'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {useCallback, useState} from 'react'
import {Button, Form, H6, Input, Label, YStack, XStack, Spinner} from 'tamagui'
import {RegisterRequest} from "@/api/auth/type";
import AntDesign from "@expo/vector-icons/AntDesign";
import authAPI from "@/api/auth";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "expo-router";
import useApiErrorHandler from "@/lib/hooks/useApiErrorHandler";

type FormRegister = RegisterRequest & {
    confirm_password: string
}

export default function RegisterScreen() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const {control, handleSubmit, formState: {errors, isSubmitting}, setError, reset} = useForm<FormRegister>({
        resolver: yupResolver(
            yup.object({
                name: yup.string().required('Tên là bắt buộc'),
                email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
                password: yup.string().min(8, 'Mật khẩu ít nhất 8 ký tự').required('Mật khẩu là bắt buộc'),
                confirm_password: yup.string()
                    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
                    .required('Xác nhận mật khẩu là bắt buộc'),
            })
        ),
    })
    const handleErrorApi = useApiErrorHandler<RegisterRequest>();

    const {mutate, isPending} = useMutation({
        mutationFn: (data: RegisterRequest) => authAPI.register(data),
        onSuccess: async () => {
            reset();
            router.replace('/(auth)/registerSuccess')
        },
        onError: (error) => {
            handleErrorApi({error, setError});
        }
    })
    const onSubmit = useCallback((data: FormRegister) => {
        const request = {
            name: data.name,
            email: data.email,
            password: data.password,
        }
        mutate(request);
    }, []);

    return (
        <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={24}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Form gap="$4" padding="$8" onSubmit={handleSubmit(onSubmit)}>
                        <YStack gap="$4">
                            <H6 fontWeight="bold">Vui lòng điền thông tin đăng ký tài khoản</H6>
                            <Controller
                                control={control}
                                name="name"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Input
                                            id="name"
                                            placeholder="Tên của bạn"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="default"
                                            autoCapitalize="none"
                                            borderColor={!!errors.name ? 'red' : '$borderColor'}
                                        />
                                        {!!errors.name && (
                                            <Label color="red" size="$2">
                                                {errors.name.message}
                                            </Label>
                                        )}
                                    </YStack>
                                )}
                            />

                            <Controller
                                control={control}
                                name="email"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Input
                                            id="email_register"
                                            placeholder="Email của bạn"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            borderColor={!!errors.email ? 'red' : '$borderColor'}
                                        />
                                        {!!errors.email && (
                                            <Label color="red" size="$2">
                                                {errors.email.message}
                                            </Label>
                                        )}
                                    </YStack>
                                )}
                            />

                            <Controller
                                control={control}
                                name="password"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <XStack
                                            alignItems="center"
                                            borderRadius="$4"
                                            borderWidth={1}
                                            borderColor={!!errors.password ? 'red' : '$borderColor'}
                                        >
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
                                                    <AntDesign name="unlock" size={18} color="black"/>
                                                ) : (
                                                    <AntDesign name="lock1" size={18} color="black"/>
                                                )}
                                            </XStack>
                                        </XStack>
                                        {!!errors.password && (
                                            <Label color="red" size="$2">
                                                {errors.password.message}
                                            </Label>
                                        )}
                                    </YStack>
                                )}
                            />

                            <Controller
                                control={control}
                                name="confirm_password"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <XStack
                                            alignItems="center"
                                            borderRadius="$4"
                                            borderWidth={1}
                                            borderColor={!!errors.confirm_password ? 'red' : '$borderColor'}
                                        >
                                            <Input
                                                id="password_register"
                                                flex={1}
                                                placeholder="Xác nhận mật khẩu"
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                secureTextEntry={!showPasswordConfirm}
                                                paddingRight="$10"
                                            />
                                            <XStack
                                                paddingHorizontal="$3"
                                                onPress={() => setShowPasswordConfirm((prev) => !prev)}
                                                cursor="pointer"
                                            >
                                                {showPasswordConfirm ? (
                                                    <AntDesign name="unlock" size={18} color="black"/>
                                                ) : (
                                                    <AntDesign name="lock1" size={18} color="black"/>
                                                )}
                                            </XStack>
                                        </XStack>
                                        {!!errors.confirm_password && (
                                            <Label color="red" size="$2">
                                                {errors.confirm_password.message}
                                            </Label>
                                        )}
                                    </YStack>
                                )}
                            />

                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                theme="active"
                                size="$4"
                                marginTop="$4"
                                icon={isSubmitting || isPending ? <Spinner/> : undefined}
                            >
                                {isSubmitting || isPending ? 'Đang gửi...' : 'Đăng ký'}
                            </Button>
                        </YStack>

                    </Form>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}