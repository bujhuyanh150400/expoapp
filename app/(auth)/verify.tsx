import {KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from "react-native-confirmation-code-field";
import {CELL_PIN_INPUT} from "@/lib/constant";
import {useFocusEffect, useNavigation, useRouter} from "expo-router";
import useAuthStore from "@/lib/store/authStore";
import {_AuthStatus} from "@/lib/@type";
import {Paragraph, Circle, H6, YStack} from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";
import {TextInput as RNTextInput} from "react-native/Libraries/Components/TextInput/TextInput";
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

export default function VerifyScreen() {
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
    const [error, setError] = useState<string>('');
    const [errorCount, setErrorCount] = useState<number>(0);

    const {verify, pin_code} = useAuthStore();

    const ref = useBlurOnFulfill({value: pin, cellCount: CELL_PIN_INPUT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: pin,
        setValue: setPin,
    });

    useEffect(() => {
        if (pin.length === CELL_PIN_INPUT) {
            if (pin === pin_code) {
                verify();
                router.replace('/(app)')
            } else {
                showMessage({
                    message: "Mã PIN không chính xác",
                    type: "danger",
                    icon: "danger",
                    duration: 2000,
                });
                setPin('');
            }
        }
    }, [pin, pin_code]);


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
                                    {symbol ? "." : isFocused ? <Cursor/> : null}
                                </Text>
                            )}
                        />
                        <Paragraph size="$2" fontWeight="800" color="$red10">
                            {error}
                        </Paragraph>
                    </YStack>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}