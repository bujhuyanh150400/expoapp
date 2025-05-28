import {Button, Form, H6, Input, Label, YStack, Spinner} from 'tamagui'
import {SafeAreaView, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {ForgotPasswordRequest, RegisterRequest} from "@/api/auth/type";
import {useMutation} from "@tanstack/react-query";
import authAPI from "@/api/auth";
import {useCallback} from "react";
import useApiErrorHandler from "@/lib/hooks/useApiErrorHandler";
import {useRouter} from "expo-router";
import useForgotPassStore from "@/lib/store/forgotPassStore";


export default function ForgotPasswordScreen() {

    const router = useRouter()

    const handleErrorApi = useApiErrorHandler<ForgotPasswordRequest>();

    const {control, handleSubmit, formState: {errors, isSubmitting}, setError, reset, getValues} = useForm<ForgotPasswordRequest>({
        resolver: yupResolver(
            yup.object({
                email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc')
            })
        ),
    })

    const {setEmail} = useForgotPassStore()

    const { mutate, isPending } =  useMutation({
        mutationFn: (data: ForgotPasswordRequest) => authAPI.forgotPassword(data),
        onSuccess: async () => {
            const form = getValues();
            setEmail(form.email)
            reset();
            router.replace('/(auth)/verifyCodeForgotPass')
        },
        onError: (error) => {
            handleErrorApi({error, setError});
        }
    })
    const onSubmit = useCallback((data: ForgotPasswordRequest) => {
        mutate(data);
    },[])

    return (
        <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={64}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Form gap="$4" padding="$6" onSubmit={handleSubmit(onSubmit)}>
                        <YStack gap="$4">
                            <H6 fontWeight="bold">Vui lòng điền email quên mật khẩu</H6>
                            <Controller
                                control={control}
                                name="email"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Label htmlFor="email_forgot_password">Email của bạn</Label>
                                        <Input
                                            id="email_forgot_password"
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
                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting || isPending}
                                theme="active"
                                size="$4"
                                icon={isSubmitting || isPending ? <Spinner/> : undefined}
                            >
                                {isSubmitting || isPending ? 'Đang gửi...' : 'Tiếp tục'}
                            </Button>
                        </YStack>
                    </Form>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
        )
}