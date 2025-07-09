import {useRouter} from "expo-router";
import {AssetTradingQueryParams} from "@/api/asset_trading/type";
import {useInfiniteQuery} from "@tanstack/react-query";
import assetTradingAPI from "@/api/asset_trading";
import {ActivityIndicator, FlatList, Keyboard, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {Card, H6, Input, Paragraph, Popover, Separator, XStack, YGroup, YStack} from "tamagui";
import useNestedState, {NestedPartial} from "@/lib/hooks/useNestedState";
import {_AssetType} from "@/lib/@type";
import {AntDesign, FontAwesome5, FontAwesome6} from '@expo/vector-icons';
import PopoverCustom from "@/components/PopoverCustom";
import {RefreshControl, GestureHandlerRootView} from "react-native-gesture-handler";

import useDebounce from "@/lib/hooks/useDebounce";

const useInfiniteAssets = (queryParams: AssetTradingQueryParams = {}) => {
    return useInfiniteQuery({
        queryKey: ['assetTradingAPI-list', queryParams],
        queryFn: ({pageParam = 1}) => {
            return assetTradingAPI.list({
                ...queryParams,
                page: pageParam,
                per_page: 10
            });
        },
        getNextPageParam: (lastPage) => {
            const next = lastPage.meta.current_page + 1;
            return next <= lastPage.meta.last_page ? next : undefined;
        },
        initialPageParam: 1,
    });
};

export default function TradeListScreen() {
    const router = useRouter();
    const [filter, setFilter] = useNestedState<AssetTradingQueryParams>({
        type: _AssetType.CRYPTO,
        keyword: '',
        favorite: true,
        per_page: 10,
        page: 1,
    })

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching,
    } = useInfiniteAssets(filter);

    const flatData = data?.pages.flatMap((page) => page.data) || [];

    const setFilterFetch = (newState: NestedPartial<AssetTradingQueryParams>) => {
        setFilter(newState);
        refetch();
    }

    const searchFilterDebounce = useDebounce((value: string) => {
        setFilter({keyword: value});
        refetch();
    }, 1000, [setFilter, refetch]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{flex: 1, padding: 20}}>
                <H6 paddingVertical={12} fontWeight={700}>Giao dịch</H6>
                {/* Filter */}
                <YStack gap="$2" paddingBottom={12}>
                    {/* Ô tìm kiếm*/}
                    <XStack
                        alignItems="center"
                        borderWidth={1}
                        borderColor="$borderColor"
                        borderRadius={100}
                        paddingVertical="$3"
                        paddingHorizontal="$3"
                        backgroundColor="$background"
                        gap="$2"
                    >
                        <FontAwesome5 name="search" size={14} color="black"/>
                        <Input
                            flex={1}
                            unstyled
                            onChangeText={(text) => searchFilterDebounce(text)}
                            placeholder={"Tìm kiếm..."}
                        />
                    </XStack>
                    <XStack gap="$2">
                        {/* Favorite */}
                        <TouchableOpacity
                            disabled={isRefetching || isLoading}
                            style={{
                                paddingVertical: 2,
                                paddingHorizontal: 12,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: filter.favorite ? '#FDE68A' : '#ccc',
                                backgroundColor: filter.favorite ? '#FDE68A' : '#F2F2F2',
                                alignSelf: 'flex-start',
                                alignItems: "center",
                                flexDirection: "row",
                                gap: 4,
                            }}
                            onPress={() => {
                                setFilterFetch({favorite: !filter.favorite});
                            }}
                        >
                            <AntDesign name="star" size={12} color="#616161"/>
                            <Paragraph fontSize={12} color="#616161" fontWeight={500}>Mục yêu thích</Paragraph>
                        </TouchableOpacity>

                        {/* type */}
                        <PopoverCustom
                            shouldAdapt={false}
                            height={135}
                            width={200}
                            Trigger={
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 2,
                                        paddingHorizontal: 12,
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        backgroundColor: '#E5E5E5',
                                        alignSelf: 'flex-start',
                                        alignItems: "center",
                                        flexDirection: "row",
                                        gap: 4,
                                    }}
                                >
                                    {filter.type === _AssetType.CRYPTO && (<>
                                        <FontAwesome6 name="coins" size={12} color="#616161"/>
                                        <Paragraph fontSize={12} color="#616161" fontWeight={500}>Crypto</Paragraph>
                                    </>)}
                                    {filter.type === _AssetType.METAL && (<>
                                        <FontAwesome6 name="wand-magic-sparkles" size={12} color="#616161"/>
                                        <Paragraph fontSize={12} color="#616161" fontWeight={500}>Kim loại</Paragraph>
                                    </>)}
                                    {filter.type === _AssetType.ENERGY && (<>
                                        <FontAwesome6 name="oil-well" size={12} color="#616161"/>
                                        <Paragraph fontSize={12} color="#616161" fontWeight={500}>Dầu khí</Paragraph>
                                    </>)}
                                </TouchableOpacity>
                            }
                        >
                            <YGroup separator={<Separator/>} style={{flex: 1, width: "100%"}}>
                                <YGroup.Item>
                                    <Popover.Close asChild>
                                        <TouchableOpacity
                                            disabled={isRefetching || isLoading}
                                            onPress={() => {
                                                filter.type !== _AssetType.CRYPTO && setFilterFetch({type: _AssetType.CRYPTO});
                                            }}
                                            style={{
                                                width: "100%",
                                                padding: 10,
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                gap: 12,
                                            }}
                                        >
                                            <FontAwesome6 name="coins" size={14} color="#616161"/>
                                            <Paragraph fontSize={14} color="#616161" fontWeight={500}>Crypto</Paragraph>
                                        </TouchableOpacity>
                                    </Popover.Close>
                                </YGroup.Item>
                                <YGroup.Item>
                                    <Popover.Close asChild>
                                        <TouchableOpacity
                                            disabled={isRefetching || isLoading}
                                            onPress={() => {
                                                filter.type !== _AssetType.METAL && setFilterFetch({type: _AssetType.METAL});
                                            }}
                                            style={{
                                                width: "100%",
                                                padding: 10,
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                gap: 12,
                                            }}>
                                            <FontAwesome6 name="wand-magic-sparkles" size={14} color="#616161"/>
                                            <Paragraph fontSize={14} color="#616161" fontWeight={500}>Kim
                                                loại</Paragraph>
                                        </TouchableOpacity>
                                    </Popover.Close>
                                </YGroup.Item>
                                <YGroup.Item>
                                    <Popover.Close asChild>
                                        <TouchableOpacity
                                            disabled={isRefetching || isLoading}
                                            onPress={() => {
                                                filter.type !== _AssetType.ENERGY && setFilterFetch({type: _AssetType.ENERGY});
                                            }}
                                            style={{
                                                width: "100%",
                                                padding: 10,
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                gap: 12,
                                            }}>
                                            <FontAwesome6 name="oil-well" size={14} color="#616161"/>
                                            <Paragraph fontSize={14} color="#616161" fontWeight={500}>Dầu
                                                khí</Paragraph>
                                        </TouchableOpacity>
                                    </Popover.Close>
                                </YGroup.Item>
                            </YGroup>
                        </PopoverCustom>

                    </XStack>
                </YStack>
                {/* list */}
                <XStack paddingVertical={6} gap={4}>
                    <Paragraph fontSize={18} fontWeight={700}>
                        Danh sách
                    </Paragraph>
                    <Paragraph fontSize={18} fontWeight={700}>
                        {filter.type === _AssetType.CRYPTO && "Crypto"}
                        {filter.type === _AssetType.METAL && "Kim loại"}
                        {filter.type === _AssetType.ENERGY && "Dầu khí & Năng lượng"}
                    </Paragraph>
                    {(isLoading || isRefetching) && (
                        <ActivityIndicator color="blue"/>
                    )}
                </XStack>
                <Card flex={1} padded backgroundColor={"#fff"}>
                    <FlatList
                        data={flatData}
                        keyExtractor={(item) => String(item.symbol)}
                        onEndReached={() => {
                            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                        }}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => {
                            if (!isFetchingNextPage) return null;
                            return <ActivityIndicator style={{marginVertical: 10}}/>;
                        }}
                        refreshControl={
                            <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()}/>
                        }
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#eee",
                                    paddingVertical: 8,
                                }}
                                onPress={() => {
                                    router.push({
                                        pathname: '/(app)/(trade)/trading',
                                        params: {
                                            symbol: item.symbol
                                        }
                                    })
                                }}
                            >
                                <XStack justifyContent="space-between" alignItems="center">
                                    <XStack alignItems="center" gap="$2">
                                        <View style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "100%",
                                            backgroundColor: "#ddd"
                                        }}/>
                                        <YStack>
                                            <Paragraph fontWeight={500}>{item.symbol}</Paragraph>
                                            <Paragraph fontWeight={500} fontSize={12} color="#ccc"  numberOfLines={1} ellipsizeMode="tail">
                                                {item.type === _AssetType.CRYPTO && `${item.currency_base} - ${item.currency_quote}`}
                                                {[_AssetType.METAL,_AssetType.ENERGY].includes(item.type) && `${item.name} - ${item.category}`}
                                            </Paragraph>
                                        </YStack>
                                    </XStack>
                                    <FontAwesome6 name="arrow-right-to-bracket" size={18} color="#7D7D7D"/>
                                </XStack>
                            </TouchableOpacity>
                        )}
                    />
                </Card>
            </View>
        </TouchableWithoutFeedback>
    )
}
