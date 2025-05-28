import {Text, View} from "react-native";
import {useFocusEffect, useNavigation} from "expo-router";
import {ListItem, Separator, YGroup} from "tamagui";
import {ChevronRight} from "@tamagui/lucide-icons";
import {_AccountType} from "@/lib/@type";


export default function AddStepOneScreen() {
    const navigation = useNavigation();

    useFocusEffect(() => {
        // Ẩn tab bar khi màn hình này được focus
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });

        // Hiện lại tab bar khi rời khỏi
        return () => {
            navigation.getParent()?.setOptions({ tabBarStyle: undefined });
        };
    });

    return (
        <YGroup separator={<Separator/>}>
            <YGroup.Item>
                <ListItem
                    title="Tài khoản thật"
                    subTitle="Tài khoản không rủi ro. Giao dịch bằng tiền ảo"
                    backgroundColor={"white"}
                    pressTheme
                    iconAfter={ChevronRight}
                    onPress={() => setNextStep(_AccountType.REAL_ACCOUNT)}
                />
            </YGroup.Item>
            <YGroup.Item>
                <ListItem
                    title="Tài khoản credit"
                    subTitle="Giao dịch bằng tiền thật và rút bất kỳ khoản lợi nhuận nào bạn kiếm được"
                    backgroundColor={"white"}
                    pressTheme
                    iconAfter={ChevronRight}
                    onPress={() => setNextStep(_AccountType.TEST_ACCOUNT)}
                />
            </YGroup.Item>
        </YGroup>
    )
}