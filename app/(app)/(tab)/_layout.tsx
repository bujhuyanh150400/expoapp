import {Tabs} from 'expo-router';
import {StyleSheet} from "react-native";
import { BlurView } from 'expo-blur';
import DefaultColor from "@/components/ui/DefaultColor"

import {FontAwesome6, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";

export const appTabStyle = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: DefaultColor.white,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        borderTopWidth: 0,
        // SHADOW cho iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        // SHADOW cho Android
        elevation: 10,
    }
});
const AppTabLayout = () => {

    return (
        <Tabs
            initialRouteName="index"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: DefaultColor.black,
                tabBarBackground: () => (
                    <BlurView
                        intensity={100}
                        tint={'extraLight'}
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.05)',
                        }}
                    />
                ),
                tabBarItemStyle: {
                    // paddingVertical: 8,
                    // paddingHorizontal: 16,
                },
                tabBarLabelStyle: {
                },
                tabBarStyle: appTabStyle.tabBarStyle,
                sceneStyle: {
                    backgroundColor: DefaultColor.white
                }
            }}
            >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Tài khoản',
                    tabBarIcon: (props) =>
                        <MaterialCommunityIcons name="view-dashboard-outline" size={props.size} color={props.color} />
                }}
            />
            <Tabs.Screen
                name="trade"
                options={{
                    title: 'Giao dịch',
                    tabBarIcon: (props) =>
                        <Ionicons name="bar-chart-outline" size={props.size} color={props.color} />
                }}
            />
            <Tabs.Screen
                name="info"
                options={{
                    title: 'Hồ sơ',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="user-circle" size={props.size}  color={props.color} />,
                }}
            />
        </Tabs>
    )
}

export default AppTabLayout;