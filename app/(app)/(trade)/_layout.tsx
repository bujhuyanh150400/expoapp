import {Stack} from "expo-router";
import DefaultColor from "@/components/ui/DefaultColor";

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
        </Stack>
    )
}