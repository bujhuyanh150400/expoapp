import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import DefaultColor from "@/components/ui/DefaultColor";

type TabItem = {
    key: string;
    item: (isActive: boolean) => React.ReactNode;
};

type Props = {
    tabs: TabItem[];
    activeKey: string;
    onTabPress: (key: string) => void;
    style?: ViewStyle;
};

const HorizontalTabBar: React.FC<Props> = ({ tabs, activeKey, onTabPress, style }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.tabContainer, style]}
        >
            {tabs.map((tab) => {
                const isActive = tab.key === activeKey;
                return (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => onTabPress(tab.key)}
                        style={[styles.tabItem, isActive && styles.tabItemActive]}
                    >
                        {tab.item(isActive)}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

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
        color: DefaultColor.slate[300],
    },
    tabTextActive: {
        color: '#000',
        fontWeight: '600',
    },
});

export default HorizontalTabBar;
