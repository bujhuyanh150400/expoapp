import {router, useLocalSearchParams} from "expo-router";
import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from "react-native";
import {Paragraph, XStack, YStack} from "tamagui";
import SymbolAssetIcons from "@/components/SymbolAssetIcons";
import DefaultColor from "@/components/ui/DefaultColor";
import {calculateBidAskSpread} from "@/lib/utils";
import HeaderBack from "@/components/HeaderBack";
import useNestedState from "@/lib/hooks/useNestedState";
import {_Timeframe, _TradeType, _TypeChart} from "@/lib/@type";
import {FontAwesome6, MaterialIcons} from "@expo/vector-icons";
import BottomSheetSelect from "@/components/BottomSheetSelect";
import useAppStore from "@/lib/store/appStore";
import {useQuery} from "@tanstack/react-query";
import assetTradingAPI from "@/api/asset_trading";
import {showMessage} from "react-native-flash-message";
import SkeletonFade from "@/components/SkeletonFade";
import useSubscribeSymbols from "@/api/socket/subscribeSymbols";
import useAuthStore from "@/lib/store/authStore";
import useWebsocketSymbolStore from "@/api/socket/subscribeSymbols/store";
import type {WebView as WebViewType} from 'react-native-webview';
import WebView from "react-native-webview";
import {BACKEND_REACT_URL} from "@/lib/constant";
import TransactionSheet from "@/components/TransactionSheet";

const TIME_FRAME_SELECT = [
    {label: '1 phút', unit: "1m", value: _Timeframe.OneMinute},
    {label: '5 phút', unit: "5m", value: _Timeframe.FiveMinute},
    {label: '30 phút', unit: "30m", value: _Timeframe.ThirtyMinutes},
    {label: '45 phút', unit: "45m", value: _Timeframe.FortyFiveMinutes},
    {label: '1 giờ', unit: "1h", value: _Timeframe.OneHour},
    {label: '1 ngày', unit: "1d", value: _Timeframe.OneDay},
    {label: '1 tuần', unit: "1w", value: _Timeframe.OneWeek},
];

const TYPE_CHART_SELECT = [
    {label: 'Đường', unit: <FontAwesome6 name="chart-line" size={16} color="black"/>, value: _TypeChart.LINE},
    {
        label: 'Biểu đồ nến',
        unit: <MaterialIcons name="candlestick-chart" size={16} color="black"/>,
        value: _TypeChart.CANDLE
    },
]


