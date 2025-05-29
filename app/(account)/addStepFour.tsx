import React, {useState} from 'react'
import {Input, YStack, Text, XStack, Button, Paragraph} from 'tamagui'
import {Check, X} from '@tamagui/lucide-icons'
import {Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from "react-native";
import useAddAccountStore from "@/lib/store/addAccountStore";

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
    const [password, setPassword] = useState('')

    const allValid = rules.every((rule) => rule.isValid(password))

    const {form_step_1, form_step_2, form_step_3} = useAddAccountStore();

    const onSubmit = () => {
        const data = {
            ...form_step_1,
            ...form_step_2,
            ...form_step_3,
            password: password,
        }
        console.log(data)
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

                    <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10"
                            disabled={!allValid} onPress={onSubmit}>
                        Xác nhận
                    </Button>
                </YStack>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}