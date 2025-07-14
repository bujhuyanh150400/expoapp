import {useLocalSearchParams} from "expo-router";
import React, {useMemo, useState} from "react";
import {View} from "react-native";
import {Paragraph, XStack, YStack} from "tamagui";
import SymbolAssetIcons from "@/components/SymbolAssetIcons";
import DefaultColor from "@/components/ui/DefaultColor";
import {dataTest} from "@/test/trading";
import {formatDataLineChart} from "@/lib/utils";
import LineChart from "@/components/chart/LineChart";
import HeaderBack from "@/components/HeaderBack";
import useNestedState from "@/lib/hooks/useNestedState";

export default function TradingScreen() {
    const {symbol} = useLocalSearchParams<{ symbol?: string }>();

    const [height, setHeight] = useNestedState({head: 0, container: 0, header: 0, footer: 0})
    const chartHeight = useMemo(() => {
        return height.container - height.header - height.footer - height.header
    }, [height]);

    const dataChart = formatDataLineChart(dataTest.values)

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
                                <SymbolAssetIcons
                                    symbol={dataTest.meta.symbol}
                                    currency_base={dataTest.meta.currencyBase}
                                    currency_quote={dataTest.meta.currencyQuote || ''}
                                    size={18}
                                />
                                <YStack>
                                    <Paragraph fontSize={20} fontWeight={700}>{dataTest.meta.symbol}</Paragraph>
                                    <Paragraph fontSize={12} fontWeight={500} color={DefaultColor.slate[400]}
                                               numberOfLines={1} maxWidth={200}>
                                        {dataTest.meta.currencyBase} {dataTest.meta.currencyQuote ? `vs ${dataTest.meta.currencyQuote}` : ''}
                                    </Paragraph>
                                </YStack>
                            </XStack>
                        </YStack>
                    </XStack>
                </View>
                {/*Chart*/}
                {chartHeight > 0 && (
                    <>
                        <LineChart data={dataChart} height={chartHeight}/>
                    </>
                )}
                <View
                    onLayout={(e) => setHeight({footer: e.nativeEvent.layout.height})}
                >
                </View>
            </View>
        </>
    )
}