export default function TradingScreen() {
    const webViewRef = useRef<WebViewType>(null);
    const [isWebViewReady, setIsWebViewReady] = useState(false);
    const {symbol} = useLocalSearchParams<{ symbol?: string }>();

    const [openTransactionSheet, setOpenTransactionSheet] = useState<boolean>(false);
    const [tradeType, setTradeType] = useState<_TradeType>(_TradeType.BUY);


    const [filter, setFilter] = useNestedState({
        timeframe: _Timeframe.FiveMinute,
        type_chart: _TypeChart.LINE,
    });

    const queryItemSymbol = useQuery({
        queryKey: ['assetTradingAPI-item', symbol],
        enabled: !!symbol,
        queryFn: async () => {
            return await assetTradingAPI.item({
                symbol: symbol || '',
            });
        },
        select: (res) => res.data
    })

    const authData = useAuthStore(s => s.auth_data);

    // get realtime
    useSubscribeSymbols([symbol || ''], authData?.user?.id, authData?.user?.secret);
    const priceRealtime = useWebsocketSymbolStore(s => s.prices[symbol || '']);

    const sendChartPayload = () => {
        if (!webViewRef.current || !authData?.user) return;
        const payload = {
            symbol,
            interval: filter.timeframe,
            chartType: filter.type_chart,
            user_id: authData?.user?.id,
            secret: authData?.user?.secret,
        };
        webViewRef.current.postMessage(JSON.stringify(payload));
    };

    // send to web view to handle chart
    useEffect(() => {
        if (!isWebViewReady || !webViewRef.current) return;
        sendChartPayload();
    }, [symbol, filter.timeframe, filter.type_chart, authData, isWebViewReady]);

    const {
        bid,
        ask,
        spread
    } = calculateBidAskSpread(priceRealtime.price, queryItemSymbol.data ? queryItemSymbol.data.spread : "");

    useEffect(() => {
        if (queryItemSymbol.isError) {
            showMessage({
                type: "danger",
                message: "Có trục trặc kĩ thuật",
                description: "Có lỗi xảy ra, vui lòng thử lại sau",
                duration: 3000,
            })
            router.back();
        }
    }, [queryItemSymbol.isError]);

    // set loading
    const setLoading = useAppStore(state => state.setLoading);

    useEffect(() => {
        setLoading(queryItemSymbol.isLoading || queryItemSymbol.isRefetching);
    }, [queryItemSymbol.isLoading, queryItemSymbol.isRefetching]);
    return (
        <>
            <HeaderBack/>
            <View style={{flex: 1, paddingTop: 0}}>
                {/*Header*/}
                <View style={{
                    paddingHorizontal: 20
                }}>
                    <XStack alignItems={"center"} gap={"$2"}>
                        {/*Symbol info*/}
                        <YStack gap={"$2"}>
                            <XStack alignItems={"flex-start"} justifyContent={"center"} gap={"$2"}>
                                {queryItemSymbol.data &&
                                    <SymbolAssetIcons
                                        symbol={queryItemSymbol.data.symbol}
                                        currency_base={queryItemSymbol.data.currency_base}
                                        currency_quote={queryItemSymbol.data.currency_quote || ''}
                                        size={18}
                                    />
                                }
                                <YStack>
                                    {queryItemSymbol.data ? <Paragraph fontSize={20}
                                                                       fontWeight={700}>{queryItemSymbol.data.symbol}</Paragraph> :
                                        <SkeletonFade/>}
                                    {queryItemSymbol.data ? (
                                        <Paragraph fontSize={12} fontWeight={500} color={DefaultColor.slate[400]}
                                                   numberOfLines={1} maxWidth={200}>
                                            {queryItemSymbol.data.currency_base}
                                            {queryItemSymbol.data.currency_quote ? `vs ${queryItemSymbol.data.currency_quote}` : ''}
                                        </Paragraph>
                                    ) : <SkeletonFade/>}
                                </YStack>
                            </XStack>
                        </YStack>
                    </XStack>
                </View>

                {/*Chart*/}
                <WebView
                    ref={webViewRef}
                    renderLoading={() => <ActivityIndicator/>}
                    source={{uri: BACKEND_REACT_URL}}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    style={{flex: 1}}
                    onMessage={(event) => {
                        if (event.nativeEvent.data === 'READY') {
                            setIsWebViewReady(true);
                            sendChartPayload();
                        }
                    }}
                />

                {/*Footer*/}
                <View
                    style={{
                        paddingHorizontal: 20,
                        paddingBottom: 20,
                    }}
                >
                    <YStack gap={"$4"} paddingTop={"$4"}>
                        <XStack alignItems={"center"} gap={"$4"} justifyContent={"space-between"}>
                            <XStack gap={"$2"}>
                                <BottomSheetSelect
                                    options={TYPE_CHART_SELECT}
                                    value={filter.type_chart}
                                    snapPoints={[50]}
                                    onChange={(value) => {
                                        const valueSelect = value as _TypeChart;
                                        setFilter({type_chart: valueSelect})
                                    }}
                                />
                                <BottomSheetSelect
                                    options={TIME_FRAME_SELECT}
                                    value={filter.timeframe}
                                    snapPoints={[50]}
                                    onChange={(value) => {
                                        const valueSelect = value as _Timeframe;
                                        setFilter({timeframe: valueSelect})
                                    }}
                                />
                                <View style={styles.open_close_container}>
                                    <XStack alignItems={"center"} gap={"$2"}>
                                        <Paragraph>Mở</Paragraph>
                                        <View style={styles.open_close_badge}>
                                            <Paragraph>0</Paragraph>
                                        </View>
                                    </XStack>
                                    <XStack alignItems={"center"} gap={"$2"}>
                                        <Paragraph>Đóng</Paragraph>
                                        <View style={styles.open_close_badge}>
                                            <Paragraph>0</Paragraph>
                                        </View>
                                    </XStack>
                                </View>
                            </XStack>

                        </XStack>
                        <View style={{
                            position: "relative",
                            width: "100%"
                        }}>
                            <XStack width={"100%"} gap={"$2"}>
                                <TouchableOpacity
                                    onPress={()=>{
                                        setOpenTransactionSheet(true);
                                        setTradeType(_TradeType.SELL);
                                    }}
                                    style={[
                                        styles.btn_trading, {backgroundColor: DefaultColor.red[500]}
                                    ]}
                                >
                                    <Paragraph fontSize={14} fontWeight={500} color={"white"}>BÁN</Paragraph>
                                    <Paragraph fontSize={14} fontWeight={500} color={"white"}>{bid}</Paragraph>
                                </TouchableOpacity>
                                <View style={styles.spread}>
                                    <Paragraph fontSize={12}>{spread}</Paragraph>
                                </View>
                                <TouchableOpacity
                                    onPress={()=>{
                                        setOpenTransactionSheet(true);
                                        setTradeType(_TradeType.BUY);
                                    }}
                                    style={[
                                        styles.btn_trading, {backgroundColor: DefaultColor.blue[500]}
                                    ]}
                                >
                                    <Paragraph fontSize={14} fontWeight={500} color={"white"}>MUA</Paragraph>
                                    <Paragraph fontSize={14} fontWeight={500} color={"white"}>{ask}</Paragraph>
                                </TouchableOpacity>
                            </XStack>
                        </View>
                    </YStack>
                </View>
            </View>
            <TransactionSheet
                tradeType={tradeType}
                open={openTransactionSheet}
                setOpen={setOpenTransactionSheet}
                price={tradeType === _TradeType.BUY ? ask : bid}
            />
        </>
    )
}

const styles = StyleSheet.create({
    open_close_container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        paddingHorizontal: 20,
        gap: 20,
        borderRadius: 10,
        backgroundColor: DefaultColor.slate[200],
    },
    open_close_badge: {
        width: 28,
        height: 28,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: DefaultColor.slate[300],
    },
    btn_trading: {
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
        borderRadius: 8,
    },
    spread: {
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: [{translateX: "-50%"}, {translateY: "-100%"}],
        paddingHorizontal: 4,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        zIndex: 10,
        backgroundColor: DefaultColor.white
    },
})