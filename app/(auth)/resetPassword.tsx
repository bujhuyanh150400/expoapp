import {Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback} from "react-native";
import {Button, Form, H6, Input, Label, Spinner, XStack, YStack} from "tamagui";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useCallback, useState} from "react";
import {ResetPasswordRequest} from "@/api/auth/type";
import {useMutation} from "@tanstack/react-query";
import authAPI from "@/api/auth";
import {useRouter} from "expo-router";
import useApiErrorHandler from "@/lib/hooks/useApiErrorHandler";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useDisableBackGesture} from "@/lib/hooks/useDisableBackGesture";
import useForgotPassStore from "@/lib/store/forgotPassStore";


type ResetPasswordFormType = Pick<ResetPasswordRequest, 'password' | 'password_confirmation'>

export default function ResetPasswordScreen() {
    useDisableBackGesture();

    const router = useRouter();

    const handleErrorApi = useApiErrorHandler<ResetPasswordRequest>();

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const {control, handleSubmit, formState: {errors, isSubmitting}, setError, reset} = useForm<ResetPasswordFormType>({
        resolver: yupResolver(
            yup.object({
                password: yup.string().min(8, 'Mật khẩu ít nhất 8 ký tự').required('Mật khẩu là bắt buộc'),
                password_confirmation: yup.string()
                    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
                    .required('Xác nhận mật khẩu là bắt buộc'),
            })
        ),
    })
    const {code, email, setEmpty} = useForgotPassStore()

    const {mutate, isPending} = useMutation({
        mutationFn: (data: ResetPasswordRequest) => authAPI.resetPassword(data),
        onSuccess: async () => {
            reset();
            setEmpty();
            router.replace('/(auth)/resetPasswordSuccess')
        },
        onError: (error) => {
            handleErrorApi({error, setError});
        }
    })

    const onSubmit = useCallback((data: ResetPasswordFormType) => {
        if (email && code) {
            const form = {...data, email, code}
            mutate(form);
        }
    }, [email, code]);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={64}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Form gap="$4" padding="$6" onSubmit={handleSubmit(onSubmit)}>
                        <YStack gap="$4">
                            <H6 fontWeight="bold">Vui lòng điền mật khẩu mới</H6>
                            <Controller
                                control={control}
                                name="password"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Label htmlFor="password">Mật khẩu mới</Label>
                                        <XStack
                                            backgroundColor="white"
                                            alignItems="center"
                                            borderRadius="$4"
                                            borderWidth={1}
                                            borderColor={!!errors.password ? 'red' : '$borderColor'}
                                        >
                                            <Input
                                                backgroundColor="white"
                                                borderWidth={0}
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
                                name="password_confirmation"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Label htmlFor="password_confirmation">Xác nhận lại mật khẩu</Label>
                                        <XStack
                                            alignItems="center"
                                            borderRadius="$4"
                                            borderWidth={1}
                                            backgroundColor="white"
                                            borderColor={!!errors.password ? 'red' : '$borderColor'}
                                        >
                                            <Input
                                                id="password_confirmation"
                                                flex={1}
                                                backgroundColor="white"
                                                borderWidth={0}
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
                                        {!!errors.password_confirmation && (
                                            <Label color="red" size="$2">
                                                {errors.password_confirmation.message}
                                            </Label>
                                        )}
                                    </YStack>
                                )}
                            />

                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting || isPending}
                                theme="active"
                                size="$4"
                                marginTop={40}
                                icon={isSubmitting || isPending ? <Spinner/> : undefined}
                            >
                                {isSubmitting || isPending ? 'Đang gửi...' : 'Xác nhận'}
                            </Button>
                        </YStack>
                    </Form>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}