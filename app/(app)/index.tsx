import {View, Text} from "react-native";
import useAuthStore from "@/lib/store/authStore";
import {Button} from "tamagui";

export default function HomeScreen(){

    const {logout} = useAuthStore()

    return (
        <View className="flex-1 items-center justify-center">
            <Button onPress={ async () => {
                await logout();
            }}>Logout</Button>
            <Text className="text-blue-400"> INDEX </Text>
        </View>
    )
}