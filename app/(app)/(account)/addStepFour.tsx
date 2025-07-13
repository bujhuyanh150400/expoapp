import React, {useState} from 'react'
import {Input, YStack, Text, XStack, Button, Paragraph, Spinner} from 'tamagui'
import {Check, X} from '@tamagui/lucide-icons'
import {Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from "react-native";
import useAddAccountStore from "@/lib/store/addAccountStore";
import {useMutation} from "@tanstack/react-query";
import {useRouter} from "expo-router";
import accountAPI from "@/api/account";
import {CreateAccountRequest} from "@/api/account/type";
import {showMessage} from "react-native-flash-message";
import {useShowErrorHandler} from "@/lib/hooks/useApiErrorHandler";
import useAuthStore from "@/lib/store/authStore";
import useHideTabLayout from "@/lib/hooks/useHideTabLayout";

const rules = [
    {
        label: 'Từ 8–15 ký tự',
        isValid: (val: string) => val.length >= 8 && val.length <= 15,
    },
    {
        label: 'Ít nhất có một chữ hoa và một chữ thường',
        isValid: (val: string) => /[a-z]/.test(val) && /[A-Z]/.test(val),
    },
    {
        label: 'Ít nhất có một số',
        isValid: (val: string) => /\d/.test(val),
    },
    {
        label: 'Ít nhất có một ký tự đặc biệt',
        isValid: (val: string) => /[^a-zA-Z0-9]/.test(val),
    },
]

export default function AddStepFourScreen() {
    // Ẩn tab layout
    useHideTabLayout();

    const router = useRouter();

    const [password, setPassword] = useState('')

    const allValid = rules.every((rule) => rule.isValid(password))

    const {form_step_1, form_step_2, form_step_3} = useAddAccountStore();
    const {auth_data} = useAuthStore();

    const {mutate, isPending} = useMutation({
        mutationFn: (data: CreateAccountRequest) => accountAPI.createAccount(data),
        onSuccess: async () => {
            showMessage({
                message: "Tạo tài khoản ví thành công",
                type: 'success',
                duration: 3000,
            });
            router.replace('/(app)/(tab)');
        },
        onError: (error) => {
            useShowErrorHandler(error);
        }
    })


    const onSubmit = () => {
        if (form_step_1 && form_step_2 && form_step_3 && auth_data) {
            const data: CreateAccountRequest = {
                ...form_step_1,
                ...form_step_2,
                ...form_step_3,
                user_id: auth_data.user.id,
                password,
            }
            mutate(data);
        } else {
            showMessage({
                message: 'Đã xảy ra lỗi không xác định, vui lòng thử lại sau',
                type: 'danger',
                duration: 3000,
            });
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, backgroundColor: "#fff"}}
            keyboardVerticalOffset={24}
        >
            <TouchableWithoutFeedback style={{flex: 1, justifyContent: "space-between"}} onPress={Keyboard.dismiss}>
                <YStack flex={1} justifyContent="space-between" padding="$4" backgroundColor="#fff">
                    <YStack gap="$3">
                        <Paragraph fontSize="$6">
                            Mật khẩu tài khoản là mật khẩu bạn sử dụng để thao tác với tài khoản ví này.
                        </Paragraph>

                        <Input
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            backgroundColor="#fff"
                            placeholder="Tạo mật khẩu giao dịch mới"
                        />

                        <YStack gap="$2">
                            {rules.map((rule, idx) => {
                                const valid = rule.isValid(password)
                                return (
                                    <XStack key={idx} alignItems="center" gap="$2">
                                        {valid ? (
                                            <Check color="green" size={16}/>
                                        ) : (
                                            <X color="red" size={16}/>
                                        )}
                                        <Text color={valid ? 'green' : 'red'}>{rule.label}</Text>
                                    </XStack>
                                )
                            })}
                        </YStack>
                        <Paragraph>
                            Hãy lưu ngay mật khẩu giao dịch của bạn do không thể gửi mật khẩu tới email của bạn vì mục
                            đích bảo mật.
                        </Paragraph>
                    </YStack>
                    {isPending ? <Spinner/> :
                        <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10"
                                disabled={!allValid} onPress={onSubmit}>
                            Xác nhận
                        </Button>
                    }
                </YStack>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}