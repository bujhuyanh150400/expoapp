import {Button, Paragraph, Sheet, XStack, YStack} from "tamagui";
import React, {Dispatch, FC, SetStateAction, useState} from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet, Text, TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {_TradeType} from "@/lib/@type";

type TransactionSheetProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    tradeType: _TradeType,
    price: number
}
const formatNumber = (num: number) => {
    return num.toFixed(2);
};
const parseToNumber = (text: string) => {
    const num = Number(text);
    return isNaN(num) ? 0 : num;
};
const SNAP_CLOSE = 35;
const SNAP_OPEN = 65;
const TransactionSheet: FC<TransactionSheetProps> = (props) => {
    const [snapPoint, setSnapPoint] = useState(SNAP_CLOSE);
    const [amount, setAmount] = useState<string>("0.01");
    return (
        <Sheet
            forceRemoveScrollEnabled={true}
            modal={true}
            open={props.open}
            onOpenChange={props.setOpen}
            snapPoints={[snapPoint]}
            dismissOnSnapToBottom
            zIndex={100_000}
            animation="medium"
        >
            <Sheet.Overlay
                animation="lazy"
                backgroundColor="$shadow6"
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />
            <Sheet.Handle/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{flex: 1}}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Sheet.Frame padding="$4" gap="$2">
                        <XStack>

                        </XStack>
                        <Paragraph>Khối lượng</Paragraph>
                        <View style={styles.container}>
                            <TouchableOpacity onPress={() => {
                                const num = parseToNumber(amount);
                                const increased = num - 0.01;
                                if (increased >= 0.01) {
                                    setAmount(formatNumber(increased));
                                }
                            }} style={[
                                styles.button,
                            ]}>
                                <Text style={styles.buttonText}>−</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.input}
                                onFocus={() => setSnapPoint(SNAP_OPEN)}
                                onBlur={() => {
                                    const num = parseToNumber(amount);
                                    setAmount(formatNumber(num));
                                    setSnapPoint(SNAP_CLOSE);
                                }}
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={(text) => setAmount(text)}
                            />
                            <TouchableOpacity onPress={() => {
                                const num = parseToNumber(amount);
                                const increased = num + 0.01;
                                setAmount(formatNumber(increased));
                            }} style={[
                                styles.button,
                            ]}>
                                <Text style={styles.buttonText}>＋</Text>
                            </TouchableOpacity>
                        </View>
                        <XStack gap="$2" alignItems="center">
                            <Button onPress={() => props.setOpen(false)}>Hủy</Button>
                            <Button
                                flex={1} theme={props.tradeType === _TradeType.BUY ? "blue" : "red"}
                                backgroundColor={props.tradeType === _TradeType.BUY ? "#168BFC" : "#EC4841"}
                                color="#fff"
                                fontWeight="bold"
                                onPress={() => {

                                }}
                            >
                                <YStack alignItems="center" justifyContent="center">
                                    <Paragraph theme="alt2" fontSize="$2" color="#fff">Xác nhận {props.tradeType === _TradeType.BUY ? "Mua" : "Bán"} {amount} lô</Paragraph>
                                    <Paragraph theme="alt2" fontSize="$5" fontWeight="500" lineHeight={0} color="#fff">{props.price}</Paragraph>
                                </YStack>
                            </Button>
                        </XStack>
                    </Sheet.Frame>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Sheet>
    )
}


const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginBottom: 20
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        marginHorizontal: 10,
        borderRadius: 6,
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    buttonText: {
        fontSize: 20,
        color: '#ccc',
        fontWeight: 'bold',
    },
});


export default TransactionSheet;