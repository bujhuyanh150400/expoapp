import {Account} from "@/api/account/type";
import React, {FC, useEffect} from "react";
import {_TradeType, _TransactionStatus} from "@/lib/@type";
import {Card, Paragraph, XStack, YStack} from "tamagui";
import DefaultColor from "@/components/ui/DefaultColor";
import HorizontalTabBar from "@/components/HorizontalTabBar";
import DefaultStyle from "@/components/ui/DefaultStyle";
import {ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import useNestedState from "@/lib/hooks/useNestedState";
import {TransactionHistoryRequestType} from "@/api/transaction/type";
import useTransactionHistory from "@/lib/hooks/useTransactionHistory";
import {useTransactionTotal} from "@/lib/hooks/useTransactionTotal";
import SymbolAssetIcons from "@/components/SymbolAssetIcons";
import SkeletonFade from "@/components/SkeletonFade";
import useCalculateTransactionPrices from "@/lib/hooks/useCalculateTransactionPrices";


type Props = {
    account: Account | null,
    showTotal?: boolean,
    allowScroll?: boolean,
}

const TransactionTabs: FC<Props> = (props) => {
    const [filter, setFilter] = useNestedState<TransactionHistoryRequestType>({
        account_id: props.account?.id || 0,
        status: _TransactionStatus.OPEN
    });
    const {query, transactions} = useTransactionHistory(filter);

    const ContentWrapper = props.allowScroll ? ScrollView : View;

    const hookTotal = useTransactionTotal(props.account?.id || null);

    const transactionsData = transactions[filter.status] || [];

    const hookCalculate = useCalculateTransactionPrices(transactionsData, filter.status === _TransactionStatus.OPEN || filter.status === _TransactionStatus.WAITING);

    useEffect(() => {
        if (props.account) {
            setFilter({account_id: props.account.id});
        }
        if (props.showTotal) {
            hookTotal.query.refetch();
        }
    }, [props.account, props.showTotal]);

    useEffect(() => {
        query.refetch();
    }, [filter.status]);

    return (
        <>
            <HorizontalTabBar<_TransactionStatus>
                tabs={[
                    {
                        key: _TransactionStatus.OPEN,
                        item: (isActive) => (
                            <XStack gap={"$2"}>
                                <Paragraph
                                    style={{
                                        color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                        fontWeight: isActive ? 700 : 'normal'
                                    }}
                                >
                                    Mở
                                </Paragraph>
                                {(props.showTotal && hookTotal.total && hookTotal.total.open > 0) && (
                                    <View style={[
                                        DefaultStyle.badgeCircle,
                                        {backgroundColor: isActive ? DefaultColor.slate[300] : DefaultColor.slate[200]}
                                    ]}>
                                        <Paragraph
                                            fontSize={12}
                                            fontWeight={isActive ? 700 : 500}
                                            color={isActive ? DefaultColor.slate[700] : DefaultColor.slate[400]}
                                        >
                                            {hookTotal.total.open}
                                        </Paragraph>
                                    </View>
                                )}
                            </XStack>
                        ),
                    },
                    {
                        key: _TransactionStatus.WAITING,
                        item: (isActive) => (
                            <XStack>
                                <Paragraph
                                    style={{
                                        color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                        fontWeight: isActive ? 700 : 'normal'
                                    }}
                                >
                                    Chờ giao dịch
                                </Paragraph>
                                {(props.showTotal && hookTotal.total && hookTotal.total.waiting > 0) && (
                                    <View style={[
                                        DefaultStyle.badgeCircle,
                                        {backgroundColor: isActive ? DefaultColor.slate[300] : DefaultColor.slate[200]}
                                    ]}>
                                        <Paragraph
                                            fontSize={12}
                                            fontWeight={isActive ? 700 : 500}
                                            color={isActive ? DefaultColor.slate[700] : DefaultColor.slate[400]}
                                        >
                                            {hookTotal.total.waiting}
                                        </Paragraph>
                                    </View>
                                )}
                            </XStack>
                        ),
                    },
                    {
                        key: _TransactionStatus.CLOSED,
                        item: (isActive) => (
                            <XStack>
                                <Paragraph
                                    style={{
                                        color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                        fontWeight: isActive ? 700 : 'normal'
                                    }}
                                >
                                    Đóng
                                </Paragraph>
                            </XStack>
                        ),
                    },
                ]}
                activeKey={filter.status}
                onTabPress={(tab) => {
                    setFilter({status: tab});

                }}
                styleTab={{
                    paddingVertical: 12,
                }}
            />
            <ContentWrapper
                style={{
                    flex: 1,
                    marginTop: 10,
                    marginBottom: 60,
                }}>
                {(query.isLoading || query.isRefetching) ? <SkeletonCardSymbol numberCard={2}/> : (
                    <>
                        {(hookCalculate.data && hookCalculate.data.length > 0)
                            ? <>
                                {filter.status === _TransactionStatus.OPEN && (
                                    <XStack gap={"$1"}>
                                        <Paragraph fontWeight={700} color={DefaultColor.slate[400]}>Lãi/Lỗ:</Paragraph>
                                        <Paragraph fontWeight={700} color={hookCalculate.total > 0 ? DefaultColor.green[500] : DefaultColor.red[500]}>{hookCalculate.total.toFixed(2)}</Paragraph>
                                    </XStack>
                                )}

                                {hookCalculate.data.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                }}
                                            >
                                                <Card bordered paddingHorizontal={"$3"} paddingVertical={"$2"} marginVertical={"$2"}
                                                      backgroundColor={DefaultColor.white}>
                                                    <XStack alignItems={"flex-start"} justifyContent={"space-between"} gap={"$2"}>
                                                        {/*symbol and info*/}
                                                        <XStack alignItems={"flex-start"} justifyContent={"flex-start"} gap={"$2"}>
                                                            <SymbolAssetIcons
                                                                symbol={item.symbol.symbol}
                                                                currency_base={item.symbol.currency_base}
                                                                currency_quote={item.symbol.currency_quote || ''}
                                                                size={18}
                                                            />
                                                            <YStack>
                                                                <Paragraph fontSize={16} fontWeight={700}>{item.symbol.symbol}</Paragraph>
                                                                <XStack gap={"$1"} alignItems={"center"}>
                                                                    <Paragraph fontSize={14} fontWeight={500} color={item.type === _TradeType.BUY ? DefaultColor.blue[500] : DefaultColor.red[500]}>
                                                                        {item.type === _TradeType.BUY ? 'Mua' : 'Bán'} {item.volume.toFixed(2)} lô
                                                                    </Paragraph>
                                                                    <Paragraph fontSize={14} fontWeight={500} color={DefaultColor.slate[400]}>
                                                                        at {item.entry_price.toFixed(2)}
                                                                    </Paragraph>
                                                                </XStack>
                                                            </YStack>
                                                        </XStack>
                                                        <YStack gap={"$2"} alignItems={"flex-end"}>
                                                            {filter.status === _TransactionStatus.OPEN &&
                                                                (<>
                                                                    {item.profit ? (
                                                                        <Paragraph fontSize={14} fontWeight={500} color={item.profit > 0 ? DefaultColor.green[500] : DefaultColor.red[500]}>
                                                                            {item.profit.toFixed(2)}
                                                                        </Paragraph>
                                                                    ) : <SkeletonFade/>}
                                                                    {item.realtime_price ? (
                                                                        <Paragraph fontSize={14} fontWeight={500} color={DefaultColor.slate[400]}>
                                                                            {item.realtime_price.toFixed(2)}
                                                                        </Paragraph>
                                                                    ) : <SkeletonFade/>}
                                                                </>)
                                                            }
                                                        </YStack>
                                                    </XStack>
                                                </Card>
                                            </TouchableOpacity>
                                        )
                                    })}
                            </> :
                            (
                                <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center" justifyContent="center" gap="$4">
                                    <Paragraph fontWeight="bold" theme="alt2">Không có lệnh giao dịch nào</Paragraph>
                                    <Paragraph textAlign="center" theme="alt2">Tận dụng cơ hội giao dịch trên các thị trường tài chính lớn trên thế giới</Paragraph>
                                </YStack>
                            )
                        }
                    </>
                )}


            </ContentWrapper>
        </>
    )
}


const SkeletonCardSymbol: FC<{ numberCard?: number }> = ({numberCard = 1}) => (
    <YStack gap={"$2"}>
        {Array.from({length: numberCard}).map((_, index) => (
            <Card
                key={index}
                bordered
                paddingHorizontal="$3"
                paddingVertical="$2"
                marginVertical="$2"
                backgroundColor={DefaultColor.white}
            >
                <XStack alignItems="flex-start" justifyContent="space-between" gap="$2">
                    {/* symbol and info */}
                    <YStack gap="$2">
                        <XStack alignItems="flex-start" justifyContent="flex-start" gap="$2">
                            <SymbolAssetIcons symbol="" currency_base="" currency_quote="" size={18}/>
                            <SkeletonFade/>
                        </XStack>
                    </YStack>

                    <YStack gap="$2" alignItems="flex-end">
                        <SkeletonFade/>
                        <SkeletonFade/>
                    </YStack>
                </XStack>
            </Card>
        ))}
    </YStack>
)

const styles = StyleSheet.create({});


export default TransactionTabs;