import {KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {useCallback, useState} from 'react'
import {Button, Form, H6, Input, Label, YStack, XStack, Spinner } from 'tamagui'
import AntDesign from '@expo/vector-icons/AntDesign';
import {LoginRequest} from "@/api/auth/type";
import useAuthStore from "@/lib/store/authStore";
import {useMutation} from "@tanstack/react-query";
import authAPI from '@/api/auth'
import {useRouter} from "expo-router";
import ErrorAPIServer from "@/api/commonType";
import {showMessage} from "react-native-flash-message";

export default function LoginScreen() {
    const router = useRouter();

    const {control, handleSubmit, formState: {errors, isSubmitting}, setError} = useForm<LoginRequest>({
        resolver: yupResolver(yup.object({
            email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
            password: yup.string().min(8, 'Mật khẩu ít nhất 8 ký tự').required('Mật khẩu là bắt buộc'),
        })),
    })
    const [showPassword, setShowPassword] = useState(false);

    const {login} = useAuthStore()

    const { mutate, isPending } =  useMutation({
        mutationFn: (data: LoginRequest) => authAPI.login(data),
        onSuccess: async (data) => {
            await login(data)
            showMessage({
                message: "Bạn đã đăng nhập thành công, chào mừng bạn quay lại",
                type: 'success',
                duration: 3000,
            })
            router.replace('/(app)')
        },
        onError: (error) => {
            if (error instanceof ErrorAPIServer){
                if (error.validateError){
                    const validationErrors = error.validateError;
                    Object.entries(validationErrors).forEach(([field, messages]) => {
                        setError(field as keyof LoginRequest, {
                            type: 'validate',
                            message: messages[0],
                        });
                    });
                }
                else if (error.message){
                    showMessage({
                        message: error.message,
                        type: 'danger',
                        duration: 3000,
                    })
                }
            }
        }
    })

    const onSubmit = useCallback((data: LoginRequest) => {
        mutate(data);
    },[])

    return (
        <>
            <SafeAreaView style={{flex: 1}}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex: 1}}
                    keyboardVerticalOffset={64}
                >
                    <Form gap="$4" padding="$8" onSubmit={handleSubmit(onSubmit)}>
                        <YStack gap="$2">
                            <H6>Vui lòng điền địa chỉ email và mật khẩu</H6>
                            <Label htmlFor="email">Email của bạn</Label>
                            <Controller
                                control={control}
                                name="email"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <Input
                                        id="email"
                                        placeholder="example@email.com"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        borderColor={!!errors.email ? 'red' : '$borderColor'}
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
                                render={({field: {onChange, onBlur, value}}) => (
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
                                )}
                            />
                            {!!errors.password && (
                                <Label color="red" size="$2">
                                    {errors.password.message}
                                </Label>
                            )}
                        </YStack>
                        <YStack gap="$2">
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                theme="active"
                                size="$4"
                                icon={isSubmitting || isPending ? <Spinner/> : undefined}
                            >
                                {isSubmitting || isPending ? 'Đang gửi...' : 'Đăng nhập'}
                            </Button>
                            <Button
                                onPress={() => router.push('/(auth)/forgotPassword')}
                                disabled={isSubmitting}
                                size="$4"
                                variant="outlined"
                            >
                                {'Quên mật khẩu'}
                            </Button>
                        </YStack>
                    </Form>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}
