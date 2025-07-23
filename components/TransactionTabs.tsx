import {Account} from "@/api/account/type";
import {Dispatch, FC, SetStateAction, useEffect, useState, useRef, MutableRefObject} from "react";
import {_TradeType, _TransactionStatus} from "@/lib/@type";
import {Button, Card, Paragraph, Sheet, XStack, YStack} from "tamagui";
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
import useCalculateTransactionPrices, {CalculateTransactionPrices} from "@/lib/hooks/useCalculateTransactionPrices";


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
    const [openInfo, setOpenInfo] = useState<boolean>(false);

    const selectedTransactionRef = useRef<number | null>(null);

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
                                        <Paragraph fontWeight={700}
                                                   color={hookCalculate.total > 0 ? DefaultColor.green[500] : DefaultColor.red[500]}>{hookCalculate.total.toFixed(2)}</Paragraph>
                                    </XStack>
                                )}

                                {hookCalculate.data.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                setOpenInfo(true);
                                                selectedTransactionRef.current = item.id;
                                            }}
                                        >
                                            <Card bordered paddingHorizontal={"$3"} paddingVertical={"$2"}
                                                  marginVertical={"$2"}
                                                  backgroundColor={DefaultColor.white}>
                                                <XStack alignItems={"flex-start"} justifyContent={"space-between"}
                                                        gap={"$2"}>
                                                    {/*symbol and info*/}
                                                    <XStack alignItems={"flex-start"} justifyContent={"flex-start"}
                                                            gap={"$2"}>
                                                        <SymbolAssetIcons
                                                            symbol={item.symbol.symbol}
                                                            currency_base={item.symbol.currency_base}
                                                            currency_quote={item.symbol.currency_quote || ''}
                                                            size={18}
                                                        />
                                                        <YStack gap={"$2"}>
                                                            <Paragraph fontSize={16}
                                                                       fontWeight={700}>{item.symbol.symbol}</Paragraph>
                                                            <XStack gap={"$1"} alignItems={"center"}>
                                                                <Paragraph fontSize={14} fontWeight={500}
                                                                           color={item.type === _TradeType.BUY ? DefaultColor.blue[500] : DefaultColor.red[500]}>
                                                                    {item.type === _TradeType.BUY ? 'Mua' : 'Bán'} {item.volume.toFixed(2)} lô
                                                                </Paragraph>
                                                                <Paragraph fontSize={14} fontWeight={500}
                                                                           color={DefaultColor.slate[400]}>
                                                                    at {item.entry_price.toFixed(2)}
                                                                </Paragraph>
                                                            </XStack>
                                                        </YStack>
                                                    </XStack>
                                                    <YStack gap={"$2"} alignItems={"flex-end"}>
                                                        {filter.status === _TransactionStatus.OPEN &&
                                                            (<>
                                                                {item.profit ? (
                                                                    <Paragraph fontSize={14} fontWeight={500}
                                                                               color={item.profit > 0 ? DefaultColor.green[500] : DefaultColor.red[500]}>
                                                                        {item.profit.toFixed(2)}
                                                                    </Paragraph>
                                                                ) : <SkeletonFade/>}
                                                                {item.realtime_price ? (
                                                                    <Paragraph fontSize={14} fontWeight={500}
                                                                               color={DefaultColor.slate[400]}>
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
                                <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center"
                                        justifyContent="center" gap="$4">
                                    <Paragraph fontWeight="bold" theme="alt2">Không có lệnh giao dịch nào</Paragraph>
                                    <Paragraph textAlign="center" theme="alt2">Tận dụng cơ hội giao dịch trên các thị
                                        trường tài chính lớn trên thế giới</Paragraph>
                                </YStack>
                            )
                        }
                    </>
                )}
            </ContentWrapper>
            <TransactionInfo item={selectedTransactionRef} setOpen={setOpenInfo} open={openInfo} hookCalculate={hookCalculate} />
        </>
    )
}


