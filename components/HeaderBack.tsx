import DefaultColor from "@/components/ui/DefaultColor";
import {TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HeaderBack(){

    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                backgroundColor: DefaultColor.white,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingTop: insets.top, // 👈 dùng đúng top inset
                paddingBottom: 10, // tuỳ ý thêm padding dưới
            }}
        >
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    padding: 8,
                    borderRadius: 100,
                }}
            >
                <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    )
}