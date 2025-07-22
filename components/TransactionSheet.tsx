import {Button, Paragraph, Sheet, XStack, YStack} from "tamagui";
import React, {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {
    Keyboard, Platform,
    StyleSheet, Text, TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {_TradeType, _TransactionTriggerType} from "@/lib/@type";
import {MaterialIcons} from '@expo/vector-icons';
import DefaultColor from "@/components/ui/DefaultColor";
import HorizontalTabBar from "@/components/HorizontalTabBar";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useNestedState from "@/lib/hooks/useNestedState";
import {Account} from "@/api/account/type";
import {Symbol} from "@/api/asset_trading/type";
import {StoreTransactionRequestType} from "@/api/transaction/type";
import {useMutation} from "@tanstack/react-query";
import transactionAPI from "@/api/transaction";
import {showMessage} from "react-native-flash-message";
import {useShowErrorHandler} from "@/lib/hooks/useApiErrorHandler";
import useAppStore from "@/lib/store/appStore";

const formatNumber = (num: number) => {
    return num.toFixed(2);
};
const parseToNumber = (text: string) => {
    const num = Number(text);
    return isNaN(num) ? 0 : num;
};
const calculateProfit = (price: number, percent: string, volume: string, type: "TP" | "SL") => {
    const percentValue = parseToNumber(percent);
    const volumeValue = parseToNumber(volume);
    if (!percentValue || !volumeValue || percentValue < 0 || volumeValue <= 0) {
        return 0;
    }
    if (type === "TP") {
        return (price * volumeValue + ((price * percentValue / 100) * volumeValue)).toFixed(2);
    }
    else {
        return (price * volumeValue - ((price * percentValue / 100) * volumeValue)).toFixed(2);
    }
}
const SNAP_CLOSE = 35;
const SNAP_OPEN = 70;

type TransactionSheetProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    tradeType: _TradeType,
    price: number,
    realtimePrice?: number | null,
    account: Account | null,
    symbol?: Symbol,
}

const TransactionSheet: FC<TransactionSheetProps> = (props) => {
    const [snapPoint, setSnapPoint] = useState(SNAP_CLOSE);
    const [openMore, setOpenMore] = useState<boolean>(false);
    const [tab, setTab] = useState<_TransactionTriggerType>(_TransactionTriggerType.TYPE_TRIGGER_AUTO_TRIGGER);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const {mutate, isPending} = useMutation({
        mutationFn: (data: StoreTransactionRequestType) => transactionAPI.store(data),
        onSuccess: async () => {
            showMessage({
                message: "Giao dịch thành công",
                type: 'success',
                duration: 3000,
            });
            props.setOpen(false);
        },
        onError: (error) => {
            useShowErrorHandler(error);
        }
    })
    const setLoading = useAppStore(state => state.setLoading);


    const [form, setForm] = useNestedState<StoreTransactionRequestType>({
        account_id: 0,
        asset_trading_id: 0,
        type: props.tradeType,
        type_trigger: _TransactionTriggerType.TYPE_TRIGGER_NOW,
        volume: "0.01",
        entry_price: "",
        trigger_price: "",
        percent_take_profit: "",
        percent_stop_loss: "",
    });

    const [error, setError] = useNestedState({
        isError: false,
        volume: "",
        trigger_price: "",
        percent_stop_loss:"",
        percent_take_profit:""
    })

    useEffect(() => {
        if (parseToNumber(form.volume) < 0) {
            setError({volume: "Khối lượng không được nhỏ hơn 0.01", isError: true});
        } else {
            setError({volume: "", isError: false});
        }
        if (form.percent_stop_loss){
            const stopLoss = parseToNumber(form.percent_stop_loss);
            if (stopLoss < 0) {
                setError({percent_stop_loss: "Cắt lỗ phải lớn hơn 0 %", isError: true});
            } else {
                setError({percent_stop_loss: "", isError: false});
            }
        }
        if (form.percent_take_profit){
            const stopLoss = parseToNumber(form.percent_take_profit);
            if (stopLoss < 0) {
                setError({percent_take_profit: "Chốt lời phải lớn hơn 0 %", isError: true});
            } else {
                setError({percent_take_profit: "" , isError: false});
            }
        }
    }, [form]);

    useEffect(() => {
        if (form.trigger_price) {
            if (form.type_trigger === _TransactionTriggerType.TYPE_TRIGGER_LOW_BUY) {
                if (parseToNumber(form.trigger_price) >= props.price) {
                    setError({trigger_price: `Giá mua thấp phải nhỏ hơn ${props.price}`, isError: true});
                } else {
                    setError({trigger_price: ``, isError: false});
                }
            }else if (form.type_trigger === _TransactionTriggerType.TYPE_TRIGGER_HIGH_BUY) {
                if (parseToNumber(form.trigger_price) <= props.price) {
                    setError({trigger_price: `Giá mua cao phải lớn hơn ${props.price}`, isError: true});
                } else {
                    setError({trigger_price: ``, isError: false});
                }
            }
        }
    }, [props.price, form.trigger_price, form.type_trigger]);

    useEffect(() => {
        if (props.open){
            if (props.symbol && props.account) {
                setForm({
                    account_id: props.account.id,
                    asset_trading_id: props.symbol.id,
                });
            }
        }else{
            setOpenMore(false);
            setForm({
                account_id: 0,
                asset_trading_id: 0,
                type: props.tradeType,
                type_trigger: _TransactionTriggerType.TYPE_TRIGGER_NOW,
                volume: "0.01",
                entry_price: "",
                trigger_price: "",
                percent_take_profit: "",
                percent_stop_loss: "",
            })
        }
    }, [props.symbol, props.account, props.open]);

    useEffect(() => {
        if (openMore) {
            setForm({
                percent_take_profit: "0.00",
                percent_stop_loss: "0.00",
            });
            if (tab === _TransactionTriggerType.TYPE_TRIGGER_AUTO_TRIGGER) {
                setSnapPoint(SNAP_OPEN);
            } else {
                setForm({trigger_price: props.price.toString()});
                setSnapPoint(SNAP_OPEN + 10);
            }
            setForm({type_trigger: tab});
        } else {
            setForm({
                percent_take_profit: "",
                percent_stop_loss: "",
            });
            setSnapPoint(SNAP_CLOSE);
            setForm({trigger_price: ""});
            setForm({type_trigger: _TransactionTriggerType.TYPE_TRIGGER_NOW});
        }
    }, [openMore, tab]);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    useEffect(() => {
        setLoading(isPending);
    }, [isPending]);

    return (
        <Sheet
            forceRemoveScrollEnabled={true}
            modal={true}
            open={props.open}
            onOpenChange={props.setOpen}
            snapPoints={[snapPoint]}
            dismissOnSnapToBottom
            zIndex={100_000}
            animation={"fast"}
        >
            <Sheet.Overlay
                animation="lazy"
                backgroundColor="$shadow6"
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />
            <Sheet.Handle/>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                showsVerticalScrollIndicator={false}
                scrollEnabled={keyboardVisible}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Sheet.Frame padding="$4" gap="$2">
                        <XStack alignItems={"center"} justifyContent={"flex-end"}>
                            <TouchableOpacity
                                style={[
                                    styles.btn_round, {
                                        backgroundColor: openMore ? DefaultColor.slate[300] : DefaultColor.slate[400],
                                    }
                                ]}
                                onPress={() => {
                                    setOpenMore(!openMore);
                                }}
                            >
                                <MaterialIcons name="candlestick-chart" size={24} color={
                                    openMore ? "white" : "black"
                                }/>
                            </TouchableOpacity>
                        </XStack>
                        <View>
                            {!openMore ? (
                                <YStack>
                                    <Paragraph>Khối lượng</Paragraph>
                                    <InputPlusMinus
                                        value={form.volume}
                                        reference={0.01}
                                        onChange={(value) => setForm({volume: value})}
                                        onFocus={() => setSnapPoint(SNAP_OPEN)}
                                        onBlur={() => {
                                            const num = parseToNumber(form.volume);
                                            setForm({volume: formatNumber(num)})
                                            setSnapPoint(SNAP_CLOSE);
                                        }}
                                        pre={"Lô"}
                                    />
                                    {error?.volume && (
                                        <Paragraph color="red">{error.trigger_price}</Paragraph>
                                    )}
                                </YStack>
                            ) : (
                                <>
                                    <HorizontalTabBar<_TransactionTriggerType>
                                        tabs={[
                                            {
                                                key: _TransactionTriggerType.TYPE_TRIGGER_AUTO_TRIGGER,
                                                item: (isActive) => (
                                                    <Paragraph
                                                        style={{
                                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                                            fontWeight: isActive ? 700 : 'normal'
                                                        }}
                                                    >
                                                        Lệnh thị trường
                                                    </Paragraph>
                                                ),
                                            },
                                            {
                                                key: _TransactionTriggerType.TYPE_TRIGGER_LOW_BUY,
                                                item: (isActive) => (
                                                    <Paragraph
                                                        style={{
                                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                                            fontWeight: isActive ? 700 : 'normal'
                                                        }}
                                                    >
                                                        Chờ mua giá thấp
                                                    </Paragraph>
                                                ),
                                            },
                                            {
                                                key: _TransactionTriggerType.TYPE_TRIGGER_HIGH_BUY,
                                                item: (isActive) => (
                                                    <Paragraph
                                                        style={{
                                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                                            fontWeight: isActive ? 700 : 'normal'
                                                        }}
                                                    >
                                                        Chờ mua giá cao
                                                    </Paragraph>
                                                ),
                                            },
                                        ]}
                                        activeKey={tab}
                                        onTabPress={setTab}
                                        style={{
                                            marginBottom: 20
                                        }}
                                    />
                                    <YStack>
                                        <YStack gap={"$2"}>
                                            <YStack>
                                                <Paragraph>Khối lượng</Paragraph>
                                                <InputPlusMinus
                                                    value={form.volume}
                                                    reference={0.01}
                                                    onChange={(value) => setForm({volume: value})}
                                                    pre={"Lô"}
                                                />
                                                {error?.volume && (
                                                    <Paragraph color="red">{error.volume}</Paragraph>
                                                )}
                                            </YStack>

                                            {(tab === _TransactionTriggerType.TYPE_TRIGGER_LOW_BUY
                                                || tab === _TransactionTriggerType.TYPE_TRIGGER_HIGH_BUY) && (
                                                <YStack>
                                                    <Paragraph>Giá chốt</Paragraph>
                                                    <InputPlusMinus
                                                        value={form.trigger_price || ""}
                                                        reference={0.1}
                                                        onChange={(value) => setForm({trigger_price: value})}
                                                        pre={"Lô"}
                                                    />
                                                    {error?.trigger_price && (
                                                        <Paragraph color="red">{error.trigger_price}</Paragraph>
                                                    )}
                                                </YStack>
                                            )}
                                            <YStack>
                                                <Paragraph>Chốt lời</Paragraph>
                                                <InputPlusMinus
                                                    value={form.percent_take_profit || ""}
                                                    reference={0.01}
                                                    onChange={(value) => setForm({percent_take_profit: value})}
                                                    pre={"+%"}
                                                />
                                                {(form.percent_take_profit && parseToNumber(form.percent_take_profit) > 0 ) && (
                                                    <Paragraph color={DefaultColor.slate[500]}>
                                                        Gía chốt lời:{calculateProfit(props.price, form.percent_take_profit, form.volume, "TP")}
                                                    </Paragraph>
                                                )}
                                                {error?.percent_take_profit && (
                                                    <Paragraph color="red">{error.percent_take_profit}</Paragraph>
                                                )}
                                            </YStack>
                                            <YStack>
                                                <Paragraph>Cắt lỗ</Paragraph>
                                                <InputPlusMinus
                                                    value={form.percent_stop_loss || ""}
                                                    reference={0.01}
                                                    onChange={(value) => setForm({percent_stop_loss: value})}
                                                    pre={"-%"}
                                                />
                                                {(form.percent_stop_loss && parseToNumber(form.percent_stop_loss) > 0 ) && (
                                                    <Paragraph color={DefaultColor.slate[500]}>
                                                        Gía cắt lỗ:{calculateProfit(props.price, form.percent_stop_loss, form.volume, "SL")}
                                                    </Paragraph>
                                                )}
                                                {error?.percent_stop_loss && (
                                                    <Paragraph color="red">{error.percent_stop_loss}</Paragraph>
                                                )}
                                            </YStack>
                                        </YStack>
                                    </YStack>
                                </>
                            )}
                        </View>
                        <XStack gap="$2" alignItems="center" marginTop={"$4"}>
                            <Button onPress={() => props.setOpen(false)}>Hủy</Button>
                            <Button
                                disabled={error.isError}
                                flex={1} theme={props.tradeType === _TradeType.BUY ? "blue" : "red"}
                                backgroundColor={props.tradeType === _TradeType.BUY ?
                                    (error.isError ? DefaultColor.blue[300] : DefaultColor.blue[500]) :
                                    (error.isError ? DefaultColor.blue[300] : DefaultColor.blue[500])}
                                color="#fff"
                                fontWeight="bold"
                                onPress={() => {
                                    mutate({
                                        account_id: form.account_id,
                                        asset_trading_id: form.asset_trading_id,
                                        type: form.type,
                                        type_trigger: form.type_trigger,
                                        volume: form.volume,
                                        entry_price: form.entry_price,
                                        trigger_price: form.trigger_price,
                                        percent_take_profit: form.percent_take_profit,
                                        percent_stop_loss: form.percent_stop_loss,
                                    })
                                }}
                            >
                                <YStack alignItems="center" justifyContent="center">
                                    <Paragraph theme="alt2" fontSize="$2" color="#fff">Xác
                                        nhận {props.tradeType === _TradeType.BUY ? "Mua" : "Bán"} {form.volume} lô</Paragraph>
                                    <Paragraph theme="alt2" fontSize="$5" fontWeight="500" color="#fff">
                                        {props.price}
                                    </Paragraph>
                                </YStack>
                            </Button>
                        </XStack>
                    </Sheet.Frame>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </Sheet>
    )
}


type InputPlusMinusProps = {
    value: string,
    reference: number,
    onChange: (value: string) => void,
    onFocus?: () => void,
    onBlur?: () => void,
    pre?: string
}

const InputPlusMinus: FC<InputPlusMinusProps> = props => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                const num = parseToNumber(props.value);
                const increased = num - props.reference;
                if (increased >= props.reference) {
                    props.onChange(formatNumber(increased));
                }
            }} style={[
                styles.button,
            ]}>
                <Text style={styles.buttonText}>−</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                keyboardType="numeric"
                value={props.value}
                onChangeText={(text) => props.onChange(text)}
            />
            <TouchableOpacity
                onPress={() => {
                    const num = parseToNumber(props.value);
                    const increased = num + props.reference;
                    props.onChange(formatNumber(increased));

                }}
                style={[styles.button]}
            >
                <Text style={styles.buttonText}>＋</Text>
            </TouchableOpacity>
            {props.pre && (
                <View style={styles.pre}>
                    <Paragraph>{props.pre}</Paragraph>
                </View>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: DefaultColor.slate[300],
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    input: {
        paddingHorizontal: 12,
        paddingVertical: 0,
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        marginHorizontal: 10,
        borderRadius: 6,
    },
    button: {
        paddingHorizontal: 12,
    },
    buttonText: {
        fontSize: 20,
        color: DefaultColor.slate[300],
        fontWeight: 'bold',
    },
    pre: {
        alignItems: "center",
        justifyContent: "center",
        borderLeftWidth: 1,
        borderColor: DefaultColor.slate[300],
        paddingLeft: 10
    },
    btn_round: {
        width: 40,
        height: 40,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: DefaultColor.slate[100],
    }
});


export default TransactionSheet;