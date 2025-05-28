import {KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View} from "react-native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from "react-native-confirmation-code-field";
import {CELL_PIN_INPUT} from "@/lib/constant";
import {useFocusEffect, useRouter} from "expo-router";
import useAuthStore from "@/lib/store/authStore";
import {Circle, H6, Spinner, YStack} from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";
import {TextInput as RNTextInput} from "react-native/Libraries/Components/TextInput/TextInput";
import {showMessage} from "react-native-flash-message";
import {useDisableBackGesture} from "@/lib/hooks/useDisableBackGesture";
import useCheckBiometrics from "@/lib/hooks/useCheckBiometrics";
import * as LocalAuthentication from "expo-local-authentication";
import {useQuery} from "@tanstack/react-query";
import authAPI from "@/api/auth";

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

export default function VerifyScreen() {

    useDisableBackGesture();

    const router = useRouter();

    const [pin, setPin] = useState<string>('');

    const {verify, pin_code, logout} = useAuthStore();

    const hasBiometrics = useCheckBiometrics();

    const ref = useBlurOnFulfill({value: pin, cellCount: CELL_PIN_INPUT});

    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: pin,
        setValue: setPin,
    });

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const authenticate = async () => {
                try {
                    const result = await LocalAuthentication.authenticateAsync({
                        promptMessage: hasBiometrics
                            ? "Dùng vân tay hoặc nhận diện khuôn mặt để xác thực"
                            : "Nhập mã PIN của bạn",
                        fallbackLabel: "Dùng mật khẩu PIN",
                        cancelLabel: "Hủy bỏ",
                        disableDeviceFallback: false,
                    });
                    if (result.success && isActive) {
                        checkVerify();
                    }
                } catch (err) {
                    console.warn("Biometric error", err);
                }
            };
            authenticate().then();
            return () => {
                isActive = false;
            };
        }, [hasBiometrics])
    );

    useEffect(() => {
        if (pin.length === CELL_PIN_INPUT) {
            if (pin === pin_code) {
                checkVerify();
            } else {
                showMessage({
                    message: "Mã PIN không chính xác",
                    type: "danger",
                    icon: "danger",
                    duration: 2000,
                });
            }
        }
    }, [pin, pin_code]);

    const {refetch, isLoading, isSuccess, isError} = useQuery({
        queryKey: ['authAPI_userProfile'],
        queryFn: authAPI.userProfile,
        enabled: false,
    })

    useEffect(() => {
        if (isSuccess){
            verify();
            router.replace('/(app)/(account)');
        }else if(isError){
            logout();
            router.replace('/(auth)');
            showMessage({
                message: "Thông tin xác thực của bạn hiện không đúng, vui lòng đăng nhập lại",
                type: "danger",
                icon: "danger",
                duration: 2000,
            });
        }
    }, [isSuccess, isError]);

    const checkVerify = useCallback(() => {
        refetch();
    }, []);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={64}
            >
                <View className="flex-1 items-center justify-center ">
                    <YStack gap="$4" padding="$8" alignItems="center" justifyContent="center">
                        <Circle size={100} backgroundColor="#ededed" alignItems="center" justifyContent="center">
                            <Circle size={80} backgroundColor="#e8e8e8" alignItems="center" justifyContent="center">
                                <AntDesign name="lock" size={40} color="#b5b5b5"/>
                            </Circle>
                        </Circle>
                        <H6 style={{fontWeight: 'bold'}}>Xin hãy nhập mã PIN</H6>
                        {isLoading
                            ? <Spinner size="large" color="$blue10"/>
                            : <CodeField
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
                                        {symbol ? "." : isFocused ? <Cursor/> : null}
                                    </Text>
                                )}
                            />
                        }
                    </YStack>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}