import {
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    ActivityIndicator,
    FlatList, View, TouchableOpacity
} from "react-native";
import {Card, Input, Paragraph, XStack, YStack} from "tamagui";
import {FontAwesome5} from "@expo/vector-icons";
import React, {FC, useEffect} from "react";
import {SearchSymbolRequest, Symbol} from "@/api/asset_trading/type";
import {useInfiniteQuery} from "@tanstack/react-query";
import assetTradingAPI from "@/api/asset_trading";
import useNestedState from "@/lib/hooks/useNestedState";
import useDebounce from "@/lib/hooks/useDebounce";
import useAppStore from "@/lib/store/appStore";
import {RefreshControl} from "react-native-gesture-handler";
import DefaultColor from "@/components/ui/DefaultColor";
import SymbolAssetIcons from "@/components/SymbolAssetIcons";

const useInfiniteSearchSymbol = (queryParams: SearchSymbolRequest = {}) => {
    return useInfiniteQuery({
        queryKey: ['assetTradingAPI-searchSymbol', queryParams],
        queryFn: ({pageParam = 1}) => {
            return assetTradingAPI.searchSymbol({
                ...queryParams,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage) => {
            const next = lastPage.meta.current_page + 1;
            return next <= lastPage.meta.last_page ? next : undefined;
        },
        initialPageParam: 1,
    });
};

export default function SearchScreen() {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SearchSymbolList onPressItem={(_) => {
                    console.log('test')
                }}/>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export const SearchSymbolList:FC<{
    onPressItem: (item: Symbol) => void;
}> = ({onPressItem}) => {
    const [filter, setFilter] = useNestedState<SearchSymbolRequest>({
        keyword: '',
        page: 1,
    });
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching,
    } = useInfiniteSearchSymbol(filter);

    const flatData = data?.pages.flatMap((page) => page.data) || [];
    const searchFilterDebounce = useDebounce((value: string) => {
        setFilter({keyword: value});
        refetch();
    }, 1000, [setFilter, refetch]);

    // Loading
    const setLoading = useAppStore(state => state.setLoading);
    useEffect(() => {
        setLoading(isLoading || isRefetching);
    }, [isLoading, isRefetching]);

    return (
        <YStack paddingHorizontal={"$4"}>
            <XStack
                alignItems="center"
                borderBottomWidth={1}
                borderColor={DefaultColor.slate[400]}
                marginBottom={"$4"}
            >
                <Input
                    flex={1}
                    unstyled
                    onChangeText={(text) => searchFilterDebounce(text)}
                    placeholder={"Tìm kiếm..."}
                    style={{
                        color: DefaultColor.slate[400],
                        paddingHorizontal: 14,
                        paddingBottom: 12,
                    }}
                />
                <FontAwesome5 name="search" size={14} color={DefaultColor.slate[400]}/>
            </XStack>
            <View>
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
                    renderItem={({item, index}) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onPressItem(item)}
                        >
                            <Card bordered paddingHorizontal={"$3"} paddingVertical={"$2"} marginVertical={"$2"}
                                  backgroundColor={DefaultColor.white}>
                                <XStack alignItems={"flex-start"} justifyContent={"space-between"} gap={"$2"}>
                                    {/*symbol and info*/}
                                    <YStack gap={"$2"}>
                                        <XStack alignItems={"flex-start"} justifyContent={"flex-start"} gap={"$2"}>
                                            <SymbolAssetIcons
                                                symbol={item.symbol}
                                                currency_base={item.currency_base}
                                                currency_quote={item.currency_quote ?? ""}
                                                size={18}
                                            />
                                            <Paragraph fontSize={16} fontWeight={700}>{item.symbol}</Paragraph>
                                        </XStack>
                                        <Paragraph fontSize={12} fontWeight={500} color={DefaultColor.slate[400]}>
                                            {item.currency_base} {item.currency_quote ? `vs ${item.currency_quote}` : ''}
                                        </Paragraph>
                                    </YStack>
                                </XStack>
                            </Card>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </YStack>
    )
}