const TransactionInfo: FC<{
    item: MutableRefObject<number | null>;
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    hookCalculate: ReturnType<typeof useCalculateTransactionPrices>
}> = ({item, open, setOpen, hookCalculate}) => {
    const data = hookCalculate.data.find(tx => tx.id === item.current);

    return (
        <Sheet
            forceRemoveScrollEnabled={true}
            modal={true}
            open={open}
            onOpenChange={(open: boolean) => {
                setOpen(open);
                if (!open) {
                   item.current = null;
                }
            }}
            snapPointsMode={"fit"}
            dismissOnSnapToBottom
            zIndex={200_000}
            animation={"manual"}
        >
            <Sheet.Overlay
                animation="manual"
                backgroundColor="$shadow6"
                enterStyle={{opacity: 0}}
                exitStyle={{opacity: 0}}
            />
            <Sheet.Handle/>
            <Sheet.Frame padding="$4" gap="$2">
                {data && (
                    <YStack gap={"$2"}>
                        <XStack alignItems={"flex-start"} justifyContent={"space-between"} marginBottom={"$2"}>
                            <XStack alignItems={"flex-start"} justifyContent={"flex-start"}
                                    gap={"$2"}>
                                <SymbolAssetIcons
                                    symbol={data.symbol.symbol}
                                    currency_base={data.symbol.currency_base}
                                    currency_quote={data.symbol.currency_quote || ''}
                                    size={18}
                                />
                                <YStack gap={"$2"}>
                                    <Paragraph fontSize={16}
                                               fontWeight={700}>{data.symbol.symbol}</Paragraph>
                                    <XStack gap={"$1"} alignItems={"center"}>
                                        <Paragraph fontSize={14} fontWeight={500}
                                                   color={data.type === _TradeType.BUY ? DefaultColor.blue[500] : DefaultColor.red[500]}>
                                            {data.type === _TradeType.BUY ? 'Mua' : 'Bán'} {data.volume.toFixed(2)} lô
                                        </Paragraph>
                                        <Paragraph fontSize={14} fontWeight={500}
                                                   color={DefaultColor.slate[400]}>
                                            at {data.entry_price.toFixed(2)}
                                        </Paragraph>
                                    </XStack>
                                </YStack>
                            </XStack>
                            <YStack gap={"$2"} alignItems={"flex-end"}>
                                {data.status === _TransactionStatus.OPEN &&
                                    (<>
                                        {data.profit ? (
                                            <Paragraph fontSize={14} fontWeight={500}
                                                       color={data.profit > 0 ? DefaultColor.green[500] : DefaultColor.red[500]}>
                                                {data.profit.toFixed(2)}
                                            </Paragraph>
                                        ) : <SkeletonFade/>}
                                        {data.realtime_price ? (
                                            <Paragraph fontSize={14} fontWeight={500}
                                                       color={DefaultColor.slate[400]}>
                                                {data.realtime_price.toFixed(2)}
                                            </Paragraph>
                                        ) : <SkeletonFade/>}
                                    </>)
                                }
                            </YStack>
                        </XStack>
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Trạng thái:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.status === _TransactionStatus.OPEN && 'Mở'}
                                {data.status === _TransactionStatus.WAITING && 'Chờ giao dịch'}
                                {data.status === _TransactionStatus.CLOSED && 'Đóng'}
                            </Paragraph>
                        </XStack>
                        {/*Giá mở*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Giá mở:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.entry_price.toFixed(2)}
                            </Paragraph>
                        </XStack>
                        {/*Giá đóng*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Giá đóng:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.close_price ? data.close_price.toFixed(2) : '__'}
                            </Paragraph>
                        </XStack>
                        {/*Giá đóng*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Lỗ/Lãi:</Paragraph>
                            {data.profit ? (
                                <Paragraph fontWeight={500}
                                           color={data.profit > 0 ? DefaultColor.green[500] : DefaultColor.red[500]}>
                                    {data.profit.toFixed(2)}
                                </Paragraph>
                            ) : <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>__</Paragraph>}
                        </XStack>
                        {/*Thời gian mở*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Thời gian mở:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.open_at ? new Date(data.open_at).toLocaleString() : '__'}
                            </Paragraph>
                        </XStack>
                        {/*Thời gian đóng*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Thời gian đóng:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.close_at ? new Date(data.close_at).toLocaleString() : '__'}
                            </Paragraph>
                        </XStack>
                        {/*Giá chốt */}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Giá chốt giao dịch:</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.trigger_price ? data.trigger_price.toFixed(2) : '__'}
                            </Paragraph>
                        </XStack>
                        {/*Cắt Lỗ*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Cắt lỗ (SL)</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.stop_loss ? data.stop_loss.toFixed(2) : '__'}
                            </Paragraph>
                        </XStack>
                        {/*Chốt lời*/}
                        <XStack alignItems={"center"} justifyContent={"space-between"}>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[500]}>Chốt lời (TP)</Paragraph>
                            <Paragraph fontWeight={500} color={DefaultColor.slate[700]}>
                                {data.take_profit ? data.take_profit.toFixed(2) : '__'}
                            </Paragraph>
                        </XStack>
                        {data.status === _TransactionStatus.OPEN && (
                            <Button>
                                Đóng giao dịch
                            </Button>
                        )}
                    </YStack>
                )}
            </Sheet.Frame>
        </Sheet>
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

export default TransactionTabs;