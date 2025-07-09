import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import {H6, SizableText, Tabs} from "tamagui";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ScrollView} from "react-native-gesture-handler";
import {useState} from "react";
import DefaultColor from "@/components/ui/DefaultColor";
import HorizontalTabBar from "@/components/HorizontalTabBar";

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: DefaultColor.slate[300],
        backgroundColor: '#fff',
    },
    tabItem: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    tabItemActive: {
        borderBottomWidth: 1,
        borderColor: DefaultColor.black,
    },
    tabText: {
        fontSize: 16,
        color: DefaultColor.slate[300],
    },
    tabTextActive: {
        color: '#000',
        fontWeight: '600',
    },
});
const tabList = [
    {
        key: 'test123',
        item: (isActive: boolean) => (
            <Text style={{ color: isActive ? 'black' : '#aaa', fontWeight: isActive ? 'bold' : 'normal' }}>
                🔥 Test 123
            </Text>
        ),
    },
    {
        key: 'tt3123',
        item: (isActive: boolean) => (
            <Text style={{ color: isActive ? 'black' : '#aaa', fontWeight: isActive ? 'bold' : 'normal' }}>
                📊 TT 3123
            </Text>
        ),
    },
];
export default function TradeListScreen() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('test123');
    return (
        <View style={{
            padding: 20,
            paddingTop: insets.top > 0 ? insets.top : 20
        }}>
            <H6 paddingVertical={12} fontWeight={700}>Giao dịch</H6>
            <HorizontalTabBar
                tabs={tabList}
                activeKey={activeTab}
                onTabPress={setActiveTab}
            />
        </View>
    );

}