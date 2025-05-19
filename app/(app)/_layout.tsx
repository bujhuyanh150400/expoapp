import {Tabs} from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function AppLayout() {
    return (
        <Tabs
            initialRouteName="trade"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#8c8c8c',
                tabBarItemStyle: {
                },
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#ccc',
                    height: 56,
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
                },
        }}
        >
            <Tabs.Screen
                name="trade"
                options={{
                    title: 'Giao dịch',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="money-bill-transfer" size={16} color={props.focused ? '#000' : '#8c8c8c'} />
                }}
            />
            <Tabs.Screen
                name="market"
                options={{
                    title: 'Thị trường',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="globe" size={16} color={props.focused ? '#000' : '#8c8c8c'} />
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Tài khoản',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="wallet" size={16} color={props.focused ? '#000' : '#8c8c8c'} />
                }}
            />
            <Tabs.Screen
                name="info"
                options={{
                    title: 'Hồ sơ',
                    tabBarIcon: (props) =>
                        <FontAwesome6 name="house-user" size={16} color={props.focused ? '#000' : '#8c8c8c'} />
                }}
            />
        </Tabs>
    )
}