import {useQuery} from "@tanstack/react-query";
import {TimeSeriesRequest, TimeSeriesResponse} from "@/api/core_data/type";
import dayjs from "dayjs";
import React, {useEffect, useMemo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import accountAPI from "@/api/account";
import {showMessage} from "react-native-flash-message";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Button, Card, H4, H6, Paragraph, XStack, YStack} from "tamagui";
import {_AccountType, _Timeframe} from "@/lib/@type";
import coreDataApi from "@/api/core_data";

const caclDataChart = (data: TimeSeriesResponse) => {
    const lineChartData = data.values
        .map((item) => ({
            value: Number(item.open),
            close: Number(item.close),
            label: dayjs(item.datetime.date).format('HH:mm'),
        })).reverse();
    const values = lineChartData.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sell = lineChartData[lineChartData.length - 1].close;
    const open = lineChartData[lineChartData.length - 1].value;
    return {
        metaData: data.meta,
        lineChartData,
        min,
        max,
        yAxisOffset: min - 1, // khoảng đệm 1 đơn vị
        yAxisMaxValue: max + 1, // khoảng đệm 1 đơn vị
        sell,
        open,
    }
}

export default function TradeScreen() {
    const router = useRouter();
    // Account
    const account = useQuery({
        queryKey: ['accountAPI-accountActive'],
        queryFn: accountAPI.accountActive,
    });
    const activeAccount = account.data?.data || null;
    useEffect(() => {
        if (account.isError) {
            router.replace('/(app)/account');
            showMessage({
                message: 'Không thể lấy thông tin tài khoản hoạt động',
                description: 'Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.',
                type: 'danger',
                duration: 3000,
            });
        }
    }, [account.isError]);

    // Symbol charts
    const {symbol} = useLocalSearchParams<{ symbol?: string }>();

    const chartQuery = useQuery({
        queryKey: ['referenceApi-forex_pairs', {symbol: symbol, interval: _Timeframe.OneMinute}],
        queryFn: ({queryKey}) => {
            const [, params] = queryKey as [string, TimeSeriesRequest];
            console.log('Fetching time series with params:', params);
            return coreDataApi.time_series(params);
        },
        refetchInterval:  60*1000, // <- Gọi lại mỗi 1 phút
        staleTime: 0, // Optional: đảm bảo luôn refetch
    });

    useEffect(() => {
        if (chartQuery.isError) {
            console.log(chartQuery.error);
        }
    }, [chartQuery.isError]);

    const dataChart = useMemo(() => {
        if (chartQuery.data) {
            return caclDataChart(chartQuery.data);
        } else {
            return null;
        }
    }, [chartQuery.data])


    return (
        <View style={{padding: 12, paddingTop: 40, backgroundColor: '#fff', flex: 1}}>
            {/* Account */}
            <Card elevate size="$4" bordered backgroundColor="white" marginBottom={15} padded>
                {account.isSuccess && activeAccount && (
                    <YStack gap="$2">
                        <H6 fontWeight="bold">{Number(activeAccount.money).toLocaleString('en-US')} {activeAccount.currency.currency}</H6>
                        {/*Credit + type name + code*/}
                        <XStack gap="$2" alignItems="center">
                            <View
                                style={{
                                    paddingHorizontal: 8,
                                    borderRadius: 8,
                                    backgroundColor: activeAccount.type === _AccountType.TEST_ACCOUNT ? '#FEF08A' : '#BBF7D0',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Paragraph theme="alt2"
                                           fontSize="$2">{activeAccount.type === _AccountType.TEST_ACCOUNT ? 'Credit' : 'Thật'}</Paragraph>
                            </View>
                            <View
                                style={{
                                    paddingHorizontal: 8,
                                    borderRadius: 8,
                                    backgroundColor: '#E5E5E5',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Paragraph theme="alt2"
                                           fontSize="$2">{activeAccount.account_type.name}</Paragraph>
                            </View>
                            <Paragraph theme="alt2" fontSize="$2">{activeAccount.code}</Paragraph>
                        </XStack>
                    </YStack>
                )}
                {account.isSuccess && !activeAccount && (
                    <>
                        <H6 fontWeight="bold" paddingBottom={12}>Không có tài khoản nào đang hoạt động</H6>
                        <Paragraph theme="alt2">Mở tài khoản mới hoặc restore 1 tài khoản</Paragraph>
                    </>
                )}
            </Card>

            {/* loading */}
            {chartQuery.isLoading &&
                <YStack flex={1} alignItems="center" justifyContent="center" paddingVertical={36}>
                    <Paragraph theme="alt2">Đang tải dữ liệu...</Paragraph>
                </YStack>
            }

            {dataChart &&
                <>
                    {/* symbol */}
                    <XStack alignItems="center" gap="$2" marginBottom={20}>
                        <View
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: '100%',
                                backgroundColor: '#ccc',
                            }}
                        />
                        <H4 fontWeight="bold">{dataChart.metaData.symbol}</H4>
                    </XStack>
                    <Card elevate size="$4" backgroundColor="#F2F2F2" padding="$3" marginBottom={15}>
                        <XStack alignItems="center" gap="$4">
                            <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row', gap: 8}}>
                                <Paragraph theme="alt2" fontWeight={500}>Mở</Paragraph>
                                <View
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '100%',
                                        backgroundColor: '#E5E5E5',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Paragraph theme="alt2" fontWeight={500}>0</Paragraph>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{alignItems: 'center', flexDirection: 'row', gap: 8}}>
                                <Paragraph theme="alt2" fontWeight={500}>Đang chờ</Paragraph>
                                <View
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '100%',
                                        backgroundColor: '#E5E5E5',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Paragraph theme="alt2" fontWeight={500}>0</Paragraph>
                                </View>
                            </TouchableOpacity>
                        </XStack>
                    </Card>
                    <LineChart
                        key={Date.now()}
                        data={dataChart.lineChartData}
                        yAxisOffset={dataChart.yAxisOffset}
                        yAxisLabelWidth={60}
                        yAxisLabelSuffix=""
                        isAnimated
                        trimYAxisAtTop
                        curved
                        yAxisTextNumberOfLines={3}
                        scrollToEnd
                        scrollAnimation
                        thickness={2}
                        hideDataPoints={false}
                        initialSpacing={0}
                        spacing={50}
                        yAxisTextStyle={{color: '#999'}}
                        xAxisLabelTextStyle={{color: '#999', fontSize: 10}}
                        rulesColor="#eee"
                        backgroundColor="#fff"
                        pointerConfig={{
                            pointerStripHeight: 180,
                            pointerStripColor: "lightgray",
                            pointerStripWidth: 2,
                            pointerColor: "lightgray",
                            radius: 6,
                            pointerLabelWidth: 100,
                            pointerLabelHeight: 90,
                            activatePointersOnLongPress: true,
                            autoAdjustPointerLabelPosition: false,
                            pointerLabelComponent: (items: any) => {
                                return (
                                    <View
                                        style={{
                                            height: 90,
                                            width: 100,
                                            justifyContent: "center",
                                            marginTop: -10,
                                            marginLeft: -40,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <View
                                            style={{
                                                paddingHorizontal: 14,
                                                paddingVertical: 6,
                                                borderRadius: 16,
                                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    color: "black",
                                                }}
                                            >
                                                {items[0].value.toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            },
                        }}
                    />

                    <XStack alignItems="center" gap="$2" marginTop={20}>
                        <Button flex={1} size="$6" theme="red" backgroundColor="#EC4841" color="#fff" fontWeight="bold">
                            <YStack flex={1} alignItems="center" justifyContent="center">
                                <Paragraph theme="alt2" fontSize="$3" color="#fff">BÁN</Paragraph>
                                <Paragraph theme="alt2" fontSize="$6" fontWeight="500" color="#fff">{dataChart.sell}</Paragraph>
                            </YStack>
                        </Button>
                        <Button flex={1} size="$6" theme="blue" backgroundColor="#168BFC" color="#fff" fontWeight="bold">
                            <YStack flex={1} alignItems="center" justifyContent="center">
                                <Paragraph theme="alt2" fontSize="$3" color="#fff">MUA</Paragraph>
                                <Paragraph theme="alt2" fontSize="$6" fontWeight="500" color="#fff">{dataChart.open}</Paragraph>
                            </YStack>
                        </Button>
                    </XStack>
                </>
            }
        </View>
    )
}
