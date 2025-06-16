import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import React, {Dispatch, FC, SetStateAction, useCallback, useEffect, useState} from 'react';
import CandleChart from "@/components/chart/CandleChart";
import {_AccountType, _Timeframe, _TradeType} from "@/lib/@type";
import {router, useLocalSearchParams} from "expo-router";
import useLiveTradingData from "@/lib/hooks/useLiveTradingData";
import useAppStore from "@/lib/store/appStore";
import {showMessage} from "react-native-flash-message";
import {Button, Card, H6, Paragraph, Sheet, XStack, YStack} from "tamagui";
import LineChart from "@/components/chart/LineChart";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {FocusAwareStatusBar} from "@/components/FocusAwareStatusBar";
import useGetAccountActive, {UseGetAccountActiveHookType} from "@/lib/hooks/useGetAccountActive";
import DefaultStyle from "@/components/ui/DefaultStyle";
import {Account} from "@/api/account/type";
import {CandleChartType} from "@/components/chart/type";
import {useMutation} from "@tanstack/react-query";
import {useShowErrorHandler} from "@/lib/hooks/useApiErrorHandler";
import transactionAPI from "@/api/transaction";
import {StoreTransactionRequestType} from "@/api/transaction/type";


enum _TypeChart {
    CANDLE = "CANDLE",
    LINE = "LINE",
}

const timeframesSelect = [
    {label: '1M', value: _Timeframe.OneMinute},
    {label: '30M', value: _Timeframe.ThirtyMinutes},
    {label: '45M', value: _Timeframe.FortyFiveMinutes},
    {label: '1H', value: _Timeframe.OneHour},
    {label: '1D', value: _Timeframe.OneDay},
    {label: '1W', value: _Timeframe.OneWeek},
];

