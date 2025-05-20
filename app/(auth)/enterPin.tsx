import React, {useCallback, useEffect, useState} from 'react';
import {
    SafeAreaView,
    Text,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    TextInput as RNTextInput, Platform, Alert,
} from 'react-native';

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {CELL_PIN_INPUT} from "@/lib/constant";
import {Button, Circle, H6, YStack} from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as LocalAuthentication from "expo-local-authentication";
import useAuthStore from "@/lib/store/authStore";
import {showMessage} from "react-native-flash-message";
import {useFocusEffect, useNavigation, useRouter} from "expo-router";
import useCheckBiometrics from "@/lib/hooks/useCheckBiometrics";
import {StackActions} from "@react-navigation/native";

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

export default function EnterPinScreen() {
    const router = useRouter();

    // chặn hành vi vuốt về
    const navigation = useNavigation();
    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({ gestureEnabled: false });
            return () => {
                navigation.setOptions({ gestureEnabled: true });
            };
        }, [])
    );

    const [pin, setPin] = useState<string>('');
    const [acceptPin, setAcceptPin] = useState<boolean>(false);

    const hasBiometrics = useCheckBiometrics();

    const ref = useBlurOnFulfill({value: pin, cellCount: CELL_PIN_INPUT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: pin,
        setValue: setPin,
    });

    const {login} = useAuthStore();

    useEffect(() => {
        pin.length === CELL_PIN_INPUT ? setAcceptPin(true) : setAcceptPin(false);
    }, [pin]);

    const handleAcceptPin = useCallback(async () => {
        Alert.alert(
            "Xác nhận",
            "Nếu bạn đồng ý, mã PIN sẽ được lưu trữ trên thiết bị của bạn và sẽ được sử dụng để xác thực",
            [
                {text: "Huỷ", style: "cancel"},
                {text: "Đồng ý",
                    onPress: async () => {
                        try {
                            const auth = await LocalAuthentication.authenticateAsync({
                                promptMessage:
                                    hasBiometrics
                                        ? "Dùng vân tay hoặc nhận diện khuôn mặt để xác thực"
                                        : "Nhập mã PIN của bạn",
                                fallbackLabel: "Dùng mật khẩu PIN",
                                cancelLabel: "Hủy bỏ",
                                disableDeviceFallback: false,
                            });

                            if (auth.success) {
                                await login(pin);
                                router.replace('/(app)');
                            }else{
                                showMessage({
                                    message: "Hệ thống xác thực không thành công, vui lòng thử lại",
                                    type: 'danger',
                                    duration: 3000,
                                });
                            }
                        } catch (err) {
                            console.error(err);
                            showMessage({
                                message: "Có lỗi xảy ra, vui lòng thử lại.",
                                type: 'danger',
                                duration: 3000,
                            });
                        }
                    }
                }
            ],
            {cancelable: true}
        );
    },[pin])

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
                        <H6 style={{
                            fontWeight: 'bold',
                        }}>Xin hãy nhập mã PIN</H6>
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
                    </YStack>
                    <Button
                        disabled={!acceptPin}
                        size="$4" theme="active"
                        onPress={handleAcceptPin}
                        icon={!acceptPin ? <AntDesign name="lock"/> : <AntDesign name="check"/>}
                    >
                        {acceptPin ? "Xác thực mã PIN" : "Vui lòng nhập mã PIN trước"}
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
