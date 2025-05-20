import { YStack, H5, Paragraph, Button, Circle  } from 'tamagui'
import {View, SafeAreaView, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from "react-native";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {ForgotPasswordRequest, LoginRequest, RegisterRequest} from "@/api/auth/type";
import {useMutation} from "@tanstack/react-query";
import authAPI from "@/api/auth";
import {useCallback} from "react";
import useApiErrorHandler from "@/lib/hooks/useApiErrorHandler";
import {useRouter} from "expo-router";


export default function ForgotPasswordScreen() {
    const router = useRouter()

    const handleErrorApi = useApiErrorHandler<RegisterRequest>();

    const {control, handleSubmit, formState: {errors, isSubmitting}, setError, reset} = useForm<ForgotPasswordRequest>({
        resolver: yupResolver(
            yup.object({
                email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc')
            })
        ),
    })

    const { mutate, isPending } =  useMutation({
        mutationFn: (data: ForgotPasswordRequest) => authAPI.forgotPassword(data),
        onSuccess: async (data) => {
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
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
        )
}