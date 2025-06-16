import {useRouter} from "expo-router";
import {ListItem, Separator, YGroup} from "tamagui";
import {ChevronRight} from "@tamagui/lucide-icons";
import {_AccountType} from "@/lib/@type";
import useAddAccountStore from "@/lib/store/addAccountStore";
import {useCallback} from "react";
import useHideTabLayout from "@/lib/hooks/useHideTabLayout";


export default function AddStepOneScreen() {
    // Ẩn tab layout
    useHideTabLayout()

    const router = useRouter();

    const {setStepOne} = useAddAccountStore();

    const setNextStep = useCallback((type: _AccountType) => {
        setStepOne({account_type: type});
        router.push('/(app)/(account)/addStepTwo');
    }, [])

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