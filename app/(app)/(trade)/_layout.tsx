import {Stack} from "expo-router";
import DefaultColor from "@/components/ui/DefaultColor";
import HeaderBack from "@/components/HeaderBack";

export default function TradeLayout () {
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: DefaultColor.white },
            }}
        >
            <Stack.Screen name="trading" options={{
                headerShown: false,
            }} />
            <Stack.Screen name="search" options={{
                header: () => <HeaderBack />,
            }} />
            <Stack.Screen name="editFavorite" options={{
                header: () => <HeaderBack />,
            }} />
        </Stack>
    )
}