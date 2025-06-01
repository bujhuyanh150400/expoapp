import {View, Text} from "react-native";
import {useQuery} from "@tanstack/react-query";
import referenceApi from "@/api/reference";


export default function MarketScreen(){



    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-blue-400"> Market </Text>
        </View>
    )
}