const TradingScreen = () => {
    const [timeframe, setTimeframe] = useState<_Timeframe>(_Timeframe.OneMinute);
    const [typeChart, setTypeChart] = useState<_TypeChart>(_TypeChart.LINE);
    const {symbol} = useLocalSearchParams<{ symbol?: string }>();
    const [openTransaction, setOpenTransaction] = useState<boolean>(false);
    const [tradeType, setTradeType] = useState<_TradeType>(_TradeType.BUY);

    const queryAccountActive = useGetAccountActive();

    const setLoading = useAppStore(state => state.setLoading);

    const {meta, candles, lines, loading, error} = useLiveTradingData(symbol, timeframe);

    useEffect(() => {
        setLoading(loading);
        if (error) {
            showMessage({
                message: 'Có lỗi xảy ra',
                description: 'Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.',
                type: 'danger',
                duration: 3000,
            })
            router.back();
        }
    }, [loading, error]);

    const lastValue = candles ? candles[candles.length - 1] : null;

    const activeAccount = queryAccountActive.account;

    const setTransactionOpen = useCallback((type: _TradeType) => {
        setOpenTransaction(true);
        setTradeType(type);
    }, []);

    return (
        <>
            <FocusAwareStatusBar hidden={true}/>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#fff",
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    justifyContent: "space-between"
                }}>
                <YStack style={{
                    flex: 1
                }}>
                    {activeAccount &&
                        <Card elevate size="$4" bordered backgroundColor="white" marginBottom={30} paddingVertical={10}
                              paddingHorizontal={20}>
                            <YStack gap="$2">
                                <H6 fontWeight="bold">{Number(queryAccountActive.accountBalance).toLocaleString('en-US')} {activeAccount.currency.currency}</H6>
                                <XStack gap="$2" alignItems="center">
                                    <View
                                        style={[DefaultStyle.badge, {
                                            backgroundColor: activeAccount.type === _AccountType.TEST_ACCOUNT ? '#FEF08A' : '#BBF7D0',
                                        }]}
                                    >
                                        <Paragraph theme="alt2"
                                                   fontSize="$2">{activeAccount.type === _AccountType.TEST_ACCOUNT ? 'Credit' : 'Thật'}</Paragraph>
                                    </View>
                                    <View
                                        style={[DefaultStyle.badge, {
                                            backgroundColor: '#E5E5E5'
                                        }]}
                                    >
                                        <Paragraph theme="alt2"
                                                   fontSize="$2">{activeAccount.account_type.name}</Paragraph>
                                    </View>
                                    <Paragraph theme="alt2" fontSize="$2">{activeAccount.code}</Paragraph>
                                </XStack>
                            </YStack>
                        </Card>
                    }
                    <XStack gap="$2" width={"100%"} justifyContent="space-between" alignItems="flex-start"
                            marginBottom={24}>
                        <YStack gap="$2" flex={1}>
                            <Paragraph fontWeight={700} fontSize={24}>{meta?.symbol ?? "Symbol"}</Paragraph>
                            <Paragraph fontWeight={700}
                                       color="#ddd">{meta?.currency_base ?? "Symbol"} - {meta?.currency_quote ?? "Symbol"}</Paragraph>
                            <Paragraph fontWeight={500} fontSize={24}>{lastValue?.close ?? 0}</Paragraph>
                        </YStack>
                        <YStack gap="$2" flex={1} alignItems={"flex-end"}>
                            <XStack gap="$2" alignItems="flex-end">
                                <TouchableOpacity
                                    onPress={() => setTypeChart(_TypeChart.LINE)}
                                    style={{
                                        padding: 12,
                                        borderRadius: 12,
                                        backgroundColor: typeChart === _TypeChart.LINE ? '#FCD34D' : '#ccc',
                                    }}
                                >
                                    <FontAwesome6 name="chart-line" size={14} color="white"/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setTypeChart(_TypeChart.CANDLE)}
                                    style={{
                                        padding: 12,
                                        borderRadius: 12,
                                        backgroundColor: typeChart === _TypeChart.CANDLE ? '#FCD34D' : '#ccc',
                                    }}
                                >
                                    <MaterialIcons name="candlestick-chart" size={14} color="white"/>
                                </TouchableOpacity>
                            </XStack>
                            <XStack gap="$1" alignItems="center">
                                <Paragraph fontWeight={700} fontSize={12} color={"#ccc"}>Open:</Paragraph>
                                <Paragraph fontWeight={500} fontSize={12}>{lastValue?.open ?? 0}</Paragraph>
                            </XStack>
                            <XStack gap="$1" alignItems="center">
                                <Paragraph fontWeight={700} fontSize={12} color={"$green8"}>High:</Paragraph>
                                <Paragraph fontWeight={500} fontSize={12}>{lastValue?.high ?? 0}</Paragraph>
                            </XStack>
                            <XStack gap="$1" alignItems="center">
                                <Paragraph fontWeight={700} fontSize={12} color={"$red8"}>Low:</Paragraph>
                                <Paragraph fontWeight={500} fontSize={12}>{lastValue?.low ?? 0}</Paragraph>
                            </XStack>
                        </YStack>
                    </XStack>
                    {(!loading && lines.length > 0 && candles.length > 0) &&
                        (
                            <>
                                {typeChart === _TypeChart.LINE && <LineChart data={lines} timeFrame={timeframe}/>}
                                {typeChart === _TypeChart.CANDLE && <CandleChart data={candles} timeFrame={timeframe}/>}
                            </>
                        )
                    }
                </YStack>
                <YStack gap="$2">
                    <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"} marginTop={10}>
                        {timeframesSelect.map((tf) => (
                            <TouchableOpacity
                                key={tf.value}
                                onPress={() => setTimeframe(tf.value)}
                                style={{
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                    borderRadius: 12,
                                    backgroundColor: timeframe === tf.value ? '#FCD34D' : '#ccc',
                                }}
                            >
                                <Paragraph style={{color: '#fff'}} fontWeight={700} fontSize={12}>{tf.label}</Paragraph>
                            </TouchableOpacity>
                        ))}
                    </XStack>
                    <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"} marginTop={10}>
                        <Button flex={1} size="$6" theme="red" backgroundColor="#EC4841" color="#fff" fontWeight="bold"
                                onPress={() => setTransactionOpen(_TradeType.SELL)}
                        >
                            <YStack flex={1} alignItems="center" justifyContent="center">
                                <Paragraph theme="alt2" fontSize="$3" color="#fff">BÁN</Paragraph>
                                <Paragraph theme="alt2" fontSize="$6" fontWeight="500"
                                           color="#fff">{lastValue?.close}</Paragraph>
                            </YStack>
                        </Button>
                        <Button flex={1} size="$6" theme="blue" backgroundColor="#168BFC" color="#fff" fontWeight="bold"
                                onPress={() => setTransactionOpen(_TradeType.BUY)}
                        >
                            <YStack flex={1} alignItems="center" justifyContent="center">
                                <Paragraph theme="alt2" fontSize="$3" color="#fff">MUA</Paragraph>
                                <Paragraph theme="alt2" fontSize="$6" fontWeight="500"
                                           color="#fff">{lastValue?.close}</Paragraph>
                            </YStack>
                        </Button>
                    </XStack>
                </YStack>
            </View>
            <TransactionOffCanvas
                queryAccountActive={queryAccountActive}
                open={openTransaction}
                setOpen={setOpenTransaction}
                activeAccount={activeAccount}
                lastValue={lastValue}
                symbol={symbol}
                tradeType={tradeType}
            />
        </>
    )
}

