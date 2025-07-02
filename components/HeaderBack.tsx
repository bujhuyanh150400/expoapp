import DefaultColor from "@/components/ui/DefaultColor";
import {TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HeaderBack(){
    return (
        <View
            style={{
                backgroundColor: DefaultColor.white,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingTop: 30,
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