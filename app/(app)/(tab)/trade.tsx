import {TouchableOpacity, View} from "react-native";
import {Card, H6, Paragraph, Sheet, XStack, YStack} from "tamagui";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useState} from "react";
import DefaultColor from "@/components/ui/DefaultColor";
import HorizontalTabBar from "@/components/HorizontalTabBar";
import {_AssetType} from "@/lib/@type";
import {AntDesign, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import SymbolAssetIcons from "@/components/SymbolAssetIcons";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import {router} from "expo-router";

const listData = [
    {
        id: 1,
        symbol: 'BTC/USD',
        currency_base: 'Bitcoin',
        currency_quote: 'United States Dollar',
        price: '31750.42',
        percent: '2.35',
        status:"up",
        type: '_AssetType.CRYPTO',
    },
    {
        id: 2,
        symbol: 'ETH/VND',
        currency_base: 'Ethereum',
        currency_quote: 'Vietnamese Dong',
        price: '75000000',
        percent: '1.20',
        status:"up",
        type: '_AssetType.CRYPTO',
    },
    {
        id: 3,
        symbol: 'XAU/USD',
        currency_base: 'Gold',
        currency_quote: 'United States Dollar',
        price: '2298.20',
        percent: '0.35',
        status:"up",
        type: '_AssetType.METAL',
    },
    {
        id: 4,
        symbol: 'XAG/USD',
        currency_base: 'Silver',
        currency_quote: 'United States Dollar',
        price: '28.42',
        percent: '0.50',
        status:"down",
        type: '_AssetType.METAL',
    },
    {
        id: 5,
        symbol: 'USD/JPY',
        currency_base: 'United States Dollar',
        currency_quote: 'Japanese Yen',
        price: '146.75',
        percent: '0.15',
        status:"down",
        type: '_AssetType.FOREX',
    },
    {
        id: 6,
        symbol: 'EUR/USD',
        currency_base: 'Euro',
        currency_quote: 'United States Dollar',
        price: '1.0834',
        percent: '0.25',
        status:"up",
        type: '_AssetType.FOREX',
    },
    {
        id: 7,
        symbol: 'GBP/USD',
        currency_base: 'British Pound',
        currency_quote: 'United States Dollar',
        price: '1.2375',
        percent: '0.10',
        status:"down",
        type: '_AssetType.FOREX',
    },
    {
        id: 8,
        symbol: 'USD/CAD',
        currency_base: 'United States Dollar',
        currency_quote: 'Canadian Dollar',
        price: '1.3582',
        percent: '0.18',
        status:"up",
        type: '_AssetType.FOREX',
    },
    {
        id: 9,
        symbol: 'OIL/USD',
        currency_base: 'Crude Oil',
        currency_quote: 'United States Dollar',
        price: '82.15',
        percent: '1.05',
        status:"down",
        type: '_AssetType.ENERGY',
    },
    {
        id: 10,
        symbol: 'GAS/USD',
        currency_base: 'Natural Gas',
        currency_quote: 'United States Dollar',
        price: '2.85',
        percent: '0.45',
        status:"down",
        type: '_AssetType.ENERGY',
    },
];

export default function TradeListScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState<_AssetType>(_AssetType.FAVORITE);

    return (
        <>
            <LayoutScrollApp style={{marginBottom: insets.bottom + 40}}>
                <XStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={"$2"}
                    paddingHorizontal={"$2"}
                >
                    <H6 paddingVertical={12} fontWeight={700}>Giao dịch</H6>
                    <TouchableOpacity onPress={() => router.push("/(app)/(trade)/search")}>
                        <FontAwesome5 name="search" size={20} color="black" />
                    </TouchableOpacity>
                </XStack>
                <HorizontalTabBar<_AssetType>
                    tabs={[
                        {
                            key: _AssetType.FAVORITE,
                            item: (isActive) => (
                                <View style={{
                                    alignItems:"center",
                                    gap: 4,
                                    flexDirection:"row"
                                }}
                                >
                                    <AntDesign name="staro" size={16} color={
                                        isActive ? DefaultColor.yellow[600] : DefaultColor.slate[300]
                                    } />
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Yêu thích
                                    </Paragraph>
                                </View>
                            ),
                        },
                        {
                            key: _AssetType.CRYPTO,
                            item: (isActive) => (
                                <View style={{
                                    alignItems:"center",
                                    gap: 4,
                                    flexDirection:"row"
                                }}
                                >
                                    <FontAwesome5 name="coins" size={16} color={
                                        isActive ? DefaultColor.yellow[600] : DefaultColor.slate[300]
                                    } />
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Crypto
                                    </Paragraph>
                                </View>
                            ),
                        },
                        {
                            key: _AssetType.METAL,
                            item: (isActive) => (
                                <View style={{
                                    alignItems:"center",
                                    gap: 4,
                                    flexDirection:"row"
                                }}
                                >
                                    <FontAwesome6 name="wand-magic-sparkles" size={16} color={
                                        isActive ? DefaultColor.yellow[600] : DefaultColor.slate[300]
                                    } />
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Kim loại
                                    </Paragraph>
                                </View>
                            ),
                        },
                        {
                            key: _AssetType.ENERGY,
                            item: (isActive) => (
                                <View style={{
                                    alignItems:"center",
                                    gap: 4,
                                    flexDirection:"row"
                                }}
                                >
                                    <FontAwesome6 name="oil-well" size={16} color={
                                        isActive ? DefaultColor.yellow[600] : DefaultColor.slate[300]
                                    } />
                                    <Paragraph
                                        style={{
                                            color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                            fontWeight: isActive ? 700 : 'normal'
                                        }}
                                    >
                                        Dầu khí & năng lượng
                                    </Paragraph>
                                </View>
                            ),
                        }
                    ]}
                    activeKey={activeTab}
                    onTabPress={setActiveTab}
                />
                <YStack marginTop={"$4"} gap={"$2"}>
                    {activeTab === _AssetType.FAVORITE && (
                        <XStack>
                            <TouchableOpacity style={{
                                paddingHorizontal:10,
                                paddingVertical: 2,
                                borderRadius: 20,
                                backgroundColor:DefaultColor.slate[200],
                                flexDirection:"row",
                                gap:"4",
                                alignItems:"center"
                            }}>
                                <Paragraph fontWeight={500}>Chỉnh sửa</Paragraph>
                                <FontAwesome5 name="edit" size={14} color="black" />
                            </TouchableOpacity>
                        </XStack>
                    )}
                    {listData.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                        >
                            <Card bordered paddingHorizontal={"$3"} paddingVertical={"$2"} marginVertical={"$2"} backgroundColor={DefaultColor.white}>
                                <XStack alignItems={"flex-start"} justifyContent={"space-between"} gap={"$2"}>
                                    {/*symbol and info*/}
                                    <YStack gap={"$2"}>
                                        <XStack alignItems={"flex-start"} justifyContent={"flex-start"} gap={"$2"}>
                                            <SymbolAssetIcons
                                                symbol={item.symbol}
                                                currency_base={item.currency_base}
                                                currency_quote={item.currency_quote}
                                                size={18}
                                            />
                                            <Paragraph fontSize={16} fontWeight={700}>{item.symbol}</Paragraph>
                                        </XStack>
                                        <Paragraph fontSize={12} fontWeight={500} color={DefaultColor.slate[400]}>
                                            {item.currency_base} vs {item.currency_quote}
                                        </Paragraph>
                                    </YStack>
                                    <YStack gap={"$2"} alignItems={"flex-end"}>
                                        <Paragraph fontSize={14} fontWeight={700} color={DefaultColor.black}>
                                            {item.price}
                                        </Paragraph>
                                        <Paragraph fontSize={14} fontWeight={700} color={item.status === "up" ? DefaultColor.green[400] : DefaultColor.red[400]}>
                                            {item.status === "up" ? "+" : "-"}
                                            {item.percent} %
                                        </Paragraph>
                                    </YStack>
                                </XStack>

                            </Card>
                        </TouchableOpacity>
                    ))}
                </YStack>
            </LayoutScrollApp>
        </>
    );
}
