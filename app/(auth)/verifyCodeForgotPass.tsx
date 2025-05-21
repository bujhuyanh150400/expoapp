import {KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {H6, Paragraph, YStack , Spinner} from "tamagui";
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from "react-native-confirmation-code-field";
import React, {useEffect, useState} from "react";
import {TextInput as RNTextInput} from "react-native/Libraries/Components/TextInput/TextInput";
import {CELL_PIN_INPUT} from "@/lib/constant";
import {useRouter} from "expo-router";
import {useDisableBackGesture} from "@/lib/hooks/useDisableBackGesture";
import {useMutation} from "@tanstack/react-query";
import {VerifyCodeRequest} from "@/api/auth/type";
import authAPI from "@/api/auth";
import useForgotPassStore from "@/lib/store/forgotPassStorage";
import ErrorAPIServer from "@/api/commonType";
import {showMessage} from "react-native-flash-message";

const styles = StyleSheet.create({
    root: {flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center'},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {marginTop: 20},
    cell: {
        width: 45,
        height: 45,
        lineHeight: 45,
        fontSize: 18,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        textAlign: 'center',
        margin: 5
    },
    focusCell: {
        borderColor: '#000',
    },
});

export default function VerifyCodeForgotPassScreen() {
    useDisableBackGesture();
    const router = useRouter();
    const [pin, setPin] = useState<string>('');
    const [error, setError] = useState<string>('');

    const ref = useBlurOnFulfill({value: pin, cellCount: CELL_PIN_INPUT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: pin,
        setValue: setPin,
    });

    const {setCode, email} = useForgotPassStore()

    const { mutate, isPending } =  useMutation({
        mutationFn: (data: VerifyCodeRequest) => authAPI.verifyCode(data),
        onSuccess: async () => {
            setCode(pin);
            router.replace('/(auth)/resetPassword')
        },
        onError: (error) => {
            if (error instanceof ErrorAPIServer) {
                if (error.validateError) {
                    const validationErrors = error.validateError;
                    const firstMessage = validationErrors[Object.keys(validationErrors)[0]][0];
                    setError(firstMessage);
                } else if (error.message) {
                    showMessage({
                        message: error.message,
                        type: 'danger',
                        duration: 3000,
                    });
                }
            }
            else {
                showMessage({
                    message: 'Đã xảy ra lỗi không xác định, vui lòng thử lại sau',
                    type: 'danger',
                    duration: 3000,
                });
            }
        }
    })
    useEffect(() => {
        if (pin.length === CELL_PIN_INPUT) {
            if (email){
                mutate({
                    email: email,
                    code: pin
                })
            }else{
                setError('Có loại gì đó không đúng, vui lòng thử lại sau')
            }
        }else{
            setError("")
        }
    }, [pin]);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={64}
            >
                <View className="flex-1 items-center justify-center">
                    <YStack gap="$2" padding="$6" alignItems="center" justifyContent="center">
                        <H6 fontWeight="bold">Xin hãy nhập mã xác thực</H6>
                        <Paragraph style={{textAlign: 'justify', alignSelf: 'stretch'}}>Mã xác thực đổi mật khẩu đã được gửi về mail của bạn, vui lòng check mail và nhập mã xác thực</Paragraph>
                        {isPending
                            ? <Spinner size="large" color="$blue10" />
                            :
                            <CodeField
                                ref={ref as React.RefObject<RNTextInput>}
                                {...props}
                                autoFocus={true}
                                InputComponent={RNTextInput}
                                caretHidden={true}
                                value={pin}
                                onChangeText={setPin}
                                cellCount={CELL_PIN_INPUT}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                autoComplete="one-time-code"
                                renderCell={({index, symbol, isFocused}) => (
                                    <Text
                                        key={index}
                                        style={[styles.cell, isFocused && styles.focusCell]}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {symbol ? symbol : isFocused ? <Cursor/> : null}
                                    </Text>
                                )}
                            />
                        }
                        <Paragraph size="$2" color="$red10">
                            {error}
                        </Paragraph>
                    </YStack>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}