export default TradingScreen;

type TransactionOffCanvasProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    activeAccount: Account | null,
    lastValue: CandleChartType | null,
    tradeType: _TradeType,
    symbol?: string,
    queryAccountActive: UseGetAccountActiveHookType
}
const SNAP_CLOSE = 35;
const SNAP_OPEN = 65;
const parseToNumber = (text: string) => {
    const num = Number(text);
    return isNaN(num) ? 0 : num;
};
const formatNumber = (num: number) => {
    return num.toFixed(2);
};


const TransactionOffCanvas: FC<TransactionOffCanvasProps> =
    ({
         open,
         setOpen,
         activeAccount,
         lastValue,
         tradeType,
         symbol,
         queryAccountActive
     }) => {
        const [amount, setAmount] = useState<string>("0.01");
        const [snapPoint, setSnapPoint] = useState<number>(SNAP_CLOSE);
        const lastPrice = lastValue?.close ?? 0;
        const [price, setPrice] = useState<string>("0");

        const {mutate, isPending} = useMutation({
            mutationFn: (data: StoreTransactionRequestType) => transactionAPI.store(data),
            onSuccess: async () => {
                showMessage({
                    message: "Giao dịch thành công",
                    type: 'success',
                    duration: 3000,
                });
                setOpen(false);
                await queryAccountActive.get(); // Refresh account data after transaction
            },
            onError: (error) => {
                useShowErrorHandler(error);
            }
        })

        const setLoading = useAppStore(state => state.setLoading);

        useEffect(() => setLoading(isPending), [isPending]);

        useEffect(() => {
            if (!open) {
                Keyboard.dismiss();
            } else {
                setSnapPoint(SNAP_CLOSE);
                setAmount("0.01"); // reset amount when open
            }
        }, [open]);

        useEffect(() => {
            if (lastPrice > 0) {
                setPrice(formatNumber(parseToNumber(amount) * lastPrice));
            }
        }, [lastPrice, amount]);

        return (
            <Sheet
                forceRemoveScrollEnabled={true}
                modal={true}
                open={open}
                onOpenChange={setOpen}
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
                                <Paragraph fontWeight={500} color={"#ccc"}>Phí: ~0 USD</Paragraph>
                                <View style={{width: 1, height: '60%', backgroundColor: '#ccc'}}/>
                                <Paragraph fontWeight={500} color={"#ccc"}>Đòn
                                    bảy: {activeAccount?.lever?.min ?? 0}:{activeAccount?.lever?.max ?? 0}</Paragraph>
                            </XStack>
                            <XStack gap="$2" alignItems="center">
                                <Button onPress={() => setOpen(false)}>Hủy</Button>
                                <Button
                                    flex={1} theme={tradeType === _TradeType.BUY ? "blue" : "red"}
                                    backgroundColor={tradeType === _TradeType.BUY ? "#168BFC" : "#EC4841"} color="#fff"
                                    fontWeight="bold"
                                    onPress={() => {
                                        mutate({
                                            account_id: activeAccount?.id ?? 0,
                                            symbol: symbol ?? '',
                                            currency: price,
                                            type: tradeType,
                                            number: amount,
                                        });
                                    }}
                                >
                                    <YStack alignItems="center" justifyContent="center">
                                        <Paragraph theme="alt2" fontSize="$2" color="#fff">XÁC
                                            NHẬN {tradeType === _TradeType.BUY ? "MUA" : "BÁN"}</Paragraph>
                                        <Paragraph theme="alt2" fontSize="$5" fontWeight="500"
                                                   color="#fff">{price}</Paragraph>
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