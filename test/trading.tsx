// import {
//     Keyboard,
//     KeyboardAvoidingView,
//     Platform,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     TouchableWithoutFeedback,
//     View
// } from "react-native";
// import React, {Dispatch, FC, SetStateAction, useCallback, useEffect, useState} from 'react';
// import CandleChart from "@/components/chart/CandleChart";
// import {_AccountType, _Timeframe, _TradeType} from "@/lib/@type";
// import {router, useLocalSearchParams} from "expo-router";
// import useLiveTradingData from "@/lib/hooks/useLiveTradingData";
// import useAppStore from "@/lib/store/appStore";
// import {showMessage} from "react-native-flash-message";
// import {Button, Card, H6, Paragraph, Sheet, XStack, YStack} from "tamagui";
// import LineChart from "@/components/chart/LineChart";
// import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import {FocusAwareStatusBar} from "@/components/FocusAwareStatusBar";
// import useGetAccountActive, {UseGetAccountActiveHookType} from "@/lib/hooks/useGetAccountActive";
// import DefaultStyle from "@/components/ui/DefaultStyle";
// import {Account} from "@/api/account/type";
// import {CandleChartType} from "@/components/chart/type";
// import {useMutation} from "@tanstack/react-query";
// import {useShowErrorHandler} from "@/lib/hooks/useApiErrorHandler";
// import transactionAPI from "@/api/transaction";
// import {StoreTransactionRequestType} from "@/api/transaction/type";
//
//
// enum _TypeChart {
//     CANDLE = "CANDLE",
//     LINE = "LINE",
// }
//
// const timeframesSelect = [
//     {label: '1M', value: _Timeframe.OneMinute},
//     {label: '30M', value: _Timeframe.ThirtyMinutes},
//     {label: '45M', value: _Timeframe.FortyFiveMinutes},
//     {label: '1H', value: _Timeframe.OneHour},
//     {label: '1D', value: _Timeframe.OneDay},
//     {label: '1W', value: _Timeframe.OneWeek},
// ];
//
// const TradingScreen = () => {
//     const [timeframe, setTimeframe] = useState<_Timeframe>(_Timeframe.OneMinute);
//     const [typeChart, setTypeChart] = useState<_TypeChart>(_TypeChart.LINE);
//     const {symbol} = useLocalSearchParams<{ symbol?: string }>();
//     const [openTransaction, setOpenTransaction] = useState<boolean>(false);
//     const [tradeType, setTradeType] = useState<_TradeType>(_TradeType.BUY);
//
//     const queryAccountActive = useGetAccountActive();
//
//     const setLoading = useAppStore(state => state.setLoading);
//
//     const {meta, candles, lines, loading, error} = useLiveTradingData(symbol, timeframe);
//
//     useEffect(() => {
//         setLoading(loading);
//         if (error) {
//             showMessage({
//                 message: 'Có lỗi xảy ra',
//                 description: 'Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.',
//                 type: 'danger',
//                 duration: 3000,
//             })
//             router.back();
//         }
//     }, [loading, error]);
//
//     const lastValue = candles ? candles[candles.length - 1] : null;
//
//     const activeAccount = queryAccountActive.account;
//
//     const setTransactionOpen = useCallback((type: _TradeType) => {
//         setOpenTransaction(true);
//         setTradeType(type);
//     }, []);
//
//     return (
//         <>
//             <FocusAwareStatusBar hidden={true}/>
//             <View
//                 style={{
//                     flex: 1,
//                     backgroundColor: "#fff",
//                     paddingHorizontal: 20,
//                     paddingVertical: 20,
//                     justifyContent: "space-between"
//                 }}>
//                 <YStack style={{
//                     flex: 1
//                 }}>
//                     {activeAccount &&
//                         <Card elevate size="$4" bordered backgroundColor="white" marginBottom={30} paddingVertical={10}
//                               paddingHorizontal={20}>
//                             <YStack gap="$2">
//                                 <H6 fontWeight="bold">{Number(queryAccountActive.accountBalance).toLocaleString('en-US')} {activeAccount.currency.currency}</H6>
//                                 <XStack gap="$2" alignItems="center">
//                                     <View
//                                         style={[DefaultStyle.badge, {
//                                             backgroundColor: activeAccount.type === _AccountType.TEST_ACCOUNT ? '#FEF08A' : '#BBF7D0',
//                                         }]}
//                                     >
//                                         <Paragraph theme="alt2"
//                                                    fontSize="$2">{activeAccount.type === _AccountType.TEST_ACCOUNT ? 'Credit' : 'Thật'}</Paragraph>
//                                     </View>
//                                     <View
//                                         style={[DefaultStyle.badge, {
//                                             backgroundColor: '#E5E5E5'
//                                         }]}
//                                     >
//                                         <Paragraph theme="alt2"
//                                                    fontSize="$2">{activeAccount.account_type.name}</Paragraph>
//                                     </View>
//                                     <Paragraph theme="alt2" fontSize="$2">{activeAccount.code}</Paragraph>
//                                 </XStack>
//                             </YStack>
//                         </Card>
//                     }
//                     <XStack gap="$2" width={"100%"} justifyContent="space-between" alignItems="flex-start"
//                             marginBottom={24}>
//                         <YStack gap="$2" flex={1}>
//                             <Paragraph fontWeight={700} fontSize={24}>{meta?.symbol ?? "Symbol"}</Paragraph>
//                             <Paragraph fontWeight={700}
//                                        color="#ddd">{meta?.currency_base ?? "Symbol"} - {meta?.currency_quote ?? "Symbol"}</Paragraph>
//                             <Paragraph fontWeight={500} fontSize={24}>{lastValue?.close ?? 0}</Paragraph>
//                         </YStack>
//                         <YStack gap="$2" flex={1} alignItems={"flex-end"}>
//                             <XStack gap="$2" alignItems="flex-end">
//                                 <TouchableOpacity
//                                     onPress={() => setTypeChart(_TypeChart.LINE)}
//                                     style={{
//                                         padding: 12,
//                                         borderRadius: 12,
//                                         backgroundColor: typeChart === _TypeChart.LINE ? '#FCD34D' : '#ccc',
//                                     }}
//                                 >
//                                     <FontAwesome6 name="chart-line" size={14} color="white"/>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity
//                                     onPress={() => setTypeChart(_TypeChart.CANDLE)}
//                                     style={{
//                                         padding: 12,
//                                         borderRadius: 12,
//                                         backgroundColor: typeChart === _TypeChart.CANDLE ? '#FCD34D' : '#ccc',
//                                     }}
//                                 >
//                                     <MaterialIcons name="candlestick-chart" size={14} color="white"/>
//                                 </TouchableOpacity>
//                             </XStack>
//                             <XStack gap="$1" alignItems="center">
//                                 <Paragraph fontWeight={700} fontSize={12} color={"#ccc"}>Open:</Paragraph>
//                                 <Paragraph fontWeight={500} fontSize={12}>{lastValue?.open ?? 0}</Paragraph>
//                             </XStack>
//                             <XStack gap="$1" alignItems="center">
//                                 <Paragraph fontWeight={700} fontSize={12} color={"$green8"}>High:</Paragraph>
//                                 <Paragraph fontWeight={500} fontSize={12}>{lastValue?.high ?? 0}</Paragraph>
//                             </XStack>
//                             <XStack gap="$1" alignItems="center">
//                                 <Paragraph fontWeight={700} fontSize={12} color={"$red8"}>Low:</Paragraph>
//                                 <Paragraph fontWeight={500} fontSize={12}>{lastValue?.low ?? 0}</Paragraph>
//                             </XStack>
//                         </YStack>
//                     </XStack>
//                     {(!loading && lines.length > 0 && candles.length > 0) &&
//                         (
//                             <>
//                                 {typeChart === _TypeChart.LINE && <LineChart data={lines} timeFrame={timeframe}/>}
//                                 {typeChart === _TypeChart.CANDLE && <CandleChart data={candles} timeFrame={timeframe}/>}
//                             </>
//                         )
//                     }
//                 </YStack>
//                 <YStack gap="$2">
//                     <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"} marginTop={10}>
//                         {timeframesSelect.map((tf) => (
//                             <TouchableOpacity
//                                 key={tf.value}
//                                 onPress={() => setTimeframe(tf.value)}
//                                 style={{
//                                     paddingHorizontal: 8,
//                                     paddingVertical: 2,
//                                     borderRadius: 12,
//                                     backgroundColor: timeframe === tf.value ? '#FCD34D' : '#ccc',
//                                 }}
//                             >
//                                 <Paragraph style={{color: '#fff'}} fontWeight={700} fontSize={12}>{tf.label}</Paragraph>
//                             </TouchableOpacity>
//                         ))}
//                     </XStack>
//                     <XStack gap="$2" alignItems={"center"} justifyContent={"space-between"} marginTop={10}>
//                         <Button flex={1} size="$6" theme="red" backgroundColor="#EC4841" color="#fff" fontWeight="bold"
//                                 onPress={() => setTransactionOpen(_TradeType.SELL)}
//                         >
//                             <YStack flex={1} alignItems="center" justifyContent="center">
//                                 <Paragraph theme="alt2" fontSize="$3" color="#fff">BÁN</Paragraph>
//                                 <Paragraph theme="alt2" fontSize="$6" fontWeight="500"
//                                            color="#fff">{lastValue?.close}</Paragraph>
//                             </YStack>
//                         </Button>
//                         <Button flex={1} size="$6" theme="blue" backgroundColor="#168BFC" color="#fff" fontWeight="bold"
//                                 onPress={() => setTransactionOpen(_TradeType.BUY)}
//                         >
//                             <YStack flex={1} alignItems="center" justifyContent="center">
//                                 <Paragraph theme="alt2" fontSize="$3" color="#fff">MUA</Paragraph>
//                                 <Paragraph theme="alt2" fontSize="$6" fontWeight="500"
//                                            color="#fff">{lastValue?.close}</Paragraph>
//                             </YStack>
//                         </Button>
//                     </XStack>
//                 </YStack>
//             </View>
//             <TransactionOffCanvas
//                 queryAccountActive={queryAccountActive}
//                 open={openTransaction}
//                 setOpen={setOpenTransaction}
//                 activeAccount={activeAccount}
//                 lastValue={lastValue}
//                 symbol={symbol}
//                 tradeType={tradeType}
//             />
//         </>
//     )
// }
//
// export default TradingScreen;
//
// type TransactionOffCanvasProps = {
//     open: boolean,
//     setOpen: Dispatch<SetStateAction<boolean>>,
//     activeAccount: Account | null,
//     lastValue: CandleChartType | null,
//     tradeType: _TradeType,
//     symbol?: string,
//     queryAccountActive: UseGetAccountActiveHookType
// }
// const SNAP_CLOSE = 35;
// const SNAP_OPEN = 65;
// const parseToNumber = (text: string) => {
//     const num = Number(text);
//     return isNaN(num) ? 0 : num;
// };
// const formatNumber = (num: number) => {
//     return num.toFixed(2);
// };
//
//
// const TransactionOffCanvas: FC<TransactionOffCanvasProps> =
//     ({
//          open,
//          setOpen,
//          activeAccount,
//          lastValue,
//          tradeType,
//          symbol,
//          queryAccountActive
//      }) => {
//         const [amount, setAmount] = useState<string>("0.01");
//         const [snapPoint, setSnapPoint] = useState<number>(SNAP_CLOSE);
//         const lastPrice = lastValue?.close ?? 0;
//         const [price, setPrice] = useState<string>("0");
//
//         const {mutate, isPending} = useMutation({
//             mutationFn: (data: StoreTransactionRequestType) => transactionAPI.store(data),
//             onSuccess: async () => {
//                 showMessage({
//                     message: "Giao dịch thành công",
//                     type: 'success',
//                     duration: 3000,
//                 });
//                 setOpen(false);
//                 await queryAccountActive.get(); // Refresh account data after transaction
//             },
//             onError: (error) => {
//                 useShowErrorHandler(error);
//             }
//         })
//
//         const setLoading = useAppStore(state => state.setLoading);
//
//         useEffect(() => setLoading(isPending), [isPending]);
//
//         useEffect(() => {
//             if (!open) {
//                 Keyboard.dismiss();
//             } else {
//                 setSnapPoint(SNAP_CLOSE);
//                 setAmount("0.01"); // reset amount when open
//             }
//         }, [open]);
//
//         useEffect(() => {
//             if (lastPrice > 0) {
//                 setPrice(formatNumber(parseToNumber(amount) * lastPrice));
//             }
//         }, [lastPrice, amount]);
//
//         return (
//             <Sheet
//                 forceRemoveScrollEnabled={true}
//                 modal={true}
//                 open={open}
//                 onOpenChange={setOpen}
//                 snapPoints={[snapPoint]}
//                 dismissOnSnapToBottom
//                 zIndex={100_000}
//                 animation="medium"
//             >
//                 <Sheet.Overlay
//                     animation="lazy"
//                     backgroundColor="$shadow6"
//                     enterStyle={{opacity: 0}}
//                     exitStyle={{opacity: 0}}
//                 />
//
//                 <Sheet.Handle/>
//                 <KeyboardAvoidingView
//                     behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//                     style={{flex: 1}}
//                 >
//                     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                         <Sheet.Frame padding="$4" gap="$2">
//                             <Paragraph>Khối lượng</Paragraph>
//                             <View style={styles.container}>
//                                 <TouchableOpacity onPress={() => {
//                                     const num = parseToNumber(amount);
//                                     const increased = num - 0.01;
//                                     if (increased >= 0.01) {
//                                         setAmount(formatNumber(increased));
//                                     }
//                                 }} style={[
//                                     styles.button,
//                                 ]}>
//                                     <Text style={styles.buttonText}>−</Text>
//                                 </TouchableOpacity>
//                                 <TextInput
//                                     style={styles.input}
//                                     onFocus={() => setSnapPoint(SNAP_OPEN)}
//                                     onBlur={() => {
//                                         const num = parseToNumber(amount);
//                                         setAmount(formatNumber(num));
//                                         setSnapPoint(SNAP_CLOSE);
//                                     }}
//                                     keyboardType="numeric"
//                                     value={amount}
//                                     onChangeText={(text) => setAmount(text)}
//                                 />
//                                 <TouchableOpacity onPress={() => {
//                                     const num = parseToNumber(amount);
//                                     const increased = num + 0.01;
//                                     setAmount(formatNumber(increased));
//                                 }} style={[
//                                     styles.button,
//                                 ]}>
//                                     <Text style={styles.buttonText}>＋</Text>
//                                 </TouchableOpacity>
//                             </View>
//                             <XStack gap="$2" alignItems="center">
//                                 <Paragraph fontWeight={500} color={"#ccc"}>Phí: ~0 USD</Paragraph>
//                                 <View style={{width: 1, height: '60%', backgroundColor: '#ccc'}}/>
//                                 <Paragraph fontWeight={500} color={"#ccc"}>Đòn
//                                     bảy: {activeAccount?.lever?.min ?? 0}:{activeAccount?.lever?.max ?? 0}</Paragraph>
//                             </XStack>
//                             <XStack gap="$2" alignItems="center">
//                                 <Button onPress={() => setOpen(false)}>Hủy</Button>
//                                 <Button
//                                     flex={1} theme={tradeType === _TradeType.BUY ? "blue" : "red"}
//                                     backgroundColor={tradeType === _TradeType.BUY ? "#168BFC" : "#EC4841"} color="#fff"
//                                     fontWeight="bold"
//                                     onPress={() => {
//                                         mutate({
//                                             account_id: activeAccount?.id ?? 0,
//                                             symbol: symbol ?? '',
//                                             currency: price,
//                                             type: tradeType,
//                                             number: amount,
//                                         });
//                                     }}
//                                 >
//                                     <YStack alignItems="center" justifyContent="center">
//                                         <Paragraph theme="alt2" fontSize="$2" color="#fff">XÁC
//                                             NHẬN {tradeType === _TradeType.BUY ? "MUA" : "BÁN"}</Paragraph>
//                                         <Paragraph theme="alt2" fontSize="$5" fontWeight="500"
//                                                    color="#fff">{price}</Paragraph>
//                                     </YStack>
//                                 </Button>
//                             </XStack>
//                         </Sheet.Frame>
//                     </TouchableWithoutFeedback>
//                 </KeyboardAvoidingView>
//             </Sheet>
//         )
//     }
// const styles = StyleSheet.create({
//     container: {
//         borderWidth: 1,
//         borderRadius: 6,
//         borderColor: '#ccc',
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 12,
//         paddingVertical: 4,
//     },
//     input: {
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         flex: 1,
//         textAlign: 'center',
//         fontSize: 16,
//         marginHorizontal: 10,
//         borderRadius: 6,
//     },
//     button: {
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//     },
//     buttonText: {
//         fontSize: 20,
//         color: '#ccc',
//         fontWeight: 'bold',
//     },
// });
//
//
// export const dataTest = {
//     "meta": {
//         "symbol": "BTC/USD",
//         "interval": "1min",
//         "currency": null,
//         "exchangeTimezone": null,
//         "exchange": "Coinbase Pro",
//         "micCode": null,
//         "currencyBase": "Bitcoin",
//         "currencyQuote": "US Dollar",
//         "type": "Digital Currency"
//     },
//     "values": [
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:49:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120736.91",
//             "high": "120740.02",
//             "low": "120621.59",
//             "close": "120636.53",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:48:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120770.79",
//             "high": "120805.03",
//             "low": "120717.03",
//             "close": "120736.91",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:47:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120861.93",
//             "high": "120872.38",
//             "low": "120701.82",
//             "close": "120761.38",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:46:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120812.08",
//             "high": "120868.44",
//             "low": "120749.46",
//             "close": "120854.65",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:45:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120932.77",
//             "high": "120954.17",
//             "low": "120720.37",
//             "close": "120803.37",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:44:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120756.06",
//             "high": "120924.85",
//             "low": "120680",
//             "close": "120924.85",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:43:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120781.78",
//             "high": "120843.46",
//             "low": "120747.33",
//             "close": "120783.97",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:42:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120782.83",
//             "high": "120853.5",
//             "low": "120759.33",
//             "close": "120783.19",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:41:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120887.78",
//             "high": "120910.71",
//             "low": "120768.49",
//             "close": "120785.82",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:40:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120844.34",
//             "high": "120976.89",
//             "low": "120824.17",
//             "close": "120902.62",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:39:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120862.3",
//             "high": "120888.29",
//             "low": "120803",
//             "close": "120857.31",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:38:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120916.02",
//             "high": "120993.79",
//             "low": "120859.26",
//             "close": "120859.27",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:37:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121009.85",
//             "high": "121083.6",
//             "low": "120900",
//             "close": "120926.72",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:36:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121048.36",
//             "high": "121108.86",
//             "low": "120977",
//             "close": "121009.79",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:35:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120999.99",
//             "high": "121196.82",
//             "low": "120973.02",
//             "close": "121035.98",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:34:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "120950.15",
//             "high": "121026.36",
//             "low": "120929",
//             "close": "121000",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:33:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121140.48",
//             "high": "121162.23",
//             "low": "120856.83",
//             "close": "120950.15",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:32:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121178.85",
//             "high": "121178.85",
//             "low": "120958.92",
//             "close": "121127.92",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:31:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121343.79",
//             "high": "121378.54",
//             "low": "121144.99",
//             "close": "121178.79",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:30:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121517.16",
//             "high": "121533.45",
//             "low": "121269.02",
//             "close": "121343.79",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:29:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121368.94",
//             "high": "121550.75",
//             "low": "121350.27",
//             "close": "121510.96",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:28:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121260.4",
//             "high": "121401.67",
//             "low": "121177.91",
//             "close": "121368.95",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:27:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121380.92",
//             "high": "121380.92",
//             "low": "121165.91",
//             "close": "121260.43",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:26:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121306.1",
//             "high": "121415.5",
//             "low": "121280.73",
//             "close": "121380.91",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:25:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121448.24",
//             "high": "121495.23",
//             "low": "121287.2",
//             "close": "121308.09",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:24:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121505.92",
//             "high": "121508.29",
//             "low": "121408.98",
//             "close": "121448.24",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:23:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121569.98",
//             "high": "121599.82",
//             "low": "121476.01",
//             "close": "121505.92",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:22:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121651.85",
//             "high": "121679.04",
//             "low": "121555",
//             "close": "121569.95",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:21:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121685.89",
//             "high": "121766.8",
//             "low": "121644.21",
//             "close": "121651.86",
//             "volume": null
//         },
//         {
//             "datetime": {
//                 "date": "2025-07-14 14:20:00.000000",
//                 "timezone_type": 3,
//                 "timezone": "UTC"
//             },
//             "open": "121844",
//             "high": "121881.84",
//             "low": "121662.59",
//             "close": "121670.86",
//             "volume": null
//         }
//     ],
//     "status": "ok"
// }