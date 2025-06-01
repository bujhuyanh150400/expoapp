import {useQuery} from "@tanstack/react-query";
import referenceApi from "@/api/reference";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import {ForexPairsRequestType} from "@/api/reference/type";
import {Card, Paragraph, XStack, YStack,} from 'tamagui';
import {View} from 'react-native';
import {TouchableOpacity} from "react-native";
import FullScreenLoading from "@/components/FullScreenLoading";
import React from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {useRouter} from "expo-router";

const filter: ForexPairsRequestType = {
    currencyBase: 'USD',
}
export default function TradeListScreen() {
    const router = useRouter();
    const {data, isLoading, isError, isSuccess} = useQuery({
        queryKey: ['referenceApi_forex_pairs', filter],
        queryFn: ({queryKey}) => {
            const [, params] = queryKey as [string, ForexPairsRequestType];
            return referenceApi.forex_pairs(params);
        },
    })

    return (
        <>
            <FullScreenLoading loading={isLoading}/>
            <LayoutScrollApp title="Giao dịch">
                {isError && <Paragraph>Lỗi khi tải danh sách cặp tiền tệ</Paragraph>}
                {isSuccess && data?.data.length === 0 && <Paragraph>Không có cặp tiền tệ nào</Paragraph>}
                {isSuccess && data?.data.length > 0 &&
                    data?.data.slice(0, 20).map((forex, _key) => (
                        <TouchableOpacity
                            key={_key}
                            style={{
                                marginBottom: 16
                            }}
                            onPress={() => {
                                router.push({
                                    pathname: '/(trade)',
                                    params: {symbol: forex.symbol},
                                })
                            }}
                        >
                            <Card
                                elevate
                                padding="$4"
                                flexDirection="row"
                                alignItems="flex-start"
                                justifyContent="space-between"
                            >
                                <YStack gap="$2">
                                    <XStack alignItems="flex-start" gap="$2">
                                        <View
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '100%',
                                                backgroundColor: '#ccc',
                                            }}
                                        />
                                        <Paragraph fontWeight="bold">{forex.symbol}</Paragraph>
                                    </XStack>
                                    <Paragraph
                                        color="#969696"
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={{maxWidth: 200}}
                                        fontWeight={500}
                                        fontSize={12}>{forex.currencyBase} VS {forex.currencyQuote}</Paragraph>
                                </YStack>
                                <XStack alignItems="center" gap="$2">
                                    <FontAwesome6 name="right-left" size={12} color="black"/>
                                    <Paragraph fontWeight="medium" fontSize={12}>Giao dịch</Paragraph>
                                </XStack>
                            </Card>
                        </TouchableOpacity>
                    ))}
            </LayoutScrollApp>
        </>
    )
}