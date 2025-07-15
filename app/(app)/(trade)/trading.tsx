import {router, useLocalSearchParams} from "expo-router";
import React, {useEffect, useMemo, useState} from "react";
import {View, StyleSheet, TouchableOpacity} from "react-native";
import {Paragraph, XStack, YStack} from "tamagui";
import SymbolAssetIcons from "@/components/SymbolAssetIcons";
import DefaultColor from "@/components/ui/DefaultColor";
import {dataTest} from "@/test/trading";
import {formatDataLineChart} from "@/lib/utils";
import LineChart from "@/components/chart/LineChart";
import HeaderBack from "@/components/HeaderBack";
import useNestedState from "@/lib/hooks/useNestedState";
import {_Timeframe, _TypeChart} from "@/lib/@type";
import {MaterialIcons, FontAwesome6} from "@expo/vector-icons";
import BottomSheetSelect from "@/components/BottomSheetSelect";
import useTrading from "@/lib/hooks/useTrading";
import useAppStore from "@/lib/store/appStore";
import {useQuery} from "@tanstack/react-query";
import assetTradingAPI from "@/api/asset_trading";
import {showMessage} from "react-native-flash-message";
import SkeletonFade from "@/components/SkeletonFade";
import CandleChart from "@/components/chart/CandleChart";
import {CandleChartType, LineChartType} from "@/components/chart/type";

const TIME_FRAME_SELECT = [
    {label: '1 phút', unit: "1m", value: _Timeframe.OneMinute},
    {label: '30 phút', unit: "30m", value: _Timeframe.ThirtyMinutes},
    {label: '45 phút', unit: "45m", value: _Timeframe.FortyFiveMinutes},
    {label: '1 giờ', unit: "1h", value: _Timeframe.OneHour},
    {label: '1 ngày', unit: "1d", value: _Timeframe.OneDay},
    {label: '1 tuần', unit: "1w", value: _Timeframe.OneWeek},
];
const TYPE_CHART_SELECT = [
    {label: 'Đường', unit: <FontAwesome6 name="chart-line" size={16} color="black"/>, value: _TypeChart.LINE},
    {label: 'Biểu đồ nến', unit: <MaterialIcons name="candlestick-chart" size={16} color="black"/>, value: _TypeChart.CANDLE},
]

export default function TradingScreen() {
    // Height chart
    const [height, setHeight] = useNestedState({head: 0, container: 0, header: 0, footer: 0});
    const chartHeight = useMemo(() => height.container - height.header - height.footer - height.header, [height]);

    const {symbol} = useLocalSearchParams<{ symbol?: string }>();
    const [filter,setFilter] = useNestedState({
        timeframe: _Timeframe.OneMinute,
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


    const {dataChart, loading, priceRealtime, isError} = useTrading({
        symbol,
        interval: filter.timeframe,
        type_chart: filter.type_chart,
    });

    useEffect(() => {
        if (queryItemSymbol.isError || isError){
            showMessage({
                type:"danger",
                message: "Có trục trặc kĩ thuật",
                description: "Có lỗi xảy ra, vui lòng thử lại sau",
                duration: 3000,
            })
            router.back();
        }
    }, [queryItemSymbol.isError, isError]);

    return (
        <>
            <HeaderBack onLayout={(e) => setHeight({header: e.nativeEvent.layout.height})}/>
            <View style={{flex: 1, padding: 20, paddingTop: 0}}
                  onLayout={(e) => setHeight({container: e.nativeEvent.layout.height})}
            >
                {/*Header*/}
                <View
                    onLayout={(e) => setHeight({header: e.nativeEvent.layout.height})}
                >
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
                                    {queryItemSymbol.data ? <Paragraph fontSize={20} fontWeight={700}>{queryItemSymbol.data.symbol}</Paragraph> : <SkeletonFade/>}
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
                {chartHeight > 0 && dataChart && dataChart.length > 0 && (
                    <>
                        {filter.type_chart === _TypeChart.CANDLE && <CandleChart data={dataChart as CandleChartType[]} timeFrame={filter.timeframe} />}
                        {filter.type_chart === _TypeChart.LINE && <LineChart data={dataChart as LineChartType[]} height={chartHeight} />}
                    </>
                )}

                {/*Footer*/}
                <View
                    onLayout={(e) => setHeight({footer: e.nativeEvent.layout.height})}
                >
                    <YStack gap={"$4"} paddingTop={"$4"}>
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
                        </XStack>
                        <View style={{
                            position:"relative",
                            width:"100%"
                        }}>
                            <XStack width={"100%"} gap={"$2"}>
                                <TouchableOpacity style={[
                                    styles.btn_trading, { backgroundColor: DefaultColor.red[500] }
                                ]}>
                                    <Paragraph fontSize={14} fontWeight={500} color={"white"}>BÁN</Paragraph>
                                    <Paragraph fontSize={18} fontWeight={500} color={"white"}>100000000</Paragraph>
                                </TouchableOpacity>
                                <View style={styles.spread}>
                                    <Paragraph fontSize={12}>23,19</Paragraph>
                                </View>
                                <TouchableOpacity style={[
                                    styles.btn_trading, { backgroundColor: DefaultColor.blue[500] }
                                ]}>
                                    <Paragraph fontSize={14} fontWeight={500} color={"white"}>MUA</Paragraph>
                                    <Paragraph fontSize={18} fontWeight={500} color={"white"}>100000000</Paragraph>
                                </TouchableOpacity>
                            </XStack>
                        </View>
                    </YStack>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    btn_trading: {
        width: "50%",
        alignItems: "center",
        justifyContent:"center",
        paddingVertical: 4,
        borderRadius: 8,
    },
    spread: {
        position:"absolute",
        top: "100%",
        left: "50%",
        transform: [  { translateX: "-50%" }, { translateY: "-100%" }],
        paddingHorizontal: 4,
        justifyContent: "center",
        alignItems:"center",
        borderRadius: 10,
        zIndex: 10,
        backgroundColor: DefaultColor.white
    }
})